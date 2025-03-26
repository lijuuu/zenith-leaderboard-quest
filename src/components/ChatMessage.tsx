
import { formatDistanceToNow } from "date-fns";
import { ChatMessage as ChatMessageType } from "@/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { sender, content, timestamp, isCurrentUser, attachments } = message;
  
  // Format timestamp to relative time (e.g., "5 minutes ago")
  const formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: false });
  
  // Format absolute time for title attribute (e.g., "12:34 PM")
  const absoluteTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div className={`mb-4 ${isCurrentUser ? 'ml-auto' : ''}`}>
      <div className="flex items-start gap-3">
        {!isCurrentUser && (
          <Avatar className="mt-0.5">
            <AvatarImage src={sender.profileImage} />
            <AvatarFallback>{sender.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center gap-2 mb-1">
            {!isCurrentUser && (
              <span className="font-medium text-sm">{sender.username}</span>
            )}
            <span className="text-xs text-muted-foreground" title={new Date(timestamp).toLocaleString()}>
              {absoluteTime}
            </span>
            {isCurrentUser && (
              <span className="font-medium text-sm">Me</span>
            )}
          </div>
          
          <div 
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              isCurrentUser 
                ? 'bg-green-500 text-white ml-auto' 
                : 'bg-zinc-800 dark:bg-zinc-800 text-white'
            }`}
          >
            {content}
          </div>
          
          {attachments && attachments.length > 0 && (
            <div className="mt-1">
              {attachments.map((attachment, index) => (
                <div key={index} className="mt-2">
                  {attachment.type === 'image' && (
                    <img 
                      src={attachment.content} 
                      alt="attachment" 
                      className="max-w-xs rounded-md border border-zinc-300 dark:border-zinc-700" 
                    />
                  )}
                  {attachment.type === 'code' && (
                    <pre className="text-xs p-2 bg-zinc-900 text-zinc-100 rounded-md overflow-x-auto">
                      <code>{attachment.content}</code>
                    </pre>
                  )}
                  {attachment.type === 'link' && (
                    <a 
                      href={attachment.content} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {attachment.content}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {isCurrentUser && (
          <Avatar className="mt-0.5">
            <AvatarImage src={sender.profileImage} />
            <AvatarFallback>{sender.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
