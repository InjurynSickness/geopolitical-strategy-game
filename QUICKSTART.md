# 🚀 Quick Start Guide

## First Time Setup

### 1. Make sure you have Node.js installed
Download from: https://nodejs.org/ (version 16 or higher)

### 2. Clone the repository (if you haven't already)
```bash
git clone https://github.com/InjurynSickness/worldpolitik.git
cd worldpolitik
```

### 3. Install dependencies
```bash
npm install
```

⏳ This will take 1-2 minutes. Wait until you see "audited X packages".

### 4. Start the game
```bash
npm run dev
```

### 5. Open your browser
Go to: **http://localhost:3000/**

---

## 🆘 If you see errors:

### "Cannot find module 'tailwindcss'" or blank white screen

**Delete everything and start fresh:**

```bash
# Windows Command Prompt:
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev

# Mac/Linux/Git Bash:
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 3000 is already in use

Change the port in `vite.config.ts` or kill the existing process:

```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

---

## ✅ You should see:

1. **Main Menu** with "New Game", "Load Game", and "Back" buttons
2. Click **"New Game"** to see country selection
3. Choose a country and click **"Select Country"** to start!

---

## 📁 Where are the game files?

- **Menu UI:** `src/menu-ui/components/`
- **Game Logic:** `src/game/`
- **Styling:** `src/menu-ui/styles/globals.css`
- **Map Assets:** `terrain.png`, `provinces.png`, `rivers.png`

---

Need more help? Check the full **README.md** file!
