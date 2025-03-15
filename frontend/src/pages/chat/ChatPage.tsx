import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore"
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UserList from "./components/UserList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";

const formatTime = (date:string)=>{
  return new Date(date).toLocaleTimeString("en-us",{
    hour:"2-digit",
    minute:"2-digit",
    hour12:true
  })
}

function ChatPage() {
  const {user}=useUser();
  const {messages,selectedUser,fetchUsers,fetchMessages}=useChatStore();

  useEffect(()=>{
    if(user){
      fetchUsers();
    }
  },[fetchUsers,user])

  useEffect(()=>{
    if(selectedUser){
      fetchMessages(selectedUser.clerkId);
      console.log(messages)
    }
  },[selectedUser,fetchMessages,messages])

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar/>
      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UserList/>
        {/* chnat messages */}
        <div className="flex flex-col h-full">
          {
            selectedUser?(
              <>
                <ChatHeader/>
                {/* messages in scroll area */}
                <ScrollArea className="h-[calc(100vh-380px)]">
                  <div className="p-4 space-y-4">
                     {
                      messages.map((message)=>(
                        <div key={message._id}
                          className={`flex items-start gap-3 ${message.senderId===user?.id?"flex-row-reverse":""}`}
                        >
                          <Avatar className="size-8">
                            <AvatarImage
                              src={
                                message.senderId===user?.id?
                                user.imageUrl:
                                selectedUser.imageUrl
                              }
                            />
                          </Avatar>
                          <div className={`rounded-lg p-3 max-w-[70%]
                            ${message.senderId===user?.id?"bg-green-500":"bg-zinc-500"}
                            `}>
                              <p className="text-sm">{message.content}</p>
                              <span className="text-xs text-zinc-300">
                                {formatTime(message.createdAt)}
                              </span>
                          </div>
                        </div>
                      ))
                     }
                  </div>
                </ScrollArea>
                <MessageInput/>
              </>
            ):(
              <NoConversationPlaceholder/>
            )
          }
        </div>
      </div>
    </main>
  )
}

export default ChatPage


const NoConversationPlaceholder = ()=>{
  return (<div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/logo.png" alt="my-music" className="size-16 animate-bounce"/>
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">No Conversation selected</h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start a conversation</p>
    </div>
  </div>)
}