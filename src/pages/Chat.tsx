import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Plus, 
  Send, 
  ChevronRight,
  MoreHorizontal,
  Image,
  Code as CodeIcon,
  Smile,
  Paperclip,
  Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainNavbar from "@/components/MainNavbar";
import ChatMessage from "@/components/ChatMessage";
import { getChannels, getMessages } from "@/api/chatApi";
import { ChatChannel, ChatMessage as MessageType } from "@/api/types";

const Chat = () => {
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get all available channels
  const { data: channels = [], isLoading: isLoadingChannels } = useQuery({
    queryKey: ["channels"],
    queryFn: getChannels
  });
  
  // Get messages for active channel
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", activeChannelId],
    queryFn: () => activeChannelId ? getMessages(activeChannelId) : Promise.resolve([]),
    enabled: !!activeChannelId
  });
  
  // Set first channel as active if none selected and channels loaded
  useEffect(() => {
    if (channels.length > 0 && !activeChannelId) {
      setActiveChannelId(channels[0].id);
    }
  }, [channels, activeChannelId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChannelId) return;
    
    // In a real app, this would send the message to the server
    console.log(`Sending message to ${activeChannelId}: ${message}`);
    
    // Clear input
    setMessage("");
  };
  
  const activeChannel = channels.find(c => c.id === activeChannelId);
  
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col pt-14">
      <MainNavbar />
      
      <main className="flex-1 flex max-h-[calc(100vh-theme(spacing.14))]">
        {/* Sidebar */}
        <div className="w-80 border-r border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chat</h2>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-zinc-800">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input 
                placeholder="Search conversations" 
                className="pl-10 bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="flex-1">
            <div className="px-2 border-b border-zinc-800">
              <TabsList className="bg-transparent w-full justify-start h-auto p-2">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-zinc-800 rounded-md data-[state=active]:text-white"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="direct" 
                  className="data-[state=active]:bg-zinc-800 rounded-md data-[state=active]:text-white"
                >
                  Direct
                </TabsTrigger>
                <TabsTrigger 
                  value="groups" 
                  className="data-[state=active]:bg-zinc-800 rounded-md data-[state=active]:text-white"
                >
                  Groups
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="flex-1 overflow-y-auto m-0 p-0">
              {isLoadingChannels ? (
                <div className="p-4 space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-zinc-800 rounded w-24 mb-2 animate-pulse" />
                        <div className="h-3 bg-zinc-800 rounded w-32 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-2">
                  {channels.map(channel => {
                    const isActive = channel.id === activeChannelId;
                    // For direct messages, treat as online if specified
                    const online = channel.type === 'direct' && channel.participants?.[0]?.isOnline;
                    
                    return (
                      <div 
                        key={channel.id}
                        className={`px-3 py-2 mx-2 rounded-lg cursor-pointer mb-1 ${
                          isActive 
                            ? 'bg-green-500/20 text-green-400'
                            : 'hover:bg-zinc-800/60'
                        }`}
                        onClick={() => setActiveChannelId(channel.id)}
                      >
                        <div className="flex items-center gap-3">
                          {channel.type === 'direct' ? (
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img 
                                  src={channel.participants?.[0]?.profileImage || "https://i.pravatar.cc/300?img=1"} 
                                  alt={channel.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {online && (
                                <span className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-zinc-900"></span>
                              )}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium">
                              {channel.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="font-medium truncate">{channel.name}</span>
                              {channel.unreadCount && channel.unreadCount > 0 ? (
                                <Badge className="ml-2 bg-green-500">{channel.unreadCount}</Badge>
                              ) : null}
                            </div>
                            
                            <p className="text-sm text-zinc-400 truncate">
                              {channel.description || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="direct" className="flex-1 overflow-y-auto m-0 p-0">
              <div className="p-4 text-center text-zinc-400">
                No direct messages yet
              </div>
            </TabsContent>
            
            <TabsContent value="groups" className="flex-1 overflow-y-auto m-0 p-0">
              <div className="p-4 text-center text-zinc-400">
                No groups yet
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Chat Area */}
        {activeChannelId ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="border-b border-zinc-800 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {activeChannel?.type === 'direct' ? (
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={activeChannel.participants?.[0]?.profileImage || "https://i.pravatar.cc/300?img=1"} 
                        alt={activeChannel.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {activeChannel.participants?.[0]?.isOnline && (
                      <span className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-zinc-900"></span>
                    )}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium">
                    {activeChannel?.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium">{activeChannel?.name}</h3>
                  {activeChannel?.type === 'direct' && (
                    <p className="text-xs text-zinc-400">
                      {activeChannel.participants?.[0]?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  )}
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-800">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingMessages ? (
                <div className="space-y-6">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-zinc-800 rounded w-32 mb-2 animate-pulse" />
                        <div className="h-20 bg-zinc-800 rounded w-3/4 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-zinc-800/60 rounded-full p-6 mb-4">
                    <Send className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium">No messages yet</h3>
                  <p className="text-zinc-400 mt-2">Start the conversation by sending a message</p>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="border-t border-zinc-800 p-4">
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div className="relative">
                  <Textarea 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] bg-zinc-800 border-zinc-700 resize-none pr-20"
                  />
                  
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full hover:bg-zinc-700"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full hover:bg-zinc-700"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full hover:bg-zinc-700"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5">
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 rounded-full hover:bg-zinc-700"
                    >
                      <Image className="h-5 w-5" />
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 rounded-full hover:bg-zinc-700"
                    >
                      <CodeIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-green-500 hover:bg-green-600"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-zinc-800/60 rounded-full p-6 mx-auto mb-4 w-fit">
                <MessageIcon className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-medium">Select a conversation</h3>
              <p className="text-zinc-400 mt-2">Choose a channel or start a new conversation</p>
              <Button className="mt-6 bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper icon component
const MessageIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default Chat;
