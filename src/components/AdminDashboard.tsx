import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

// Interface for pending submissions that need admin approval
interface PendingSubmission {
  id: string;
  title: string;
  category: "threads" | "videos" | "graphics";
  author: string;
  url?: string; // Social media link
  thumbnail_url?: string;
  created_at: string;
}

interface AdminDashboardProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({ isAuthenticated, onLogin, onLogout }: AdminDashboardProps) {
  console.log('AdminDashboard render - isAuthenticated:', isAuthenticated);
  
  // State to manage submissions (admin can approve/reject)
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [rejectedSubmissions, setRejectedSubmissions] = useState<PendingSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  
  // Hook for showing notifications
  const { toast } = useToast();

  // Login form state - moved to top level
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ username: '', password: '' });
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('adminToken'));

  // Fetch pending submissions from API
  const fetchPendingSubmissions = async () => {
    if (!authToken) {
      console.error('No auth token available');
      return;
    }
    
    setLoadingSubmissions(true);
    try {
      const response = await fetch('/api/content/pending', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingSubmissions(data);
      } else {
        console.error('Failed to fetch pending submissions');
        toast({ title: "Error", description: "Failed to load pending submissions", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error fetching pending submissions:', error);
      toast({ title: "Error", description: "Failed to load pending submissions", variant: "destructive" });
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Fetch rejected submissions from API
  const fetchRejectedSubmissions = async () => {
    if (!authToken) {
      console.error('No auth token available');
      return;
    }
    
    try {
      console.log('Fetching rejected submissions...');
      console.log('Using auth token:', authToken.substring(0, 20) + '...');
      const response = await fetch('/api/content/rejected', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Rejected submissions received:', data);
        setRejectedSubmissions(data);
      } else {
        console.error('Failed to fetch rejected submissions, status:', response.status);
        console.error('Response text:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching rejected submissions:', error);
    }
  };

  // Fetch stats from persistent storage
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/chat-stats');
      if (response.ok) {
        const data = await response.json();
        console.log('Stats data received:', data);
        setApprovedCount(data.total_approved_content || 0);
        setRejectedCount(data.total_rejected_content || 0);
        setTotalSubmissions(data.total_submissions || 0);
        console.log('Set stats:', {
          approved: data.total_approved_content || 0,
          rejected: data.total_rejected_content || 0,
          total: data.total_submissions || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Refresh all data
  const refreshData = () => {
    fetchPendingSubmissions();
    fetchRejectedSubmissions();
    fetchStats();
  };

  // Floating card component for submissions
  const SubmissionCard = ({ submission, index, isRejected = false }: { 
    submission: PendingSubmission; 
    index: number; 
    isRejected?: boolean;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const animationDelay = `${index * 0.1}s`;

    return (
      <div 
        className="group relative" 
        style={{ animationDelay }}
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`
          relative overflow-hidden rounded-2xl border border-border
          bg-gradient-card backdrop-blur-sm
          shadow-card transition-all duration-500
          transform hover:scale-105 hover:shadow-glow
          aspect-[4/3] max-h-[280px]
          ${isRejected ? 'border-red-200 bg-red-50/20' : ''}
        `}>
          {/* Clickable image that opens dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative w-full h-[75%] bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors group overflow-hidden">
                {submission.thumbnail_url ? (
                  <img 
                    src={submission.thumbnail_url}
                    alt={submission.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary">XIONIMG</span>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {submission.thumbnail_url ? (
                    <img 
                      src={submission.thumbnail_url} 
                      alt={submission.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-bold text-primary">XIONIMG</span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    {submission.title}
                  </h3>
                  <Badge variant="secondary" className="capitalize bg-primary/20 text-primary border-primary/30">
                    {submission.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">by {submission.author}</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Compact info section at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/95 to-transparent px-[18px] py-[12px]">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="capitalize bg-primary/20 text-primary border-primary/30 text-xs">
                {submission.category}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {new Date(submission.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {submission.title}
                </h3>
                <span className="text-xs text-muted-foreground truncate">
                  by {submission.author}
                </span>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  onClick={() => handleApprove(submission.id)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                >
                  Approve
                </Button>
                {!isRejected && (
                  <Button 
                    onClick={() => handleReject(submission.id)}
                    size="sm"
                    variant="destructive"
                    className="text-xs px-2 py-1"
                  >
                    Reject
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs px-2 py-1"
                  onClick={() => {
                    if (submission.url) {
                      window.open(submission.url, '_blank');
                    } else if (submission.thumbnail_url) {
                      window.open(submission.thumbnail_url, '_blank');
                    } else {
                      toast({ title: "No Preview", description: "No link or thumbnail available for this submission" });
                    }
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          </div>

          {/* Glow effect that appears on hover */}
          {isHovered && (
            <div className={`absolute -inset-1 rounded-2xl opacity-20 blur-sm -z-10 animate-glow-pulse ${
              isRejected ? 'bg-red-500' : 'bg-gradient-primary'
            }`} />
          )}
        </div>
      </div>
    );
  };

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingSubmissions();
      fetchRejectedSubmissions();
      fetchStats();
    }
  }, [isAuthenticated]);

  // Function to approve a submission
  const handleApprove = async (submissionId: string) => {
    if (!authToken) {
      toast({ title: "Error", description: "Authentication required", variant: "destructive" });
      return;
    }
    
    try {
      const response = await fetch(`/api/content/${submissionId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: 'approved' })
      });
      
      if (response.ok) {
        // Remove from pending list and update counts
        setPendingSubmissions(prev => prev.filter(item => item.id !== submissionId));
        // Immediately refresh data to update stats and lists
        refreshData();
        toast({
          title: "Content Approved",
          description: "The submission has been approved and is now live in the gallery.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to approve submission",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error approving submission:', error);
      toast({
        title: "Error",
        description: "Failed to approve submission",
        variant: "destructive"
      });
    }
  };

  // Function to reject a submission  
  const handleReject = async (submissionId: string) => {
    if (!authToken) {
      toast({ title: "Error", description: "Authentication required", variant: "destructive" });
      return;
    }
    
    try {
      const response = await fetch(`/api/content/${submissionId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      
      if (response.ok) {
        // Remove from pending list
        setPendingSubmissions(prev => prev.filter(item => item.id !== submissionId));
        // Immediately refresh data to update rejected list and stats
        refreshData();
        toast({
          title: "Content Rejected", 
          description: "The submission has been rejected and moved to rejected submissions.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to reject submission",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast({
        title: "Error",
        description: "Failed to reject submission",
        variant: "destructive"
      });
    }
  };

  // Login handler - moved to top level
  const handleBackendLogin = async () => {
    setLoading(true);
    try {
      // Use the actual form data
      const credentials = { username: formData.username, password: formData.password };
      setDebugInfo(credentials);
      
      console.log('Attempting login with:', credentials);
      
      const response = await fetch("/api/admin/login", { // Updated to relative URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      
      console.log('Login response:', { status: response.status, data });
      
      if (response.ok && data.token) {
        console.log('Login successful, calling onLogin()');
        console.log('Token received:', data.token.substring(0, 20) + '...');
        // Store the token
        localStorage.setItem('adminToken', data.token);
        setAuthToken(data.token);
        console.log('Token stored in localStorage and state');
        onLogin();
        toast({ title: "Login successful", description: "Welcome, admin!" });
      } else {
        console.log('Login failed:', data.error);
        toast({ title: "Login failed", description: data.error || "Invalid credentials", variant: "destructive" });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({ title: "Login failed", description: "Could not connect to backend.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, show simple login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-anoma-black text-anoma-white flex items-center justify-center p-8 bg-anoma-grid">
        <div className="absolute inset-0 bg-gradient-glow animate-glow-pulse pointer-events-none opacity-20" />
        <Card className="w-full max-w-md relative z-10 border-anoma-gray bg-anoma-black backdrop-blur-sm rounded-none">
          <CardHeader className="text-center">
            {/* Anoma Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src="/anoma-logo.jpg" 
                alt="Anoma Logo" 
                className="w-16 h-16 object-cover rounded-none border border-anoma-gray"
              />
            </div>
            <CardTitle className="text-3xl font-mono font-bold text-anoma-white uppercase tracking-wider">
              ADMIN LOGIN
            </CardTitle>
            <p className="text-anoma-white/80 font-sans">
              Access the admin dashboard to manage content
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-mono font-medium text-anoma-white uppercase tracking-wide">EMAIL</label>
              <input 
                type="email" 
                placeholder="admin@xion.community"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 bg-anoma-black/50 border border-anoma-gray rounded-none focus:outline-none focus:border-anoma-red text-anoma-white placeholder:text-anoma-white/40"
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-mono font-medium text-anoma-white uppercase tracking-wide">PASSWORD</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 bg-anoma-black/50 border border-anoma-gray rounded-none focus:outline-none focus:border-anoma-red text-anoma-white placeholder:text-anoma-white/40"
                disabled={loading}
              />
            </div>
            <Button onClick={handleBackendLogin} className="w-full btn-anoma-primary" disabled={loading}>
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </Button>
            <p className="text-xs text-anoma-white/60 text-center font-sans">
              Demo: Click "Sign In" to access the dashboard
            </p>
          </CardContent>
        </Card>
        
        {/* Temporary Debug Info - Bottom Left Corner */}
        <div className="fixed bottom-4 left-4 bg-anoma-black/80 text-anoma-white p-4 rounded-none text-xs max-w-xs border border-anoma-gray">
          <div className="font-bold mb-2">🔍 DEBUG INFO:</div>
          <div>Input Username: {formData.username || '(empty)'}</div>
          <div>Input Password: {formData.password || '(empty)'}</div>
          <div className="mt-2 font-bold">✅ Correct Credentials:</div>
          <div>Username: xion</div>
          <div>Password: password</div>
          <div className="mt-2 text-anoma-lime">Click "Sign In" to test login</div>
        </div>
      </div>
    );
  }

  // Admin dashboard when logged in
  return (
    <div className="min-h-screen bg-anoma-black text-anoma-white p-8 bg-anoma-grid">
      {/* Anoma Symbol Background */}
      <div className="fixed top-1/2 left-8 transform -translate-y-1/2 opacity-5 pointer-events-none">
        <img 
          src="/anoma-symbol.png" 
          alt="Anoma Symbol" 
          className="w-48 h-48 object-contain"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-glow animate-glow-pulse pointer-events-none opacity-10" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/anoma-logo.jpg" 
              alt="Anoma Logo" 
              className="w-12 h-12 object-cover rounded-none border border-anoma-gray"
            />
            <div>
              <h1 className="text-5xl font-mono font-bold text-anoma-white uppercase tracking-wider">ADMIN DASHBOARD</h1>
              <p className="text-anoma-white/80 mt-4 font-sans">
                Manage content submissions and community contributions
              </p>
            </div>
          </div>
          <Button onClick={() => {
            localStorage.removeItem('adminToken');
            setAuthToken(null);
            onLogout();
          }} className="btn-anoma-secondary">
            LOGOUT
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-anoma-black backdrop-blur-sm border-anoma-gray rounded-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-mono text-anoma-white uppercase tracking-wide">PENDING REVIEWS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-anoma-red font-mono">{pendingSubmissions.length}</div>
              <p className="text-sm text-anoma-white/60 font-sans">Awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card className="bg-anoma-black backdrop-blur-sm border-anoma-gray rounded-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-mono text-anoma-white uppercase tracking-wide">TOTAL APPROVED</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-anoma-lime font-mono">{approvedCount}</div>
              <p className="text-sm text-anoma-white/60 font-sans">Live content</p>
            </CardContent>
          </Card>
          
          <Card className="bg-anoma-black backdrop-blur-sm border-anoma-gray rounded-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-mono text-anoma-white uppercase tracking-wide">TOTAL CONTENT SUBMITTED</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-anoma-white font-mono">
                {totalSubmissions > 0 ? totalSubmissions : (approvedCount + rejectedCount + pendingSubmissions.length)}
              </div>
              <p className="text-sm text-anoma-white/60 font-sans">All submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions */}
        <Card className="bg-anoma-black backdrop-blur-sm border-anoma-gray rounded-none mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-mono text-anoma-white uppercase tracking-wider">PENDING SUBMISSIONS</CardTitle>
            <p className="text-anoma-white/80 font-sans">
              Review and approve community content submissions
            </p>
          </CardHeader>
          <CardContent>
            {loadingSubmissions ? (
              <div className="text-center py-12">
                <p className="text-anoma-white/80 font-sans">Loading pending submissions...</p>
              </div>
            ) : pendingSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-anoma-white/80 font-sans">No pending submissions</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingSubmissions.map((submission, index) => (
                  <SubmissionCard 
                    key={submission.id} 
                    submission={submission} 
                    index={index}
                    isRejected={false}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rejected Submissions */}
        <Card className="bg-anoma-black backdrop-blur-sm border-anoma-gray rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-mono text-anoma-white uppercase tracking-wider">REJECTED SUBMISSIONS ({rejectedSubmissions.length})</CardTitle>
            <p className="text-anoma-white/80 font-sans">
              Previously rejected content submissions
            </p>
          </CardHeader>
          <CardContent>
            {rejectedSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-anoma-white/80 font-sans">No rejected submissions</p>
                <p className="text-xs text-anoma-white/60 mt-3 font-sans">Debug: rejectedSubmissions array is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rejectedSubmissions.map((submission, index) => (
                  <SubmissionCard 
                    key={submission.id} 
                    submission={submission} 
                    index={index}
                    isRejected={true}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}