// src/layouts/Leftbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Search,
  MessageSquare,
  FileText,
  Calendar,
  MapPin,
  Camera,
  Settings,
  Users,
  GitBranch,
  GitCommit,
  GitMerge,
  Shield,
  Info,
  HelpCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  ContactRound,
  Apple
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path if necessary

import imgLog from "../assets/discord-round-black-icon.webp";
import Header from "./header";
interface Server {
  name: string;
  image: string;
}

interface LeftbarProps {
  joinedServers: Server[];
}

const linkItems = [
  { label: "Test", icon: <FileText size={32} />, path: "/test" },
  { label: "Calendar", icon: <Calendar size={32} />, path: "/calendar" },
  { label: "Map", icon: <MapPin size={32} />, path: "/map" },
  { label: "Camera", icon: <Camera size={32} />, path: "/camera" },
  { label: "Settings", icon: <Settings size={32} />, path: "/settings" },
  { label: "Users", icon: <Users size={32} />, path: "/users" },
  { label: "Branch", icon: <GitBranch size={32} />, path: "/branch" },
  { label: "Commit", icon: <GitCommit size={32} />, path: "/commit" },
  { label: "Merge", icon: <GitMerge size={32} />, path: "/merge" },
  { label: "Shield", icon: <Shield size={32} />, path: "/shield" },
  { label: "Info", icon: <Info size={32} />, path: "/info" },
  { label: "Help", icon: <HelpCircle size={32} />, path: "/help" },
  { label: "Check", icon: <CheckCircle size={32} />, path: "/check" },
  { label: "Close", icon: <XCircle size={32} />, path: "/close" },
  { label: "Edit", icon: <Edit size={32} />, path: "/edit" },
  { label: "Trash", icon: <Trash size={32} />, path: "/trash" },
];

const Leftbar: React.FC<LeftbarProps> = ({ joinedServers }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="w-14 bg-gray-800 h-screen border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-center mb-4">
        <div className="flex flex-col items-center justify-center p-2 ">
          <Link to="/" className="flex items-center justify-center">
            <img
              src={imgLog}
              alt="Profile"
              className="w-12 h-auto rounded-full"
            />
          </Link>
          <Link
            to="/find-user"
            className="flex items-center space-x-2 p-2 rounded-lg"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-500 bg-white-100">
              <Search />
            </div>
          </Link>
          {/* <Link
            to="/map"
            className="flex items-center space-x-2 p-2 rounded-lg"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-500 bg-white-100">
              <MapPin />
            </div>
          </Link> */}
          <div>
            <Header />
          </div>
        </div>
      </div>

      <ScrollArea className="h-[80vh] w-full border-t w-14">
        <div className="flex flex-col items-center justify-center p-2 w-14">
          {joinedServers.map((server) => (
            <Link
              key={server.name}
              to={`/server/${server.name}`}
              className={`flex items-center p-1 rounded-lg w-14 h-12 mt-3 ${
                activePath === `/server/${server.name}`
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-blue-700 hover:text-white"
              }`}
              onClick={() => setActivePath(`/server/${server.name}`)}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-red-500 bg-white-100">
                {/* <img src={server.image} alt={server.name} className="w-8 h-8" /> */}
                <Apple />
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Leftbar;
