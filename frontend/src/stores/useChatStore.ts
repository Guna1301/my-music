/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/lib/axios';
import {create} from 'zustand';

interface ChatStore {
    users: unknown[];
    fetchUsers: () => Promise<void>;
    isLoading: boolean;
    error: string|null;
}

export const useChatStore = create<ChatStore>((set)=>({
    users: [],
    isLoading: false,
    error: null,
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
    }

}))