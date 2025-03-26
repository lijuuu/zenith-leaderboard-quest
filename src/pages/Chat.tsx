
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Send, Plus, Users, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChannels, getMessages, sendMessage } from "@/api/chatApi";
import ChatMessage from "@/components/ChatMessage";
import MainNavbar from "@/components/MainNavbar";

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
    <div className="min-h-screen bg-background text-foreground pt-16">
      <MainNavbar />
      
      <main className="page-container py-8 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">
          {/* Channels sidebar */}
          <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Channels</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search channels..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="px-2 space-y-1">
                {isLoadingChannels ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-md mb-2"></div>
                  ))
                ) : (
                  channels?.map(channel => (
                    <button
                      key={channel.id}
                      className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2 ${
                        selectedChannel === channel.id
                          ? "bg-zinc-100 dark:bg-zinc-800 font-medium"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground"
                      }`}
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      {channel.type === "public" ? (
                        <Hash className="h-4 w-4" />
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                      <span>{channel.name}</span>
                      {channel.unreadCount && (
                        <div className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {channel.unreadCount}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Chat main area */}
          <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col">
            {/* Channel header */}
            {currentChannel && (
              <>
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentChannel.type === "public" ? (
                      <Hash className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                    <div>
                      <h2 className="text-lg font-bold">{currentChannel.name}</h2>
                      {currentChannel.description && (
                        <p className="text-sm text-muted-foreground">{currentChannel.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">32 online</span>
                  </div>
                </div>
                
                {/* Messages area */}
                <ScrollArea className="flex-1 p-4 h-[calc(100vh-270px)]">
                  {isLoadingMessages ? (
                    <div className="space-y-4">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "justify-end"}`}>
                          {i % 2 === 0 && <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>}
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                            <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
                          </div>
                          {i % 2 !== 0 && <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {messages?.map(message => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </ScrollArea>
                
                {/* Message input */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
