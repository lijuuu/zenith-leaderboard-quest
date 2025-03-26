import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  bio: string;
  rating: number;
  problemsSolved: number;
  isOnline: boolean;
}

interface UserSearchProps {
  onSelectUser?: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      // Simulate API search delay
      setTimeout(() => {
        // Filter dummy users based on search query
        const filteredUsers = dummyUsers.filter((user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredUsers);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSelectUser = (user: User) => {
    setSearchQuery("");
    setSearchResults([]);
    onSelectUser?.(user);
  };

  // Create a new dummy search results array
  const dummyUsers = [
    {
      id: "user1",
      username: "sarahcodes",
      fullName: "Sarah Johnson",
      profileImage: "https://i.pravatar.cc/300?img=5",
      bio: "Full stack developer | React & Node.js enthusiast",
      rating: 1850,
      problemsSolved: 187,
      isOnline: true
    },
    {
      id: "user2",
      username: "mikecoder",
      fullName: "Michael Chen",
      profileImage: "https://i.pravatar.cc/300?img=3",
      bio: "Algorithm specialist | Competitive programmer",
      rating: 2100,
      problemsSolved: 320,
      isOnline: false
    },
    {
      id: "user3",
      username: "devjane",
      fullName: "Jane Williams",
      profileImage: "https://i.pravatar.cc/300?img=9",
      bio: "Front-end developer | UI/UX enthusiast",
      rating: 1740,
      problemsSolved: 145,
      isOnline: true
    },
    {
      id: "user4",
      username: "alexdev",
      fullName: "Alex Rodriguez",
      profileImage: "https://i.pravatar.cc/300?img=4",
      bio: "Python developer | ML engineer",
      rating: 1990,
      problemsSolved: 210,
      isOnline: false
    },
    {
      id: "user5",
      username: "emmawilson",
      fullName: "Emma Wilson",
      profileImage: "https://i.pravatar.cc/300?img=2",
      bio: "Backend developer | Database expert",
      rating: 1830,
      problemsSolved: 163,
      isOnline: true
    },
    {
      id: "user6",
      username: "davidsoftware",
      fullName: "David Miller",
      profileImage: "https://i.pravatar.cc/300?img=6",
      bio: "Software engineer | Open source contributor",
      rating: 1920,
      problemsSolved: 201,
      isOnline: true
    },
    {
      id: "user7",
      username: "jasondev",
      fullName: "Jason Taylor",
      profileImage: "https://i.pravatar.cc/300?img=7",
      bio: "Mobile developer | React Native expert",
      rating: 1680,
      problemsSolved: 132,
      isOnline: false
    },
    {
      id: "user8",
      username: "sophiecoder",
      fullName: "Sophie Brown",
      profileImage: "https://i.pravatar.cc/300?img=10",
      bio: "JavaScript developer | Web performance enthusiast",
      rating: 1780,
      problemsSolved: 158,
      isOnline: true
    }
  ];

  return (
    <div>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search user by username or full name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-800/50 border-zinc-700/50"
        />
      </div>

      {searchQuery && searchResults.length > 0 && (
        <Card className="absolute top-14 left-0 right-0 z-50 bg-zinc-900/95 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Select a user to start a chat</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isSearching ? (
              <div className="p-4 text-center text-zinc-400">Searching...</div>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {searchResults.map((user) => (
                  <li key={user.id} className="p-2 hover:bg-zinc-800/50 cursor-pointer">
                    <Link
                      to={`/profile/${user.id}`}
                      className="flex items-center gap-3"
                      onClick={() => handleSelectUser(user)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} alt={user.fullName} />
                        <AvatarFallback>{user.fullName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-zinc-400">@{user.username}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSearch;
