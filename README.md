# Arch Web Desktop

A modern web-based desktop environment that recreates the Arch Linux desktop experience in your browser. Built with SvelteKit and featuring a complete window management system, applications, and desktop utilities.

![Arch Web Desktop](https://img.shields.io/badge/Framework-SvelteKit-FF3E00?style=for-the-badge&logo=svelte)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)

## ✨ Features

### 🖥️ Desktop Environment

- **Complete Window Management**: Draggable, resizable windows with proper z-index handling
- **Modern Dock**: macOS-style dock with application launcher and running application indicators
- **Top Bar**: System status, time, and quick access to applications
- **Theme System**: Light/Dark/Auto themes with system preference detection
- **Wallpaper Support**: Multiple wallpaper options including custom backgrounds

### 📱 Built-in Applications

- **📁 File Explorer**: Browse and manage files and folders
- **📝 Text Editor**: Create and edit documents with syntax highlighting
- **💻 Terminal**: Command-line interface simulation
- **🧮 Calculator**: Full-featured calculator application
- **🖼️ Image Viewer**: View and manage images and photos
- **📊 System Monitor**: Monitor system performance and resources
- **⚙️ Settings**: Configure desktop preferences and system options
- **🌐 Web Browser**: Browse the web with a built-in browser
- **🎵 Music Player**: Play and manage your music collection

### 🔍 Advanced Search

- **Intelligent App Search**: Fuzzy search with scoring algorithm
- **Keyword Matching**: Search by app name, category, or description
- **Real-time Results**: Debounced search with performance metrics
- **Search Suggestions**: Quick access to popular applications
- **Keyboard Shortcuts**: Full keyboard navigation support

### 🎨 Customization

- **Multiple Themes**: Light, Dark, and Auto (system preference)
- **Wallpaper Gallery**: Various wallpaper options including gradients
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Fluid transitions and hover effects
- **Glassmorphism UI**: Modern backdrop blur effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ifsvivek/Arch-Web.git
   cd Arch-Web
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the desktop environment.

### Building for Production

```bash
npm run build
```

The built application will be in the `build/` directory, ready for deployment.

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Dock.svelte      # Application dock with search
│   ├── TopBar.svelte    # System top bar
│   └── Window.svelte    # Window management component
├── lib/
│   └── stores/          # Application state management
│       └── desktop.svelte.js  # Desktop state store
├── routes/
│   └── +page.svelte     # Main desktop page
└── apps/                # Built-in applications
    ├── FileExplorer/
    ├── TextEditor/
    ├── Terminal/
    ├── Calculator/
    ├── ImageViewer/
    ├── SystemMonitor/
    ├── Settings/
    ├── WebBrowser/
    └── MusicPlayer/
```

## 🛠️ Technology Stack

- **Frontend Framework**: SvelteKit (Svelte 5 with Runes)
- **Styling**: TailwindCSS
- **State Management**: Svelte 5 Runes (`$state`, `$derived`)
- **Build Tool**: Vite
- **Language**: JavaScript

## 🎯 Key Features Explained

### Window Management

- **Draggable Windows**: Click and drag title bars to move windows
- **Resizable**: Drag window edges and corners to resize
- **Z-Index Management**: Click to bring windows to front
- **Minimum Size Constraints**: Prevents windows from becoming too small

### Dock Features

- **Application Launcher**: Click dock icons to launch applications
- **Running App Indicators**: Visual indicators for open applications
- **Search Integration**: Comprehensive search with fuzzy matching
- **Tooltips**: Hover information for all dock items
- **Smooth Animations**: Scale and translate effects on hover

### Search System

- **Multi-term Search**: Search with multiple keywords
- **Scoring Algorithm**: Intelligent relevance scoring
- **Fuzzy Matching**: Handles typos and partial matches
- **Performance Optimized**: Debounced input with timing metrics
- **Keyboard Navigation**: Arrow keys and Enter support

### Theme System

- **Auto Theme**: Respects system dark/light preference
- **Manual Override**: Choose specific light or dark themes
- **Persistent Settings**: Saves preferences to localStorage
- **Smooth Transitions**: Animated theme switching

## 🎨 Customization

### Adding New Applications

1. Create a new component in `src/apps/`
2. Add the application to the `apps` array in `Dock.svelte`
3. Include appropriate icons and metadata

### Custom Wallpapers

1. Add wallpaper files to the `static/` directory
2. Update the `wallpapers` object in `desktop.svelte.js`
3. Add wallpaper options to the Settings app

### Styling

The project uses TailwindCSS for styling. Key design patterns:

- **Glassmorphism**: `backdrop-blur-xl bg-white/20`
- **Smooth Transitions**: `transition-all duration-300`
- **Theme-aware Classes**: Dynamic classes based on theme state

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Arch Linux desktop environment
- Built with the amazing SvelteKit framework
- Icons and design inspired by modern desktop environments
- Community feedback and contributions

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the documentation
- Review existing issues for solutions
