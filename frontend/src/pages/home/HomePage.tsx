import Topbar from "@/components/Topbar"
import { useMusicStore } from "@/stores/useMusicStore"
import { useEffect } from "react"
import FeaturedSection from "./components/FeaturedSection"
import { ScrollArea } from "@/components/ui/scroll-area"
import SectionGrid from "./components/SectionGrid"
import { usePlayerStore } from "@/stores/usePlayerStore"

function HomePage() {

  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    trendingSongs,madeForYouSongs,
    featuredSongs,
    isLoading
  } = useMusicStore()

  const {initializeQueue}= usePlayerStore()


  useEffect(()=>{
    fetchFeaturedSongs()
    fetchMadeForYouSongs()
    fetchTrendingSongs()
  },[fetchFeaturedSongs,fetchMadeForYouSongs,fetchTrendingSongs])

  useEffect(()=>{
    if(madeForYouSongs.length>0 && trendingSongs.length>0 && featuredSongs.length>0){
      const alsongs = [...featuredSongs,...madeForYouSongs,...trendingSongs]
      initializeQueue(alsongs)
    }
  },[featuredSongs, initializeQueue, madeForYouSongs, trendingSongs])


  return (
    <div className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-950 ">
      <Topbar/>
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good AfterNoon
          </h1>
          <FeaturedSection/>

          <div className="space-y-8">
            <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading}/>
            <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading}/>
          </div>

        </div>

       
      </ScrollArea>
      
    </div>
  )
}

export default HomePage