import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Message {
  id: number;
  message: string;
  timestamp: string;
  isMine: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  links: {
    name: string;
    messages: Message[];
    avatar: string;
    variant: "grey" | "ghost";
  }[];
  onClick?: () => void;
  isMobile: boolean;
  onSelectUser: (user: { name: string; avatar: string; messages: Message[] }) => void;
}

export function Sidebar({ links, isCollapsed, isMobile, onSelectUser }: SidebarProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2"
    >
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({links.length})</span>
          </div>
          <div className="flex gap-2">
            <Link
              to="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <MoreHorizontal size={20} />
            </Link>
            <Link
              to="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <SquarePen size={20} />
            </Link>
          </div>
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={`/user/${encodeURIComponent(link.name)}`}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-11 w-11 md:h-16 md:w-16",
                      link.variant === "grey" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                    onClick={() => onSelectUser(link)}
                  >
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={link.avatar}
                        alt={link.avatar}
                        className="w-10 h-10"
                      />
                    </Avatar>
                    <span className="sr-only">{link.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              to={`/user/${encodeURIComponent(link.name)}`}
              className={cn(
                buttonVariants({ variant: link.variant, size: "xl" }),
                link.variant === "grey" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
                "justify-start gap-4"
              )}
              onClick={() => onSelectUser(link)}
            >
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={link.avatar}
                  alt={link.avatar}
                  className="w-10 h-10"
                />
              </Avatar>
              <div className="flex flex-col max-w-28">
                <span>{link.name}</span>
                {link.messages.length > 0 && (
                  <span className="text-zinc-300 text-xs truncate">
                    {link.messages[link.messages.length - 1].message}
                  </span>
                )}
              </div>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
