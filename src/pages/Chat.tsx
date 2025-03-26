
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Send, Plus, Users, Hash, Info, Settings, Bell, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChannels, getMessages, sendMessage } from "@/api/chatApi";
import ChatMessage from "@/components/ChatMessage";
import MainNavbar from "@/components/MainNavbar";
import { Badge } from "@/components/ui/badge";

const Chat = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch channels
  const { data: channels, isLoading: isLoadingChannels } = useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  });
  
  // Fetch messages for the selected channel
  const { 
    data: messages,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ["messages", selectedChannel],
    queryFn: () => getMessages(selectedChannel || "general"),
    enabled: !!selectedChannel,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ channelId, content }: { channelId: string; content: string }) =>
      sendMessage(channelId, content),
    onSuccess: () => {
      refetchMessages();
    },
  });
  
  // Auto-select the first channel if none is selected
  useEffect(() => {
    if (!selectedChannel && channels && channels.length > 0) {
      setSelectedChannel(channels[0].id);
    }
  }, [channels, selectedChannel]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedChannel) return;
    
    sendMessageMutation.mutate({
      channelId: selectedChannel,
      content: messageInput.trim(),
    });
    
    setMessageInput("");
  };
  
  const currentChannel = channels?.find(channel => channel.id === selectedChannel);
  
  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-14">
      <MainNavbar />
      
      <main className="page-container py-8 h-[calc(100vh-56px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">
          {/* Channels sidebar */}
          <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-700/40">
              <h2 className="text-xl font-bold mb-4">Channels</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                <Input
                  placeholder="Search channels..."
                  className="pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-green-500 focus-visible:border-green-500"
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Channel
                </Button>
                
                <Button variant="outline" size="icon" className="h-8 w-8 bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="px-2 py-3 space-y-1">
                <div className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase">
                  Public Channels
                </div>
                
                {isLoadingChannels ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-10 bg-zinc-800/70 animate-pulse rounded-md mb-2 mx-1"></div>
                  ))
                ) : (
                  channels?.filter(channel => channel.type === "public").map(channel => (
                    <button
                      key={channel.id}
                      className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2 transition-colors ${
                        selectedChannel === channel.id
                          ? "bg-zinc-800 font-medium"
                          : "hover:bg-zinc-800/70 text-zinc-400"
                      }`}
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <Hash className="h-4 w-4" />
                      <span>{channel.name}</span>
                      {channel.unreadCount && (
                        <Badge className="ml-auto bg-green-500 text-white hover:bg-green-600 h-5 min-w-[20px] flex items-center justify-center">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </button>
                  ))
                )}
                
                <div className="px-3 py-2 mt-4 text-xs font-medium text-zinc-500 uppercase">
                  Direct Messages
                </div>
                
                {isLoadingChannels ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-10 bg-zinc-800/70 animate-pulse rounded-md mb-2 mx-1"></div>
                  ))
                ) : (
                  channels?.filter(channel => channel.type === "private").map(channel => (
                    <button
                      key={channel.id}
                      className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2 transition-colors ${
                        selectedChannel === channel.id
                          ? "bg-zinc-800 font-medium"
                          : "hover:bg-zinc-800/70 text-zinc-400"
                      }`}
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <div className="relative">
                        <Users className="h-4 w-4" />
                        {channel.isOnline && (
                          <span className="absolute -top-0.5 -right-0.5 bg-green-500 w-2 h-2 rounded-full"></span>
                        )}
                      </div>
                      <span>{channel.name}</span>
                      {channel.unreadCount && (
                        <Badge className="ml-auto bg-green-500 text-white hover:bg-green-600 h-5 min-w-[20px] flex items-center justify-center">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-zinc-700/40 bg-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-zinc-800"></span>
                </div>
                <div>
                  <div className="font-medium text-sm">Alex Johnson</div>
                  <div className="text-xs text-green-400">Online</div>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto text-zinc-400 hover:text-white hover:bg-zinc-700 h-8 w-8">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Chat main area */}
          <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg overflow-hidden flex flex-col">
            {/* Channel header */}
            {currentChannel ? (
              <>
                <div className="p-4 border-b border-zinc-700/40 flex items-center justify-between bg-zinc-800/60">
                  <div className="flex items-center gap-2">
                    {currentChannel.type === "public" ? (
                      <Hash className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                    <div>
                      <h2 className="text-lg font-bold">{currentChannel.name}</h2>
                      {currentChannel.description && (
                        <p className="text-sm text-zinc-400">{currentChannel.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md text-xs">
                      <Users className="h-3.5 w-3.5" />
                      <span>32 online</span>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-700 h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Messages area */}
                <ScrollArea className="flex-1 px-4 py-6">
                  {isLoadingMessages ? (
                    <div className="space-y-6">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "justify-end"}`}>
                          {i % 2 === 0 && <div className="w-10 h-10 rounded-full bg-zinc-700/50"></div>}
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-zinc-700/50 rounded"></div>
                            <div className="h-10 w-64 bg-zinc-700/50 rounded-md"></div>
                          </div>
                          {i % 2 !== 0 && <div className="w-10 h-10 rounded-full bg-zinc-700/50"></div>}
                        </div>
                      ))}
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <>
                      {messages.map(message => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="bg-zinc-800/60 rounded-full p-4 mb-4">
                        <AlertCircle className="h-8 w-8 text-zinc-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                      <p className="text-zinc-400 mb-6">
                        Be the first one to send a message in this channel!
                      </p>
                      <Button 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => document.getElementById('message-input')?.focus()}
                      >
                        Start conversation
                      </Button>
                    </div>
                  )}
                </ScrollArea>
                
                {/* Message input */}
                <div className="p-4 border-t border-zinc-700/40 bg-zinc-800/60">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-zinc-400 hover:text-white hover:bg-zinc-700"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                    <Input
                      id="message-input"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      className="flex-1 bg-zinc-800 border-zinc-700 focus-visible:ring-green-500 focus-visible:border-green-500"
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="bg-zinc-800/60 rounded-full p-6 mb-4">
                  <Hash className="h-12 w-12 text-zinc-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Chat</h2>
                <p className="text-zinc-400 max-w-md mb-8">
                  Select a channel or direct message from the sidebar to start chatting
                </p>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create a Channel
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
