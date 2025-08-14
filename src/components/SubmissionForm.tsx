import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useToast } from "@/hooks/use-toast";

// This interface defines the shape of our form data
interface SubmissionData {
  title: string;
  category: "threads" | "videos" | "graphics" | "";
  url: string;
  author: string;
  thumbnail: File | null;
}

export default function SubmissionForm() {
  // State to manage form data - starts with empty values
  const [formData, setFormData] = useState<SubmissionData>({
    title: "",
    category: "",
    url: "",
    author: "",
    thumbnail: null
  });

  // State to track if form is being submitted (for loading states)
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hook for showing toast notifications to users
  const { toast } = useToast();

  // This function updates form data when input fields change
  const handleInputChange = (field: keyof SubmissionData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,  // Keep existing data
      [field]: value  // Update only the changed field
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("thumbnail", file);
  };

  // This function runs when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    
    // Basic validation - check if required fields are filled
    if (!formData.title || !formData.category || !formData.author) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('author', formData.author);
      submitData.append('url', formData.url); // Social media link
      
      if (formData.thumbnail) {
        submitData.append('thumbnail', formData.thumbnail);
      }

      // Send to backend API
      const response = await fetch('/api/content/submit', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message
        toast({
          title: "Submission Received!",
          description: "Thank you for contributing to the Xion community. Your content will be reviewed soon.",
        });

        // Reset form after successful submission
        setFormData({
          title: "",
          category: "",
          url: "",
          author: "",
          thumbnail: null
        });
      } else {
        throw new Error(result.error || 'Submission failed');
      }

    } catch (error) {
      // Show error message if something goes wrong
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-anoma-black text-anoma-white flex items-center justify-center p-8 bg-anoma-grid">
      {/* Anoma Gem Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <img 
          src="/anoma-gem.png" 
          alt="Anoma Gem" 
          className="w-80 h-80 object-contain"
        />
      </div>
      
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-glow animate-glow-pulse pointer-events-none opacity-30" />
      
      <Card className="w-full max-w-2xl relative z-10 border-anoma-gray bg-anoma-black backdrop-blur-sm rounded-none">
        <CardHeader className="text-center">
          {/* Anoma Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/anoma-logo.jpg" 
              alt="Anoma Logo" 
              className="w-20 h-20 object-cover rounded-none border border-anoma-gray"
            />
          </div>
          <CardTitle className="text-4xl font-mono font-bold text-anoma-white uppercase tracking-wider">
            SUBMIT YOUR CONTENT
          </CardTitle>
          <p className="text-anoma-white/80 mt-4 font-sans">
            Share your threads, videos, or graphics with the Xion community
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title input field */}
            <div className="space-y-3">
              <label className="text-sm font-mono font-medium text-anoma-white uppercase tracking-wide">
                TITLE *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Give your content a catchy title..."
                className="bg-anoma-black/50 border-anoma-gray focus:border-anoma-red rounded-none text-anoma-white placeholder:text-anoma-white/40"
              />
            </div>

            {/* Author input field */}
            <div className="space-y-3">
              <label className="text-sm font-mono font-medium text-anoma-white uppercase tracking-wide">
                YOUR NAME *
              </label>
              <Input
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="How should we credit you?"
                className="bg-anoma-black/50 border-anoma-gray focus:border-anoma-red rounded-none text-anoma-white placeholder:text-anoma-white/40"
              />
            </div>

            {/* Category selection dropdown */}
            <div className="space-y-3">
              <label className="text-sm font-mono font-medium text-anoma-white uppercase tracking-wide">
                CATEGORY *
              </label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="bg-anoma-black/50 border-anoma-gray focus:border-anoma-red rounded-none text-anoma-white">
                  <SelectValue placeholder="Choose a category..." />
                </SelectTrigger>
                <SelectContent className="bg-anoma-black border-anoma-gray">
                  <SelectItem value="threads" className="text-anoma-white hover:bg-anoma-gray">Thread/Article</SelectItem>
                  <SelectItem value="videos" className="text-anoma-white hover:bg-anoma-gray">Video</SelectItem>
                  <SelectItem value="graphics" className="text-anoma-white hover:bg-anoma-gray">Graphics/Art</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL input field */}
            <div className="space-y-3">
              <label className="text-sm font-mono font-medium text-anoma-white uppercase tracking-wide">
                CONTENT URL
              </label>
              <Input
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://twitter.com/... or https://youtube.com/..."
                type="url"
                className="bg-anoma-black/50 border-anoma-gray focus:border-anoma-red rounded-none text-anoma-white placeholder:text-anoma-white/40"
              />
              <p className="text-xs text-anoma-white/60 font-sans">
                Link to your Twitter thread, YouTube video, or any social media post (optional)
              </p>
            </div>

            {/* Thumbnail upload */}
            <div className="space-y-3">
              <label className="text-sm font-mono font-medium text-anoma-white uppercase tracking-wide">
                THUMBNAIL IMAGE
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-anoma-gray rounded-none bg-anoma-black/50 focus:border-anoma-red text-anoma-white file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-anoma-red file:text-anoma-black file:cursor-pointer file:font-mono file:uppercase"
                />
                {formData.thumbnail && (
                  <p className="text-xs text-anoma-white/60 mt-2 font-sans">
                    Selected: {formData.thumbnail.name}
                  </p>
                )}
              </div>
              <p className="text-xs text-anoma-white/60 font-sans">
                Upload a thumbnail image for your content (optional)
              </p>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-mono font-semibold btn-anoma-primary uppercase tracking-wider"
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT CONTENT"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}