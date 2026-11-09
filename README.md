# SOE Invaders - CONNECT Game

A browser-based HTML5 arcade game demonstrating Cenitex Gold Standard SOEs vs marketplace image threats.

## 🎮 Play Locally

Simply open `index.html` in Chrome or Edge. No installation or build process needed!

## 🌐 Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **+** icon (top right) → **New repository**
3. Name it: `soe-invaders` (or any name you prefer)
4. Keep it **Public** (so GitHub Pages works for free)
5. Don't add README, .gitignore, or license (we have our own files)
6. Click **Create repository**

### Step 2: Upload Files

**Option A: Using GitHub Web Interface (Easiest)**

1. On your new repository page, click **uploading an existing file**
2. Drag and drop these 4 files:
   - `index.html`
   - `game.js`
   - `styles.css`
   - `CLAUDE.md`
3. Add commit message: "Initial commit"
4. Click **Commit changes**

**Option B: Using Git Command Line**

```bash
cd C:\Data\Scripts\SOE-Game-Connect
git init
git add index.html game.js styles.css CLAUDE.md README.md
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/soe-invaders.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. In your repository, click **Settings** (top menu)
2. Scroll down to **Pages** (left sidebar)
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for deployment

### Step 4: Get Your URL

Your game will be live at:
```
https://YOUR-USERNAME.github.io/soe-invaders/
```

GitHub will show you the exact URL in the Pages settings.

## 📱 Mobile & Desktop Support

- ✅ **Desktop**: Keyboard (Arrow keys/WASD, Spacebar) or Mouse
- ✅ **Mobile/Tablet**: Touch controls (drag to move, tap to fire)
- ✅ **Responsive**: Automatically scales to fit any screen

## 🎯 Game Features

- Three enemy types representing marketplace image issues
- Progressive difficulty (60-second missions)
- Cenitex SOE branding throughout gameplay
- Particle effects and visual polish
- Educational messaging about Gold Standard SOEs

## 📊 For CONNECT Demo

### Share via QR Code

Once hosted, generate a QR code pointing to your GitHub Pages URL:
- Use https://qr-code-generator.com
- Attendees can scan and play instantly on their phones

### Update the Game

To make changes:
1. Edit the files locally
2. Test by opening `index.html`
3. Upload updated files to GitHub (repeat Step 2)
4. Changes appear at your URL within 1-2 minutes

## 🛠️ Technical Details

- **Technology**: Pure HTML5/CSS3/JavaScript (no frameworks)
- **No Backend**: Runs entirely in the browser
- **No Dependencies**: No npm, webpack, or build process
- **File Size**: ~50KB total (very lightweight)
- **Browsers**: Chrome, Edge, Safari, Firefox

## 📝 Game Controls

### Desktop
- **Move**: Arrow keys or A/D
- **Fire**: Spacebar or Mouse click
- **Pause**: ESC

### Mobile
- **Move**: Drag finger across screen
- **Fire**: Tap anywhere
- **Menus**: Tap to navigate

## 🏆 Performance Ratings

- **0-500**: Cloud Rookie
- **501-1500**: Cloud Defender
- **1501-3000**: Cloud Guardian
- **3001+**: Gold Standard Hero

## 📄 License

Created for Cenitex CONNECT demonstration event.

---

**Built with GitHub Actions & HashiCorp Packer**  
Showcasing Cenitex Gold Standard SOEs across AWS, Azure, OCI, and VMware
