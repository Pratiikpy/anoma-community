@echo off
echo 🚀 Deploying XION Community Showcase to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Build the project
echo 📦 Building project...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    REM Deploy to Vercel
    echo 🚀 Deploying to Vercel...
    call vercel --prod
    
    echo 🎉 Deployment complete!
    echo 🌐 Your app is now live on Vercel!
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

pause 