import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Home, GraduationCap, Briefcase, Bell, MessageCircle, User, Settings } from 'lucide-react';
import { cn } from "../../lib/utils";

// Custom sidebar components for React
const Sidebar = ({ children, className, ...props }) => (
  <div className={cn("h-screen w-64 border-r bg-white", className)} {...props}>
    {children}
  </div>
);

const SidebarHeader = ({ children, className, ...props }) => (
  <div className={cn("flex items-center justify-center py-4 border-b", className)} {...props}>
    {children}
  </div>
);

const SidebarContent = ({ children, className, ...props }) => (
  <div className={cn("p-4", className)} {...props}>
    {children}
  </div>
);

const SidebarMenu = ({ children, className, ...props }) => (
  <nav className={cn("space-y-2", className)} {...props}>
    {children}
  </nav>
);

const SidebarMenuItem = ({ children, className, ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

const SidebarMenuButton = ({ children, isActive, onClick, className, ...props }) => (
  <button
    className={cn(
      "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
      isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(45);
  const [showChatButton, setShowChatButton] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get active section from path
  const getActiveSection = () => {
    const path = location.pathname.split("/")[2] || "";
    if (!path) return "feed";
    return path;
  };

  const activeSection = getActiveSection();

  // Simulate progress increase over time
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((prev) => Math.min(prev + 5, 100));
    }, 10000);
    return () => clearTimeout(timer);
  }, [progress]);

  // Handle navigation
  const handleNavigation = (section) => {
    if (section === "feed") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${section}`);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar className="">
          <SidebarHeader className="">
            <Link to="/" className="text-2xl font-light tracking-tight">
              TEK
            </Link>
          </SidebarHeader>

          <SidebarContent className="">
            <SidebarMenu className="">
              <SidebarMenuItem className="">
                <SidebarMenuButton
                  className=""
                  isActive={activeSection === "feed"}
                  onClick={() => handleNavigation("feed")}
                >
                  <Home className="h-5 w-5 mr-2" />
                  <span>Feed</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="">
                <SidebarMenuButton
                  className=""
                  isActive={activeSection === "university"}
                  onClick={() => handleNavigation("university")}
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  <span>University Explorer</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="">
                <SidebarMenuButton
                  className=""
                  isActive={activeSection === "career"}
                  onClick={() => handleNavigation("career")}
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>Career</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="border-b bg-white z-10">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <button 
                className="mr-2 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <h1 className="text-xl font-medium">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">{/* Navbar space reserved for other elements */}</div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>

                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>

      {/* Chat Button */}
      {showChatButton && (
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 transition-all duration-300",
            isChatOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600",
          )}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          <div className="p-3 border-b flex items-center justify-between bg-green-500 text-white rounded-t-lg">
            <h3 className="font-medium">Community Chat</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-green-600"
              onClick={() => setIsChatOpen(false)}
            >
              ×
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-xs font-medium">JD</span>
              </div>
              <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                <p className="text-sm">Has anyone completed the Visual Algebra course?</p>
                <span className="text-xs text-gray-500">10:30 AM</span>
              </div>
            </div>

            <div className="flex items-start justify-end">
              <div className="bg-green-100 rounded-lg p-2 max-w-[80%]">
                <p className="text-sm">
                  Yes, it was really helpful! The interactive examples made it easy to understand.
                </p>
                <span className="text-xs text-gray-500">10:32 AM</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center ml-2">
                <span className="text-xs font-medium">You</span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <span className="text-xs font-medium">TK</span>
              </div>
              <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                <p className="text-sm">I'm stuck on the third challenge. Any tips?</p>
                <span className="text-xs text-gray-500">10:45 AM</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-t">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <Button className="rounded-l-none bg-green-500 hover:bg-green-600">Send</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
