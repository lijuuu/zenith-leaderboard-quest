
import React, { useState, useRef, useEffect } from "react";
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
  Mic,
  Sword,
  Users,
  Trophy,
  UserPlus,
  Star,
  MessageSquare,
  ArrowRight,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MainNavbarWithNotifications from "@/components/ui/MainNavbarWithNotifications";
import ChatMessage from "@/components/ChatMessage";
import ChallengeBattleInvite from "@/components/chat/ChallengeBattleInvite";
import { getChannels, getMessages } from "@/api/chatApi";
import { ChatChannel, ChatMessage as MessageType } from "@/api/types";
import { toast } from "sonner";
import ChatChallengeDialog from "@/components/chat/ChatChallengeDialog";

const Chat = () => {
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
    toast.success("Message sent successfully");
    
    // Clear input
    setMessage("");
  };
  
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Selected file: ${file.name}`);
        // In a real app, this would upload the file to the server
      }
    };
    input.click();
  };
  
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Selected image: ${file.name}`);
        // In a real app, this would upload the image to the server
      }
    };
    input.click();
  };
  
  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice recording started");
      // In a real app, this would start recording audio
    } else {
      toast.success("Voice recording stopped and sent");
      // In a real app, this would stop recording and send the audio
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  
  const handleCreateChallenge = (challenge: any) => {
    toast.success(`Challenge "${challenge.title}" created successfully`);
    setIsChallengeDialogOpen(false);
  };
  
  const activeChannel = channels.find(c => c.id === activeChannelId);
  
  // Mock data for emoji picker
  const emojis = ['😊', '😂', '😍', '👍', '❤️', '🔥', '😎', '🤔', '👀', '✨', '🎉', '👋', '🙌', '🤝', '💯', '⚡', '🏆', '🎯'];
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-14">
      <MainNavbarWithNotifications />
      
      <main className="flex-1 flex max-h-[calc(100vh-theme(spacing.14))]">
        {/* Sidebar */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chat</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Plus className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Message
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    New Group
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => setIsChallengeDialogOpen(true)}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Create Challenge
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search conversations" 
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="flex-1">
            <div className="px-2 border-b border-border">
              <TabsList className="bg-transparent w-full justify-start h-auto p-2">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-accent rounded-md data-[state=active]:text-accent-foreground"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="direct" 
                  className="data-[state=active]:bg-accent rounded-md data-[state=active]:text-accent-foreground"
                >
                  Direct
                </TabsTrigger>
                <TabsTrigger 
                  value="groups" 
                  className="data-[state=active]:bg-accent rounded-md data-[state=active]:text-accent-foreground"
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
                      <div className="w-10 h-10 rounded-full bg-accent animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-accent rounded w-24 mb-2 animate-pulse" />
                        <div className="h-3 bg-accent rounded w-32 animate-pulse" />
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
                            ? 'bg-accent-5 text-accent-color'
                            : 'hover:bg-accent/10'
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
                                <span className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-background"></span>
                              )}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium">
                              {channel.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="font-medium truncate">{channel.name}</span>
                              {channel.unreadCount && channel.unreadCount > 0 ? (
                                <Badge className="ml-2 accent-color">{channel.unreadCount}</Badge>
                              ) : null}
                            </div>
                            
                            <p className="text-sm text-muted-foreground truncate">
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
              <div className="p-4 text-center text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <h3 className="font-medium">No direct messages yet</h3>
                <p className="text-sm mt-2 mb-4">Start a conversation with a friend</p>
                <Button className="accent-color">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="groups" className="flex-1 overflow-y-auto m-0 p-0">
              <div className="p-4 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <h3 className="font-medium">No groups yet</h3>
                <p className="text-sm mt-2 mb-4">Create or join a group chat</p>
                <Button className="accent-color">
                  <Users className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Chat Area */}
        {activeChannelId ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="border-b border-border p-4 flex justify-between items-center">
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
                      <span className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium">
                    {activeChannel?.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium">{activeChannel?.name}</h3>
                  {activeChannel?.type === 'direct' && (
                    <p className="text-xs text-muted-foreground">
                      {activeChannel.participants?.[0]?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsChallengeDialogOpen(true)}
                  className="flex items-center gap-1.5"
                >
                  <Sword className="h-4 w-4 text-orange-500" />
                  Challenge
                </Button>
                
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingMessages ? (
                <div className="space-y-6">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-accent rounded w-32 mb-2 animate-pulse" />
                        <div className="h-20 bg-accent rounded w-3/4 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <React.Fragment key={msg.id}>
                      <ChatMessage message={msg} />
                      
                      {/* Render challenge invites if they exist in the message */}
                      {msg.attachments?.map((attachment, idx) => 
                        attachment.type === 'challenge-invite' && (
                          <ChallengeBattleInvite 
                            key={`${msg.id}-attachment-${idx}`}
                            challenge={{
                              id: attachment.challengeId || '',
                              title: attachment.challengeTitle || 'Coding Challenge',
                              isPrivate: attachment.isPrivate || false,
                              accessCode: attachment.accessCode,
                              difficulty: 'medium',
                              participants: 2,
                              expiresIn: '24h'
                            }}
                            onAccept={() => {
                              toast.success(`Joined challenge: ${attachment.challengeTitle}`);
                            }}
                            onDecline={() => {
                              toast.info(`Declined challenge: ${attachment.challengeTitle}`);
                            }}
                          />
                        )
                      )}
                    </React.Fragment>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-accent/30 rounded-full p-6 mb-4">
                    <Send className="h-6 w-6 text-accent-color" />
                  </div>
                  <h3 className="text-xl font-medium">No messages yet</h3>
                  <p className="text-muted-foreground mt-2">Start the conversation by sending a message</p>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div className="relative">
                  <Textarea 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] resize-none pr-20"
                  />
                  
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            className={`h-8 w-8 rounded-full ${showEmojiPicker ? 'bg-accent' : 'hover:bg-accent'}`}
                            onClick={toggleEmojiPicker}
                          >
                            <Smile className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add emoji</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full hover:bg-accent"
                            onClick={handleFileUpload}
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach file</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            className={`h-8 w-8 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'hover:bg-accent'}`}
                            onClick={handleVoiceRecording}
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRecording ? 'Stop recording' : 'Record voice message'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {showEmojiPicker && (
                    <div className="absolute bottom-14 right-0 bg-background border border-border rounded-lg shadow-lg p-2 z-10">
                      <div className="grid grid-cols-6 gap-2">
                        {emojis.map((emoji, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded-md text-lg"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            className="h-9 w-9 rounded-full hover:bg-accent"
                            onClick={handleImageUpload}
                          >
                            <Image className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            className="h-9 w-9 rounded-full hover:bg-accent"
                          >
                            <CodeIcon className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            className="h-9 w-9 rounded-full hover:bg-accent"
                            onClick={() => setIsChallengeDialogOpen(true)}
                          >
                            <Sword className="h-5 w-5 text-orange-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Create challenge</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="accent-color"
                    disabled={!message.trim() && !isRecording}
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
              <div className="bg-accent/30 rounded-full p-6 mx-auto mb-4 w-fit">
                <MessageIcon className="h-6 w-6 text-accent-color" />
              </div>
              <h3 className="text-xl font-medium">Select a conversation</h3>
              <p className="text-muted-foreground mt-2">Choose a channel or start a new conversation</p>
              <Button className="mt-6 accent-color">
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        )}
      </main>
      
      {/* Challenge Dialog */}
      <ChatChallengeDialog 
        isOpen={isChallengeDialogOpen}
        onClose={() => setIsChallengeDialogOpen(false)}
        onCreateChallenge={handleCreateChallenge}
      />
    </div>
  );
};

// Helper icon component
const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
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
