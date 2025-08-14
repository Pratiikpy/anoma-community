import { useState } from "react";
import ContentGallery from "@/components/ContentGallery";
import SubmissionForm from "@/components/SubmissionForm";
import AdminDashboard from "@/components/AdminDashboard";
import ChatAssistant from "@/components/ChatAssistant";
import AmbassadorAI from "./AmbassadorAI";
import { Button } from "@/components/ui/button";

// This is our main page component that controls navigation between different views
const Index = () => {
  // State to track which page the user is currently viewing
  const [currentView, setCurrentView] = useState<"gallery" | "submit" | "admin" | "ambassador">("gallery");

  // State to track admin authentication (in real app, use proper auth)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  console.log('Index render - currentView:', currentView, 'isAdminAuthenticated:', isAdminAuthenticated);
  
  const handleLogin = () => {
    console.log('Login called - setting isAdminAuthenticated to true');
    setIsAdminAuthenticated(true);
  };
  
  const handleLogout = () => {
    console.log('Logout called - setting isAdminAuthenticated to false');
    setIsAdminAuthenticated(false);
  };
  
  return <div className="min-h-screen bg-anoma-black text-anoma-white bg-anoma-grid">
      {/* Anoma Symbol Background */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 opacity-5 pointer-events-none">
        <img 
          src="/anoma-symbol.png" 
          alt="Anoma Symbol" 
          className="w-64 h-64 object-contain"
        />
      </div>
      
      {/* Navigation header - Anoma aesthetic */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-anoma-black/90 backdrop-blur-md border-b border-anoma-gray">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          {/* Logo/Brand area - Anoma style */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView("gallery")}>
            <img 
              src="/anoma-logo.jpg" 
              alt="Anoma Logo" 
              className="w-10 h-10 object-cover rounded-none"
            />
            <span className="text-2xl font-mono font-bold text-anoma-white uppercase tracking-wider">XION</span>
          </div>

          {/* Navigation buttons - Anoma button styles */}
          <div className="flex gap-6">
            <Button 
              className={currentView === "gallery" ? "btn-anoma-primary" : "btn-anoma-secondary"}
              onClick={() => setCurrentView("gallery")}
            >
              GALLERY
            </Button>
            <Button 
              className={currentView === "ambassador" ? "btn-anoma-primary" : "btn-anoma-secondary"}
              onClick={() => setCurrentView("ambassador")}
            >
              AMBASSADOR AI
            </Button>
            <Button 
              className={currentView === "submit" ? "btn-anoma-primary" : "btn-anoma-secondary"}
              onClick={() => setCurrentView("submit")}
            >
              SUBMIT CONTENT
            </Button>
            <Button 
              className={currentView === "admin" ? "btn-anoma-primary" : "btn-anoma-secondary"}
              onClick={() => setCurrentView("admin")}
            >
              ADMIN
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content area - Anoma aesthetic with generous spacing */}
      <main className="pt-32 pb-20 px-8">
        {currentView === "gallery" && <ContentGallery onSubmitClick={() => setCurrentView("submit")} isAdminAuthenticated={isAdminAuthenticated} />}
        {currentView === "submit" && <SubmissionForm />}
        {currentView === "ambassador" && <AmbassadorAI />}
        {currentView === "admin" && <AdminDashboard isAuthenticated={isAdminAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />}
      </main>

      {/* AI Chat Assistant - always available */}
      <ChatAssistant />
    </div>;
};
export default Index;