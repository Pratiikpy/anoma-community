import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import ConveyorCarousel from "./ConveyorCarousel";
import { useApprovedContent, type ApprovedContent } from "@/hooks/useApprovedContent";

// This interface defines what data each content item should have
interface ContentItem {
  id: string;
  title: string;
  category: "threads" | "videos" | "graphics";
  author: string;
  url?: string; // Social media link
  thumbnail_url?: string;
  file_url?: string; // Database might use file_url instead of thumbnail_url
  created_at: string;
}

// Demo graphics data for fallback when not enough real graphics are available
const demoGraphicsContent = [{
  id: "demo1",
  title: "Xion Brand Identity Kit",
  category: "Graphic",
  author: "XionDesign",
  description: "Official brand assets and identity guidelines for developers",
  thumbnail_url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjM2NmYxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFjY291bnQgQWJzdHJhY3Rpb248L3RleHQ+PC9zdmc+"
}, {
  id: "demo2",
  title: "Abstract Flow Visualization",
  category: "Graphic",
  author: "Michelle",
  description: "Beautiful abstract representation of Xion's account abstraction",
  thumbnail_url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhc2xlc3MgVHV0b3JpYWw8L3RleHQ+PC9zdmc+"
}, {
  id: "demo3",
  title: "Community Meme Pack",
  category: "Graphic",
  author: "MemeLord",
  description: "Hilarious memes created by our vibrant community",
  thumbnail_url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU5ZTBhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb3N5c3RlbSBPdmVydmlldzwvdGV4dD48L3N2Zz4="
}, {
  id: "demo4",
  title: "Technical Architecture Diagram",
  category: "Graphic",
  author: "TechViz",
  description: "Detailed visual breakdown of Xion's infrastructure",
  thumbnail_url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNmI3MjgwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
}, {
  id: "demo5",
  title: "Web3 Simplified Infographic",
  category: "Graphic",
  author: "InfoCreator",
  description: "Easy-to-understand visual guide to Web3 concepts",
  thumbnail_url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjM2NmYxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFjY291bnQgQWJzdHJhY3Rpb248L3RleHQ+PC9zdmc+"
}];

// We'll use real data from the API instead of sample data
interface ContentGalleryProps {
  onSubmitClick?: () => void;
  isAdminAuthenticated?: boolean;
}
export default function ContentGallery({
  onSubmitClick,
  isAdminAuthenticated = false
}: ContentGalleryProps) {
  // Fetch real approved content from API
  const { content: approvedContent, loading, error } = useApprovedContent();
  
  // State to track which category filter is active
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // State to track which items should be visible based on the filter
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);

  // This effect runs whenever the activeFilter or approvedContent changes
  // It updates the filteredContent array to show only matching items
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredContent(approvedContent);
    } else {
      setFilteredContent(approvedContent.filter(item => item.category === activeFilter));
    }
  }, [activeFilter, approvedContent]);

  // Get recent content for floating window (last 3 approved items)
  const recentContent = approvedContent
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Create graphics content for conveyor belt
  // Filter approved content to only include graphics
  const realGraphics = approvedContent.filter(item => item.category === 'graphics');
  
  // Create the final graphics array with real content + demo fallbacks
  const graphicsContent = (() => {
    const targetCount = 5; // Show 5 images at a time
    const realCount = realGraphics.length;
    
    if (realCount >= targetCount) {
      // If we have enough real graphics, use them and create a loop
      return [...realGraphics, ...realGraphics.slice(0, targetCount - realCount)];
    } else {
      // If we don't have enough real graphics, mix real + demo
      const neededDemoCount = targetCount - realCount;
      const demoToUse = demoGraphicsContent.slice(0, neededDemoCount);
      return [...realGraphics, ...demoToUse];
    }
  })();

  return <div className="min-h-screen bg-anoma-black text-anoma-white">
      {/* Hero Section - Anoma aesthetic */}
      <div className="relative py-20">
        {/* Anoma Gem Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img 
            src="/anoma-gem.png" 
            alt="Anoma Gem" 
            className="w-96 h-96 object-contain"
          />
        </div>
        
        <div className="container mx-auto px-8 text-center">
          <div className="relative z-10">
            {/* Anoma Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/anoma-logo.jpg" 
                alt="Anoma Logo" 
                className="w-24 h-24 object-cover rounded-none border-2 border-anoma-gray"
              />
            </div>
            <h1 className="text-7xl font-mono font-bold text-anoma-white mb-8 uppercase tracking-wider">
              XION <span className="text-anoma-red">CONTENT GALLERY</span>
            </h1>
            <p className="text-xl text-anoma-white/80 max-w-4xl mx-auto mb-12 font-sans">
              Discover amazing content created by our vibrant community. From educational threads 
              to creative graphics and informative videos - explore what makes Xion special.
            </p>
            <div className="flex justify-center gap-6 mb-16">
              <Button 
                size="lg" 
                className="btn-anoma-primary text-lg px-8 py-4" 
                onClick={() => document.getElementById('browse-all-content')?.scrollIntoView({
                  behavior: 'smooth'
                })}
              >
                EXPLORE CONTENT
              </Button>
              <Button 
                size="lg" 
                className="btn-anoma-secondary text-lg px-8 py-4" 
                onClick={onSubmitClick}
              >
                SUBMIT YOUR WORK
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Window for Recent Content - Anoma style */}
      {recentContent.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-anoma-black/90 backdrop-blur-sm border border-anoma-gray p-6 shadow-lg max-w-sm">
            <h3 className="text-sm font-mono font-semibold text-anoma-white mb-4 uppercase tracking-wide">RECENT CONTENT</h3>
            <div className="space-y-3">
              {recentContent.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 text-xs">
                  <Badge variant="secondary" className="capitalize bg-anoma-red/20 text-anoma-red border-anoma-red/30 rounded-none font-mono uppercase">
                    {item.category}
                  </Badge>
                  <span className="text-anoma-white truncate">{item.title}</span>
                  <span className="text-anoma-white/60">by {item.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Graphics Section - Anoma aesthetic */}
      <div className="py-20 border-t border-anoma-gray relative">
        {/* Floating Anoma Gem */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 opacity-10 pointer-events-none">
          <img 
            src="/anoma-symbol.png" 
            alt="Anoma Symbol" 
            className="w-32 h-32 object-contain animate-float"
          />
        </div>
        
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-mono font-bold text-anoma-white mb-6 uppercase tracking-wider">
              FEATURED GRAPHICS
            </h2>
            <p className="text-lg text-anoma-white/80 font-sans">
              Discover amazing graphics created by our community
            </p>
          </div>
          <ConveyorCarousel items={graphicsContent} speed={90} cardWidth={300} gap={16} />
        </div>
      </div>

      {/* Header section with title and filter buttons - Anoma aesthetic */}
      <div id="browse-all-content" className="relative z-10 pt-20 pb-20 border-t border-anoma-gray">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-mono font-bold text-anoma-red mb-6 uppercase tracking-wider">
            BROWSE ALL CONTENT
          </h1>
          <p className="text-xl text-anoma-white/80 max-w-3xl mx-auto font-sans">
            Filter and explore our complete collection
          </p>
        </div>

        {/* Filter buttons - Anoma button styles */}
        <div className="flex justify-center gap-6 mb-20">
          <Button 
            className={`${activeFilter === "all" ? "btn-anoma-primary" : "btn-anoma-secondary"} px-8 py-4 text-lg`}
            onClick={() => setActiveFilter("all")} 
          >
            ALL CONTENT
          </Button>
          <Button 
            className={`${activeFilter === "graphics" ? "btn-anoma-primary" : "btn-anoma-secondary"} px-8 py-4 text-lg`}
            onClick={() => setActiveFilter("graphics")} 
          >
            GRAPHICS
          </Button>
          <Button 
            className={`${activeFilter === "videos" ? "btn-anoma-primary" : "btn-anoma-secondary"} px-8 py-4 text-lg`}
            onClick={() => setActiveFilter("videos")} 
          >
            VIDEOS
          </Button>
          <Button 
            className={`${activeFilter === "threads" ? "btn-anoma-primary" : "btn-anoma-secondary"} px-8 py-4 text-lg`}
            onClick={() => setActiveFilter("threads")} 
          >
            THREADS
          </Button>
        </div>
      </div>

      {/* Content grid - Anoma aesthetic */}
      <div className="relative z-10 px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-anoma-white/80 text-lg font-sans">Loading approved content...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-anoma-red text-lg font-sans">Error loading content: {error}</p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-anoma-white/80 text-lg font-sans">No approved content available yet.</p>
              <p className="text-anoma-white/80 font-sans">Submit content and wait for admin approval!</p>
            </div>
          ) : (
            /* Grid container with responsive columns */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContent.map((item, index) => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  isAdminAuthenticated={isAdminAuthenticated}
                  onContentUpdate={() => {
                    // This will trigger a refetch of the content
                    window.location.reload();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
          </div>;
}

// Edit Content Modal Component
interface EditContentModalProps {
  content: ContentItem;
  onClose: () => void;
  onUpdate: () => void;
}

function EditContentModal({ content, onClose, onUpdate }: EditContentModalProps) {
  const [formData, setFormData] = useState({
    title: content.title,
    category: content.category,
    author: content.author,
    url: content.url || '',
    thumbnail: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof typeof formData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("thumbnail", file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.author) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('author', formData.author);
      submitData.append('url', formData.url);
      
      if (formData.thumbnail) {
        submitData.append('thumbnail', formData.thumbnail);
      }

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/content/${content.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        toast({
          title: "Content Updated",
          description: "The content has been successfully updated.",
        });
        onUpdate();
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Edit Content</h2>
        <p className="text-muted-foreground">Update the content details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Content title..."
            className="bg-background/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Author *</label>
          <Input
            value={formData.author}
            onChange={(e) => handleInputChange("author", e.target.value)}
            placeholder="Author name..."
            className="bg-background/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category *</label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger className="bg-background/50 border-border focus:border-primary">
              <SelectValue placeholder="Choose a category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="threads">Thread/Article</SelectItem>
              <SelectItem value="videos">Video</SelectItem>
              <SelectItem value="graphics">Graphics/Art</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">URL</label>
          <Input
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            placeholder="https://twitter.com/... or https://youtube.com/..."
            type="url"
            className="bg-background/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">New Thumbnail (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-border rounded-md bg-background/50 focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            {isSubmitting ? "Updating..." : "Update Content"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

// Separate component for each content card
// This keeps our code organized and reusable
interface ContentCardProps {
  item: ContentItem;
  index: number;
  isAdminAuthenticated?: boolean;
  onContentUpdate?: () => void;
}
function ContentCard({
  item,
  index,
  isAdminAuthenticated = false,
  onContentUpdate
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Different animation delays for each card create a staggered effect
  const animationDelay = `${index * 0.2}s`;

  // Handle delete content
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/content/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Content Deleted",
          description: "The content has been successfully deleted.",
        });
        onContentUpdate?.();
      } else {
        throw new Error('Failed to delete content');
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return <div className="group relative" style={{
    animationDelay
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Card container with hover effects - Anoma aesthetic */}
      <div className={`
        relative overflow-hidden rounded-none border border-anoma-gray
        bg-anoma-black backdrop-blur-sm
        shadow-card transition-all duration-500
        transform hover:scale-105 hover:shadow-glow
        aspect-[4/3] max-h-[280px]
        ${isHovered ? 'animate-float' : ''}
      `}>
        {/* Clickable image that opens dialog with view content option */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-full h-[75%] bg-anoma-gray flex items-center justify-center cursor-pointer hover:bg-anoma-gray/80 transition-colors group overflow-hidden">
              {(item.thumbnail_url || item.file_url) ? (
                <img 
                  src={item.thumbnail_url || item.file_url} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-anoma-red font-mono uppercase">XION</span>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full bg-anoma-black border-anoma-gray">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full h-96 bg-anoma-gray rounded-none flex items-center justify-center overflow-hidden">
                {(item.thumbnail_url || item.file_url) ? (
                  <img 
                    src={item.thumbnail_url || item.file_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl font-bold text-anoma-red font-mono uppercase">XION</span>
                )}
              </div>
              <div className="text-center">
                <h3 
                  className="text-2xl font-mono font-semibold text-anoma-white mb-2 cursor-pointer hover:text-anoma-red transition-colors uppercase"
                >
                  {item.title}
                </h3>
                                 <Badge variant="secondary" className="capitalize bg-anoma-red/20 text-anoma-red border-anoma-red/30 rounded-none font-mono uppercase">
                   {item.category}
                 </Badge>
                 <span className="text-sm text-anoma-white/60 font-sans">by {item.author}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Compact info section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-anoma-black/95 to-transparent px-[18px] py-[12px]">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="capitalize bg-anoma-red/20 text-anoma-red border-anoma-red/30 text-xs rounded-none font-mono uppercase">
              {item.category}
            </Badge>
            <div className="text-xs text-anoma-white/60 font-sans">
              {new Date(item.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-mono font-semibold text-anoma-white group-hover:text-anoma-red transition-colors truncate uppercase">
                {item.title}
              </h3>
              <span className="text-xs text-anoma-white/60 truncate font-sans">
                by {item.author}
              </span>
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" className="text-xs px-3 py-1" onClick={() => {
                if (item.url) {
                  // Open the submitted social media link
                  window.open(item.url, '_blank');
                } else if (item.thumbnail_url || item.file_url) {
                  // Fallback to opening the image if no URL provided
                  window.open(item.thumbnail_url || item.file_url, '_blank');
                }
              }}>
                View
              </Button>
              
              {isAdminAuthenticated && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    className="text-xs px-2 py-1"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "..." : "Delete"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Glow effect that appears on hover */}
        {isHovered && <div className="absolute -inset-1 bg-gradient-primary rounded-2xl opacity-20 blur-sm -z-10 animate-glow-pulse" />}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <EditContentModal 
            content={item} 
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={() => {
              setIsEditModalOpen(false);
              onContentUpdate?.();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>;
}