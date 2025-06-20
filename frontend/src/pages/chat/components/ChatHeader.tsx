import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatStore } from "@/stores/useChatStore"

function ChatHeader() {
    const {selectedUser,onlineUsers}=useChatStore()
    if(!selectedUser){
        return null;
    }
  return (
    <div className="p-4 border-b border-zinc-800">
        <Avatar>
            <AvatarImage src={selectedUser.imageUrl}/>
            <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-md">{selectedUser.fullName}</h2>
            <p className="text-sm text-zinc-400">
                {
                    onlineUsers.has(selectedUser.clerkId)?"Online":"Offline"
                }
            </p>
        </div>
    </div>
  )
}

export default ChatHeader