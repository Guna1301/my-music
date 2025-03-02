/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/lib/axios';
import { Album, Song, Stats } from '@/types';
import toast from 'react-hot-toast';
import {create} from 'zustand';

interface MusicStore{
    songs: Song[],
    albums: Album[],
    isLoading: boolean,
    error: string | null,
    currentAlbum: Album | null,
    featuredSongs: Song[],
    madeForYouSongs : Song[],
    trendingSongs: Song[],
    stats : Stats
    isSongsLoading:boolean
    isStatsLoading:boolean

    fetchAlbums: ()=>void
    fetchAlbumById: (id: string)=>Promise<void>
    fetchFeaturedSongs : ()=> Promise<void>
    fetchMadeForYouSongs: ()=> Promise<void>
    fetchTrendingSongs: ()=> Promise<void>
    fetchSongs: ()=> Promise<void>
    fetchStats:()=> Promise<void>
    deleteSong:(id:string)=>Promise<void>
    deleteAlbum:(id:string)=>Promise<void>
    
}

export const useMusicStore = create<MusicStore>((set)=>({
    albums :[],
    songs:[],
    isLoading:false,
    error:null,
    currentAlbum:null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists : 0,
    },
    isSongsLoading:false,
    isStatsLoading:false,
    

    fetchAlbums: async()=>{
        set({isLoading:true,error:null})
        try {
            const res = await axiosInstance.get('/albums')
            set({albums:res.data})
        } catch (error: any) {
            set({ error: error?.response?.data?.message || "Failed to fetch albums" });
        }finally{
            set({isLoading:false})
        }
    },

    fetchAlbumById : async(id)=>{
        set({isLoading:true,error:null})
        try {
            const res = await axiosInstance.get(`/albums/${id}`)
            set({currentAlbum:res.data})
        } catch (error : any) {
            set({ error: error?.response?.data?.message || "Failed to fetch album" });
        }finally{
            set({isLoading:false})
        }
    },

    fetchFeaturedSongs : async()=>{
        set({isLoading:true, error:null})
        try {
            const res = await axiosInstance.get('/songs/featured');
            set({featuredSongs:res.data})
        } catch (error:any) {
            set({error:error.response.message})
        }finally{
            set({isLoading:false})
        }

    },
    
    fetchMadeForYouSongs: async()=>{
        set({isLoading:true,error:null})
        try {
            const res = await axiosInstance.get('/songs/made-for-you');
            set({madeForYouSongs:res.data})
        } catch (error:any) {
            set({error:error.response.message})  
        }finally{
            set({isLoading:false})
        }
    },

    fetchTrendingSongs : async ()=>{
        set({isLoading:true,error:null})
        try {
            const res = await axiosInstance.get('/songs/trending');
            set({trendingSongs:res.data})
            
            
        } catch (erro:any) {
            set({error:erro.response.message})
        }finally{
            set({isLoading:false})
        }
    },

    fetchSongs : async ()=>{
        set({isSongsLoading:true, error:null})
        try {
            const res = await axiosInstance.get('/songs');
            set({songs:res.data})
        } catch (error:any) {
            set({error:error.message})
        }finally{
            set({isSongsLoading:false})
        }
    },

    fetchStats : async ()=>{
        set({isStatsLoading:true, error:null})
        try {
            const res = await axiosInstance.get('/stats');
            set({stats:res.data})
        } catch (error:any) {
            set({error:error.message})
        }finally{
            set({isStatsLoading:false})
        }         
    },

    deleteSong : async (id)=>{
        set({isLoading:true, error:null})
        try {
            await axiosInstance.delete(`/admin/songs/${id}`)
            set(state=>({
                songs:state.songs.filter(song=>song._id!==id)
            }))
            toast.success("Song deleted successfully")
        } catch (error:any) {
            set({error:error.message})
            toast.error("Error deleting song")
        }finally{
            set({isLoading:false})
        }
    },

    deleteAlbum : async (id)=>{
        set({isLoading:true, error:null})
        try {
            await axiosInstance.delete(`/admin/albums/${id}`)
            set(state=>({
                albums: state.albums.filter((album)=> album._id!==id),
                songs:state.songs.map(song=>
                    song.albumId === (state.albums.find((a)=>a._id === id)?._id)?{...song,album:null}:song
                )
            }))
            toast.success("Album deleted successfully")
        } catch (error:any) {
            set({error:error.message})
            toast.error("Error deleting Album")
        }finally{
            set({isLoading:false})
        }
    },

        
}))
