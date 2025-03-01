import { usePlayerStore } from "@/stores/usePlayerStore"
import { useEffect, useRef } from "react"

function AudioPlayer() {

    const audioref = useRef<HTMLAudioElement>(null)
    const prevSongRef = useRef<string | null>(null)

    const {currentSong,isPlaying, playNext} = usePlayerStore()

    // handle play and pause logic

    useEffect(()=>{
        if(isPlaying){
            audioref.current?.play()
        }else{
            audioref.current?.pause()
        }
    },[isPlaying])

    // handle song ends
    useEffect(()=>{
        const audio  = audioref.current

        const handleEnded= ()=>{
            playNext()
        }

        audio?.addEventListener("ended",handleEnded)

        return ()=> audio?.removeEventListener('ended',handleEnded)
    },[playNext])

    // handle song changes
    useEffect(()=>{
        if(!audioref.current || !currentSong){
            return
        }
        const audio = audioref.current;
        // check is this is actually a new song
        const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
        if (isSongChange) {
            // if it is, then pause the current song and play the new one
            audio.src = currentSong?.audioUrl;
            // reset the audio element to start from the beginning
            audio.currentTime = 0;
            // update the previous song ref
            prevSongRef.current = currentSong?.audioUrl;
            // play the new song
            if(isPlaying){
                audio.play()
            }
        }
    },[currentSong, isPlaying])

  return (
    <audio ref={audioref}/>
  )
}

export default AudioPlayer