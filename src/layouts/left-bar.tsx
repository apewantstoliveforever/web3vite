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
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path if necessary

const linkItems = [
  { label: "Find User", icon: <Search size={32} />, path: "/find-user" },
  { label: "Chat", icon: <MessageSquare size={32} />, path: "/chat" },
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

const Leftbar: React.FC = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="bg-gray-800 p-1 w-32 h-full border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-center mb-4">
        <Link to="/" className="flex items-center justify-center">
          <img
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
        </Link>
      </div>

      <ScrollArea className="h-[80vh] w-32 rounded-md border">
      <div className="flex flex-col items-center justify-center p-2">
      {linkItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                activePath === item.path ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-blue-700 hover:text-white"
              }`}
              onClick={() => setActivePath(item.path)}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-red-500 bg-white-100">
                {item.icon}
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Leftbar;
