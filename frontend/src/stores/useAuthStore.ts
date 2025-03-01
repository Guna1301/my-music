/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/lib/axios';
import {create} from 'zustand'

interface AuthStore{
    isAdmin :boolean,
    isLoading:boolean,
    error:string|null

    checkAdminStatus: ()=> Promise<void>;
    reset: ()=> void;
}

export const useAuthStore = create<AuthStore>((set)=>({
    isAdmin: false,
    isLoading:false,
    error:null,

    checkAdminStatus: async ()=>{
        set({isLoading:true})
        try {
            const res = await axiosInstance.get('/admin/check')
            set({isAdmin:res.data.admin})
        } catch (error:any) {
            set({isAdmin:false,error:error.res.data.message})
            
        }finally{
            set({isLoading:false})
        }
    },

    reset() {
        set({ isAdmin: false, isLoading: false, error: null });
    },
}))