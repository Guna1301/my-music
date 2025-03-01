import { Song } from '@/types'
import {create} from 'zustand'

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
        }
    },

    playPrevious:()=>{
        const {queue,currentIndex} = get();
        const prevIndex = (currentIndex-1+queue.length)%queue.length;
        //if there is previous song to play, lets play it
        if(prevIndex>=0){
            const prevSong = queue[prevIndex];
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
            }
                        
    },
    

}))