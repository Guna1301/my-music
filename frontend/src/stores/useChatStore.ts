/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/lib/axios';
import { Message, User } from '@/types';
import {create} from 'zustand';
import {io} from 'socket.io-client'

interface ChatStore {
    users: User[];
    isLoading: boolean;
    error: string|null;
    socket:any;
    isConnected :boolean;
    onlineUsers:Set<string>
    useActivities:Map<string,string>
    messages :Message[];
    selectedUser :User| null
    fetchUsers: () => Promise<void>;
    initSocket :(userId:string)=>void;
    disconnectSocket :()=>void;
    sendMessage:(receiverId:string, senderId:string,content:string)=>void
    fetchMessages:(userId:string)=>void
    setSelectedUser:(user:User|null)=>void;
}

const baseURL = 'https://my-music-backend.onrender.com'
const socket = io(baseURL,{
    autoConnect: false, // only connect if user is authenticated 
    withCredentials:true,
})

export const useChatStore = create<ChatStore>((set,get)=>({
    users: [],
    isLoading: false,
    error: null,
    socket:socket,
    isConnected :false,
    onlineUsers:new Set(),
    useActivities:new Map(),
    messages: [],
    selectedUser: null,

    setSelectedUser(user) { 
        set({ selectedUser: user });
        
    },


    fetchUsers: async () => {
        set({isLoading: true, error: null});
        try {
            const res = await axiosInstance.get('/users');
            set({users: res.data});
        } catch (error: any) {
            set({error: error.message});
        }finally{
            set({isLoading: false}); 
        } 
    },
    initSocket:(userId:string)=>{
        if(!get().isConnected){
            socket.auth = {userId}
            socket.connect();
            socket.emit("user_connected",userId)

            socket.on("users_online",(users:string[])=>{
                set({onlineUsers:new Set(users)})
            })

            socket.on("activities",(activities:[string,string][])=>{
                set({useActivities:new Map(activities)})
            })

            socket.on("user_connected",(userId:string)=>{
                set((state)=>({
                    onlineUsers:new Set([...state.onlineUsers,userId])
                }))
            })

            socket.on("user_disconnected",(userId:string)=>{
                set((state)=>{
                    const newOnlineUsers = new Set(state.onlineUsers)
                    newOnlineUsers.delete(userId)
                    return {onlineUsers:newOnlineUsers}
                })
            })

            socket.on("receive_message",(message:Message)=>{
                set((state)=>({
                    messages:[...state.messages,message]
                }))
            })

            socket.on("message_sent",(message:Message)=>{
                set((state)=>({
                    messages:[...state.messages,message]
                }))
            })

            socket.on("activity_updated",({userId,activity})=>{
                set((state)=>{
                    const newActivities = new Map(state.useActivities)
                    newActivities.set(userId,activity)
                    return {useActivities:newActivities}
                })
            })
            set({isConnected:true})

        }
    },

    disconnectSocket:()=> {
        if(get().isConnected){
            socket.disconnect();
            set({isConnected:false})
        }
        
    },

    sendMessage: async(receiverId, senderId, content) =>{
        const socket = get().socket;
        if(!socket){
            return;
        }
        socket.emit("send_message",{receiverId, senderId, content})
    },

    fetchMessages : async(userId:string)=>{
        set({isLoading:true,error:null})
        try {
            const response = await axiosInstance.get(`/users/messages/${userId}`)
            set({ messages:response.data})
        } catch (error:any) {
            set({error:error.message})
        }finally{
            set({isLoading:false})
        }
    }

})) 