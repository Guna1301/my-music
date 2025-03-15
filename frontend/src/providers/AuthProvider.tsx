import { axiosInstance } from "@/lib/axios"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore"
import { useAuth } from "@clerk/clerk-react"
import { Loader } from "lucide-react"
import {  useEffect, useState } from "react"

const updateApiToken = (token: string|null) => {
        if(token){
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }else{
            delete axiosInstance.defaults.headers.common['Authorization']
        }

}

function AuthProvider({children}:{children:React.ReactNode}) {
    const {getToken,userId}= useAuth()
    const [loading,setLoading]=useState(true)
    const {checkAdminStatus} = useAuthStore()
    const {initSocket,disconnectSocket}=useChatStore()

    useEffect(()=>{
        const initAuth = async()=>{
            try {
                const token = await getToken()
                updateApiToken(token)
                if(token){
                    await checkAdminStatus()
                    // init socket
                    if(userId){
                        initSocket(userId)
                    }
                }
            } catch (error) {
                updateApiToken('')
                console.log('error in auth provider',error)
            }finally{
                setLoading(false)
            }
        };
        initAuth()
        // clean up
        return ()=> disconnectSocket()
    },[getToken,checkAdminStatus,initSocket,userId,disconnectSocket])
    if(loading){
        return(
            <div className="h-screen w-full flex justify-center items-center">
                <Loader className="size-8 text-emerald-500 animate-spin"/>
            </div>
        )
    }
  return (
    <div>{children}</div>
  )
}

export default AuthProvider