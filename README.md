# 🚀 **ANOMA | XION COMMUNITY SHOWCASE - FULL-STACK VERCEL**

A **complete full-stack application** built with the authentic Anoma aesthetic, featuring community submissions, admin management, AI-powered assistance, and running entirely on Vercel's serverless infrastructure.

## 🎨 **Anoma Aesthetic Features**
- **Color Palette**: Near-absolute black background with Anoma red (#FF4D4D) and lime (#DFFF00) accents
- **Typography**: Inter for body text, Space Mono for headings and technical elements
- **Background Grid**: Signature Anoma technical grid pattern
- **Logo Integration**: Authentic Anoma branding throughout the application
- **Image Assets**: Beautiful Anoma gem and symbol backgrounds

## 🏗️ **Full-Stack Architecture**
```
xion-frontend-main/          # 🚀 DEPLOY TO VERCEL (EVERYTHING INCLUDED)
├── src/                    # React frontend components
├── public/                 # Static assets (Anoma logo, images)
├── api/                    # 🆕 Vercel serverless functions (Backend)
│   ├── auth/login.js       # Admin authentication
│   ├── content/            # Content management APIs
│   └── upload/image.js     # Image upload to Supabase
├── vercel.json            # Vercel configuration
└── package.json           # All dependencies (frontend + backend)
```

## 🚀 **Deployment Strategy: FULL-STACK VERCEL**

### **✅ What This Means**
- **Single Repository**: Everything in one place
- **Single Deployment**: Deploy frontend AND backend together
- **Serverless Backend**: Vercel functions handle all API requests
- **Global CDN**: Fast loading worldwide
- **Automatic Scaling**: Pay only for what you use

### **🔧 Backend Services**
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for images
- **Authentication**: JWT-based admin system
- **API**: RESTful endpoints via Vercel functions

## 📱 **Features**
- **Content Gallery**: Browse community submissions
- **Submission Form**: Submit new content with image uploads
- **Admin Dashboard**: Manage and approve content
- **Ambassador AI**: AI-powered community assistance
- **Chat Assistant**: Floating help widget
- **Responsive Design**: Works on all devices

## 🎯 **Quick Start**

### **1. Clone & Install**
```bash
git clone https://github.com/yourusername/xion-community.git
cd xion-community
npm install
```

### **2. Set Up Supabase**
- Create project at [supabase.com](https://supabase.com)
- Run the SQL from `FULLSTACK-DEPLOYMENT.md`
- Create storage bucket `content-images`

### **3. Deploy to Vercel**
```bash
# Push to GitHub
git push origin main

# Deploy (or use Vercel dashboard)
vercel --prod
```

## 🌐 **API Endpoints**

### **Public**
- `POST /api/content/submit` - Submit content
- `GET /api/content/approved` - Get approved content
- `POST /api/upload/image` - Upload image

### **Admin (Auth Required)**
- `POST /api/auth/login` - Admin login
- `GET /api/content/pending` - Get pending content
- `PUT /api/content/approve` - Approve/reject content

## 🔧 **Environment Variables**
Set these in Vercel dashboard:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash
ADMIN_SECRET=your_admin_secret
```

## 📦 **Tech Stack**
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions + Node.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: JWT + bcrypt
- **Deployment**: Vercel (Full-Stack)

## 🎉 **Benefits of Full-Stack Vercel**
- ✅ **Single Repository**: Everything in one place
- ✅ **Automatic Deployments**: Deploy on every git push
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Serverless**: Pay only for what you use
- ✅ **Easy Scaling**: Automatic scaling with traffic
- ✅ **Integrated**: Frontend and backend work seamlessly
- ✅ **No Separate Hosting**: Everything runs on Vercel

## 📚 **Documentation**
- **`FULLSTACK-DEPLOYMENT.md`** - Complete deployment guide
- **`env.fullstack.example`** - Environment variables template
- **`vercel.json`** - Vercel configuration

## 🚀 **Ready to Deploy?**

Your **full-stack XION Community Showcase** with authentic Anoma aesthetic is now ready for production deployment on Vercel! 

**Everything runs in one place** - no need for separate backend hosting. Just push to GitHub, connect to Vercel, set your environment variables, and deploy! 🎨✨

The future of web development is here - full-stack applications running entirely on serverless infrastructure! 🚀

---

**🎨 Built with the authentic Anoma aesthetic**  
**🚀 Powered by Vercel's full-stack capabilities**  
**💎 XION Community Showcase** 