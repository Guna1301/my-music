import {Server} from 'socket.io'
import Message from '../models/message.model.js'

export const initializeSocket = (server)=>{
    const io = new Server(server,{
        cors:{
            origin:"http://localhost:3000",
            credentials:true
        }
    })

    const userSockets = new Map(); // {userId: socketId}
    const useActivities = new Map(); // {userId: activities}

    io.on("connection",(socket)=>{
        socket.on("user_connected",(userId)=>{
            userSockets.set(userId,socket.id);
            useActivities.set(userId,"Idle");

            //broadcast to all connected sockets that this user is online
            io.emit("user_connected",userId)

            socket.emit("users_online",Array.from(userSockets.keys()))

            io.emit("activities", Array.from(useActivities.entries()))
        })

        socket.on("update_activity",(userId,activity)=>{
            useActivities.set(userId,activity)

            io.emit("activity_updated",(userId,activity))
        })

        socket.on("send_message",async (data)=>{
            try {
                const{senderId,receiverId,content} = data
                const message = Message.create({
                    senderId,receiverId,content
                })
                // send to receiver in realtime, if they are online
                const receiverSocketId = userSockets.get(receiverId)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("receive_message",message)
                }

                socket.emit("message_sent",message)
            } catch (error) {
                console.log("message error ",error)
                socket.emit("message_error",error.message)
            }
        })

        socket.on("disconnect",()=>{
            let disconnectedUserId;
            for(const [userId,socketId] of userSockets.entries()){
                // find disconneted user
                if(socketId === socket.id){
                    disconnectedUserId = userId;
                    userSockets.delete(userId)
                    useActivities.delete(userId)
                    break;
                }
            }
            if(disconnectedUserId){
                io.emit('user_disconnected',disconnectedUserId)
            }
        })

    })
}