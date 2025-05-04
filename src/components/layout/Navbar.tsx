
import { Link } from "react-router-dom";
import { Bell, LayoutDashboard, Trophy, UserCircle } from "lucide-react";
import ThemeModeToggle from "@/components/ui/ThemeModeToggle";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b px-4 py-3 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary rounded-full p-1.5 text-primary-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="text-lg font-semibold">Habit Builder</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center space-x-1">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/challenges" className="flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>Challenges</span>
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeModeToggle />
          <Button variant="ghost" size="icon" aria-label="Profile">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
