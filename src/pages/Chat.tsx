// src/pages/Chat.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  where,
  limit,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useSidebar } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Menu,
  Moon,
  Sun,
  Loader2,
  MoreVertical,
  Trash2,
  UserPlus,
  UserMinus,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  createdAt: any;
  user: {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
  };
}

interface Channel {
  id: string;
  name: string;
  createdAt: any;
  createdBy: string;
  users: string[];
}

interface GroupChannel extends Channel {
  description: string;
}

const Chat: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [groupChannels, setGroupChannels] = useState<GroupChannel[]>([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [newGroupChannelName, setNewGroupChannelName] = useState("");
  const [newGroupChannelDescription, setNewGroupChannelDescription] =
    useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [isCreatingGroupChannel, setIsCreatingGroupChannel] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [currentGroupChannel, setCurrentGroupChannel] =
    useState<GroupChannel | null>(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [isUserInGroup, setIsUserInGroup] = useState(false);
  const [isAddingUsers, setIsAddingUsers] = useState(false);
  const [isRemovingUsers, setIsRemovingUsers] = useState(false);
  const [usersToAdd, setUsersToAdd] = useState<string[]>([]);
  const [usersToRemove, setUsersToRemove] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<
    { uid: string; displayName: string | null; photoURL: string | null }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<
    { uid: string; displayName: string | null; photoURL: string | null }[]
  >([]);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);
  const [isDeletingGroup, setIsDeletingGroup] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formattedDate, setFormattedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (date) {
      setFormattedDate(format(date, "yyyy-MM-dd"));
    }
  }, [date]);

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      if (!user) return;

      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map((doc) => doc.data())
        .filter((u: any) => u.uid !== user.uid);

      setAvailableUsers(usersList as any);
    };

    fetchAvailableUsers();
  }, [user]);

  useEffect(() => {
    if (currentGroupChannel) {
      setIsUserInGroup(currentGroupChannel.users.includes(user?.uid || ""));
    }
  }, [currentGroupChannel, user]);

  useEffect(() => {
    const unsubscribeChannels = onSnapshot(
      query(collection(db, "channels"), orderBy("createdAt")),
      (snapshot) => {
        setChannels(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Channel[]
        );
      }
    );

    const unsubscribeGroupChannels = onSnapshot(
      query(collection(db, "groupChannels"), orderBy("createdAt")),
      (snapshot) => {
        setGroupChannels(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as GroupChannel[]
        );
      }
    );

    return () => {
      unsubscribeChannels();
      unsubscribeGroupChannels();
    };
  }, []);

  useEffect(() => {
    if (currentChannel && !isGroupChat) {
      const channelId =
        currentChannel.createdBy > (user?.uid || "")
          ? `${currentChannel.createdBy}-${user?.uid}`
          : `${user?.uid}-${currentChannel.createdBy}`;

      const messageQuery = query(
        collection(db, "directMessages", channelId, "messages"),
        orderBy("createdAt")
      );

      const unsubscribeMessages = onSnapshot(messageQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
        scrollToBottom();
      });

      return () => unsubscribeMessages();
    } else if (currentGroupChannel && isGroupChat) {
      const messageQuery = query(
        collection(db, "groupChannels", currentGroupChannel.id, "messages"),
        orderBy("createdAt")
      );

      const unsubscribeMessages = onSnapshot(messageQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
        scrollToBottom();
      });

      return () => unsubscribeMessages();
    } else {
      setMessages([]);
    }
  }, [currentChannel, currentGroupChannel, user, isGroupChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendDirectMessage = async () => {
    if (!newMessage.trim() || !user || !currentChannel) return;

    setIsGroupChat(false);

    const channelId =
      currentChannel.createdBy > user.uid
        ? `${currentChannel.createdBy}-${user.uid}`
        : `${user.uid}-${currentChannel.createdBy}`;

    try {
      const messageData = {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      };

      await addDoc(
        collection(db, "directMessages", channelId, "messages"),
        messageData
      );
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  const handleSendGroupMessage = async () => {
    if (!newMessage.trim() || !user || !currentGroupChannel) return;

    setIsGroupChat(true);

    try {
      const messageData = {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      };

      await addDoc(
        collection(db, "groupChannels", currentGroupChannel.id, "messages"),
        messageData
      );
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !user) return;

    setIsCreatingChannel(true);

    try {
      await addDoc(collection(db, "channels"), {
        name: newChannelName,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        users: [user.uid],
      });
      setNewChannelName("");
      toast.success("Channel created successfully!");
    } catch (error) {
      toast.error("Failed to create channel.");
    } finally {
      setIsCreatingChannel(false);
    }
  };

  const handleCreateGroupChannel = async () => {
    if (
      !newGroupChannelName.trim() ||
      !newGroupChannelDescription.trim() ||
      !user
    )
      return;

    setIsCreatingGroupChannel(true);

    try {
      await addDoc(collection(db, "groupChannels"), {
        name: newGroupChannelName,
        description: newGroupChannelDescription,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        users: [user.uid],
      });
      setNewGroupChannelName("");
      setNewGroupChannelDescription("");
      toast.success("Group channel created successfully!");
    } catch (error) {
      toast.error("Failed to create group channel.");
    } finally {
      setIsCreatingGroupChannel(false);
    }
  };

  const handleAddUsersToGroup = async () => {
    if (!currentGroupChannel || !usersToAdd.length) return;

    setIsAddingUsers(true);

    try {
      const groupChannelRef = doc(db, "groupChannels", currentGroupChannel.id);
      await updateDoc(groupChannelRef, {
        users: arrayUnion(...usersToAdd),
      });

      setCurrentGroupChannel((prevChannel) => {
        if (prevChannel) {
          return {
            ...prevChannel,
            users: [...prevChannel.users, ...usersToAdd],
          };
        }
        return prevChannel;
      });

      setUsersToAdd([]);
      toast.success("Users added to group successfully!");
    } catch (error) {
      toast.error("Failed to add users to group.");
    } finally {
      setIsAddingUsers(false);
    }
  };

  const handleRemoveUsersFromGroup = async () => {
    if (!currentGroupChannel || !usersToRemove.length) return;

    setIsRemovingUsers(true);

    try {
      const groupChannelRef = doc(db, "groupChannels", currentGroupChannel.id);
      await updateDoc(groupChannelRef, {
        users: arrayRemove(...usersToRemove),
      });

      setCurrentGroupChannel((prevChannel) => {
        if (prevChannel) {
          return {
            ...prevChannel,
            users: prevChannel.users.filter(
              (uid) => !usersToRemove.includes(uid)
            ),
          };
        }
        return prevChannel;
      });

      setUsersToRemove([]);
      toast.success("Users removed from group successfully!");
    } catch (error) {
      toast.error("Failed to remove users from group.");
    } finally {
      setIsRemovingUsers(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentGroupChannel || !user) return;

    setIsLeavingGroup(true);

    try {
      const groupChannelRef = doc(db, "groupChannels", currentGroupChannel.id);
      await updateDoc(groupChannelRef, {
        users: arrayRemove(user.uid),
      });

      setCurrentGroupChannel((prevChannel) => {
        if (prevChannel) {
          return {
            ...prevChannel,
            users: prevChannel.users.filter((uid) => uid !== user.uid),
          };
        }
        return prevChannel;
      });

      setIsUserInGroup(false);
      toast.success("Left group successfully!");
    } catch (error) {
      toast.error("Failed to leave group.");
    } finally {
      setIsLeavingGroup(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!currentGroupChannel) return;

    setIsDeletingGroup(true);

    try {
      const groupChannelRef = doc(db, "groupChannels", currentGroupChannel.id);
      await updateDoc(groupChannelRef, {
        users: [],
      });

      setCurrentGroupChannel(null);
      setIsGroupChat(false);
      toast.success("Group deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete group.");
    } finally {
      setIsDeletingGroup(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const usersCollection = collection(db, "users");
      const q = query(
        usersCollection,
        where("displayName", ">=", searchQuery),
        where("displayName", "<=", searchQuery + "\uf8ff"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => doc.data());
      setSearchResults(results as any);
    } catch (error) {
      toast.error("Failed to search users.");
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => handleSearchUsers(), 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch]);

  function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number
  ): (...args: Params) => void {
    let timer: NodeJS.Timeout;
    return (...args: Params) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, timeout);
    };
  }

  const availableUsersForAdding = useMemo(() => {
    if (!currentGroupChannel) return [];
    return availableUsers.filter(
      (user) => !currentGroupChannel.users.includes(user.uid)
    );
  }, [availableUsers, currentGroupChannel]);

  const usersInGroupForRemoving = useMemo(() => {
    if (!currentGroupChannel) return [];
    return availableUsers.filter((user) =>
      currentGroupChannel.users.includes(user.uid)
    );
  }, [availableUsers, currentGroupChannel]);

  const isUserTheCreator = useMemo(() => {
    if (!currentGroupChannel || !user) return false;
    return currentGroupChannel.createdBy === user.uid;
  }, [currentGroupChannel, user]);

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {isMobile ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full">
            <SheetHeader className="place-items-start border-b border-zinc-800 pb-4 pt-4">
              <SheetTitle>ZenX Chat</SheetTitle>
              <SheetDescription>
                Select a channel to start chatting.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 p-4">
              <h3 className="text-sm font-medium text-zinc-400">
                Direct Messages
              </h3>
              <ScrollArea className="h-[200px] rounded-md border border-zinc-800 p-2">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start rounded-md",
                      currentChannel?.id === channel.id && "bg-zinc-800"
                    )}
                    onClick={() => {
                      setCurrentChannel(channel);
                      setCurrentGroupChannel(null);
                      setIsGroupChat(false);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {channel.name}
                  </Button>
                ))}
              </ScrollArea>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  New Channel
                </Button>
              </SheetTrigger>
              <h3 className="text-sm font-medium text-zinc-400">
                Group Channels
              </h3>
              <ScrollArea className="h-[200px] rounded-md border border-zinc-800 p-2">
                {groupChannels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start rounded-md",
                      currentGroupChannel?.id === channel.id && "bg-zinc-800"
                    )}
                    onClick={() => {
                      setCurrentGroupChannel(channel);
                      setCurrentChannel(null);
                      setIsGroupChat(true);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {channel.name}
                  </Button>
                ))}
              </ScrollArea>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  New Group Channel
                </Button>
              </SheetTrigger>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="w-64 border-r border-zinc-800">
          <div className="flex flex-col gap-2 p-4">
            <h3 className="text-sm font-medium text-zinc-400">
              Direct Messages
            </h3>
            <ScrollArea className="h-[200px] rounded-md border border-zinc-800 p-2">
              {channels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-md",
                    currentChannel?.id === channel.id && "bg-zinc-800"
                  )}
                  onClick={() => {
                    setCurrentChannel(channel);
                    setCurrentGroupChannel(null);
                    setIsGroupChat(false);
                  }}
                >
                  {channel.name}
                </Button>
              ))}
            </ScrollArea>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  New Channel
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full">
                <SheetHeader className="place-items-start border-b border-zinc-800 pb-4 pt-4">
                  <SheetTitle>Create Channel</SheetTitle>
                  <SheetDescription>
                    Enter a name for the channel.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 p-4">
                  <Input
                    type="text"
                    placeholder="Channel Name"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                  <Button
                    onClick={handleCreateChannel}
                    disabled={isCreatingChannel}
                  >
                    {isCreatingChannel ? (
                      <>
                        Creating...
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Create Channel"
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <h3 className="text-sm font-medium text-zinc-400">
              Group Channels
            </h3>
            <ScrollArea className="h-[200px] rounded-md border border-zinc-800 p-2">
              {groupChannels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-md",
                    currentGroupChannel?.id === channel.id && "bg-zinc-800"
                  )}
                  onClick={() => {
                    setCurrentGroupChannel(channel);
                    setCurrentChannel(null);
                    setIsGroupChat(true);
                  }}
                >
                  {channel.name}
                </Button>
              ))}
            </ScrollArea>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  New Group Channel
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full">
                <SheetHeader className="place-items-start border-b border-zinc-800 pb-4 pt-4">
                  <SheetTitle>Create Group Channel</SheetTitle>
                  <SheetDescription>
                    Enter a name and description for the group channel.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 p-4">
                  <Input
                    type="text"
                    placeholder="Group Channel Name"
                    value={newGroupChannelName}
                    onChange={(e) => setNewGroupChannelName(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Group Channel Description"
                    value={newGroupChannelDescription}
                    onChange={(e) =>
                      setNewGroupChannelDescription(e.target.value)
                    }
                  />
                  <Button
                    onClick={handleCreateGroupChannel}
                    disabled={isCreatingGroupChannel}
                  >
                    {isCreatingGroupChannel ? (
                      <>
                        Creating...
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Create Group Channel"
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </aside>
      )}
      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">
              {isGroupChat
                ? currentGroupChannel?.name || "Select a group channel"
                : currentChannel?.name || "Select a channel"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? formattedDate : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => auth.signOut()}>
                  Sign Out
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isGroupChat && currentGroupChannel && (
                  <>
                    <DropdownMenuItem>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Users
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full">
                          <SheetHeader className="place-items-start border-b border-zinc-800 pb-4 pt-4">
                            <SheetTitle>Add Users to Group</SheetTitle>
                            <SheetDescription>
                              Select users to add to the group.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="flex flex-col gap-2 p-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                              <Input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-full border-gray-200 dark:border-[#1F1F23] dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100"
                              />
                              {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400 dark:text-gray-500" />
                              )}
                              {searchQuery && searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 top-12 z-10 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg">
                                  <ScrollArea className="max-h-40">
                                    {searchResults.map((user) => (
                                      <Button
                                        key={user.uid}
                                        variant="ghost"
                                        className="w-full justify-start rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        onClick={() => {
                                          setUsersToAdd((prev) => [
                                            ...prev,
                                            user.uid,
                                          ]);
                                          setSearchQuery("");
                                        }}
                                      >
                                        <Avatar className="mr-2 h-5 w-5">
                                          <AvatarImage src={user.photoURL} />
                                          <AvatarFallback>
                                            {user.displayName
                                              ?.charAt(0)
                                              .toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        {user.displayName}
                                      </Button>
                                    ))}
                                  </ScrollArea>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {usersToAdd.map((uid) => {
                                const user = availableUsers.find(
                                  (user) => user.uid === uid
                                );
                                return (
                                  user && (
                                    <Badge
                                      key={uid}
                                      variant="secondary"
                                      className="flex items-center gap-1 rounded-full"
                                    >
                                      <Avatar className="mr-2 h-5 w-5">
                                        <AvatarImage src={user.photoURL} />
                                        <AvatarFallback>
                                          {user.displayName
                                            ?.charAt(0)
                                            .toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      {user.displayName}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="-mr-1 h-5 w-5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                        onClick={() =>
                                          setUsersToAdd((prev) =>
                                            prev.filter((u) => u !== uid)
                                          )
                                        }
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  )
                                );
                              })}
                            </div>
                            <Button
                              onClick={handleAddUsersToGroup}
                              disabled={isAddingUsers || usersToAdd.length === 0}
                            >
                              {isAddingUsers ? (
                                <>
                                  Adding...
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                </>
                              ) : (
                                "Add Users"
                              )}
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start">
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remove Users
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full">
                          <SheetHeader className="place-items-start border-b border-zinc-800 pb-4 pt-4">
                            <SheetTitle>Remove Users from Group</SheetTitle>
                            <SheetDescription>
                              Select users to remove from the group.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="flex flex-col gap-2 p-4">
                            <div className="flex flex-wrap gap-2">
                              {usersInGroupForRemoving.map((user) => (
                                <Button
                                  key={user.uid}
                                  variant="outline"
                                  className={cn(
                                    "flex items-center gap-1 rounded-full",
                                    usersToRemove.includes(user.uid) &&
                                      "bg-zinc-800"
                                  )}
                                  onClick={() => {
                                    if (usersToRemove.includes(user.uid)) {
                                      setUsersToRemove((prev) =>
                                        prev.filter((u) => u !== user.uid)
                                      );
                                    } else {
                                      setUsersToRemove((prev) => [
                                        ...prev,
                                        user.uid,
                                      ]);
                                    }
                                  }}
                                >
                                  <Avatar className="mr-2 h-5 w-5">
                                    <AvatarImage src={user.photoURL} />
                                    <AvatarFallback>
                                      {user.displayName
                                        ?.charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  {user.displayName}
                                </Button>
                              ))}
                            </div>
                            <Button
                              onClick={handleRemoveUsersFromGroup}
                              disabled={
                                isRemovingUsers || usersToRemove.length === 0
                              }
                            >
                              {isRemovingUsers ? (
                                <>
                                  Removing...
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                </>
                              ) : (
                                "Remove Users"
                              )}
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </DropdownMenuItem>
                    {!isUserTheCreator && (
                      <DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant
