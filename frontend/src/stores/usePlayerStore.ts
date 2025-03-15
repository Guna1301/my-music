import { Song } from '@/types'
import {create} from 'zustand'
import { useChatStore } from './useChatStore';

interface PlayerStore{
    currentSong: Song | null;
    isPlaying : boolean;
    queue:Song[]
    currentIndex: number;

    initializeQueue : (songs: Song[]) => void;
    PlayAlbum : (songs:Song[], startIndex?:number)=>void;
    setCurrentSong:(song:Song |null)=>void;
    togglePlay: ()=>void;
    playNext:()=>void;
    playPrevious:()=>void;
}

export const usePlayerStore = create<PlayerStore>((set,get)=>({
    currentSong:null,
    isPlaying:false,
    queue:[],
    currentIndex:-1,

    initializeQueue: (songs:Song[])=>{
        set({
            queue:songs,
            currentSong:get().currentSong || songs[0],
            currentIndex:get().currentIndex === -1?0 : get().currentIndex
        })
    },

    PlayAlbum: (songs:Song[],startIndex=0)=>{
        if(songs.length===0){
            return;
        }
        const song = songs[startIndex]
        const socket = useChatStore.getState().socket;
        if(socket.auth){
            socket.emit("update_activity",{
                userId:socket.auth.userId,
                activity:`Playing ${song.title} by ${song.artist}`
            })
        }
        set({
            queue:songs,
            currentSong:song,
            currentIndex:startIndex,
            isPlaying:true
        })
    },

    setCurrentSong: (song:Song|null)=>{
        if(!song){
            return;
        }

        const socket = useChatStore.getState().socket;
        if(socket.auth){
            socket.emit("update_activity",{
                userId:socket.auth.userId,
                activity:`Playing ${song.title} by ${song.artist}`
            })
        }

        const songIndex = get().queue.findIndex(s=> s._id===song._id);

        set({
            currentSong:song,
            isPlaying:true,
            currentIndex: songIndex!==-1? songIndex : get().currentIndex
        })


    },

    togglePlay:()=>{
        // negate the state
        const willStartPlaying = !get().isPlaying;

        const currSong = get().currentSong;
        const socket = useChatStore.getState().socket;
        if(socket.auth){
            socket.emit("update_activity",{
                userId:socket.auth.userId,
                activity:
                willStartPlaying && currSong ? `Playing ${currSong.title} by ${currSong.artist}` :"Idle"
            })
        }

        set({
            isPlaying:willStartPlaying
        })
    },

    playNext:()=>{
        const {queue,currentIndex} = get();
        const nextIndex = (currentIndex+1)%queue.length;

        //if there is next song to play, lets play it
        if(nextIndex<queue.length){
            const nextSong = queue[nextIndex];
            const socket = useChatStore.getState().socket;
            if(socket.auth){
                socket.emit("update_activity",{
                    userId:socket.auth.userId,
                    activity:`Playing ${nextSong.title} by ${nextSong.artist}`
                })
            }
            set({
                currentSong:nextSong,
                isPlaying:true,
                currentIndex:nextIndex
            })
        }else{
            //no next song
            set({
                isPlaying:false
            })
            const socket = useChatStore.getState().socket;
            if(socket.auth){
                socket.emit("update_activity",{
                    userId:socket.auth.userId,
                    activity:"Idle"
                })
            }
            
        }
    },

    playPrevious:()=>{
        const {queue,currentIndex} = get();
        const prevIndex = (currentIndex-1+queue.length)%queue.length;
        //if there is previous song to play, lets play it
        if(prevIndex>=0){
            const prevSong = queue[prevIndex];
            const socket = useChatStore.getState().socket;
            if(socket.auth){
                socket.emit("update_activity",{
                    userId:socket.auth.userId,
                    activity:`Playing ${prevSong.title} by ${prevSong.artist}`
                })
            }
            set({
                currentSong:prevSong,
                isPlaying:true,
                currentIndex:prevIndex
            })
            }else{
                //no previous song
                set({
                    isPlaying:false
                })
                const socket = useChatStore.getState().socket;
                if(socket.auth){
                    socket.emit("update_activity",{
                        userId:socket.auth.userId,
                        activity:"Idle"
                    })
                }
            }
                        
    },
    

}))