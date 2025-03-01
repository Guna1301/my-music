/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/lib/axios';
import { Album, Song } from '@/types';
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

    fetchAlbums: ()=>void
    fetchAlbumById: (id: string)=>Promise<void>
    fetchFeaturedSongs : ()=> Promise<void>
    fetchMadeForYouSongs: ()=> Promise<void>
    fetchTrendingSongs: ()=> Promise<void>
    
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
    }
        
}))
