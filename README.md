# 🚀 Agent Academy - AI Agent Training Platform

A cutting-edge platform for training, managing, and evolving AI agents with advanced features including real-time collaboration, skill transfer, and MCP (Model Context Protocol) integration.

## ✨ Features

### 🤖 Agent Management
- **7 Specialized AI Agents**: Each with unique capabilities and personalities
- **Real-time Agent Interactions**: Live communication and collaboration between agents
- **Skill Transfer System**: Agents can learn from and teach each other
- **Performance Analytics**: Comprehensive tracking and improvement metrics

### 🔐 Authentication System
- **Guest Mode**: Full functionality without registration barriers
- **Optional Registration**: Strategic prompts for enhanced features
- **User Profiles**: Personalized dashboards and preference management
- **Data Sync**: Cross-device synchronization for registered users

### 🎯 MCP Integration
- **MCP Marketplace**: Browse and deploy Model Context Protocol servers
- **Custom MCP Creation**: Build and enhance your own MCP servers
- **Evolution Tracking**: Monitor MCP development and improvements
- **Performance Optimization**: Real-time metrics and optimization suggestions

### 🎨 Modern UI/UX
- **Dark Theme**: Futuristic design with neon accents and geometric patterns
- **Responsive Design**: Optimized for all devices and screen sizes
- **Interactive Animations**: Smooth transitions and engaging user experience
- **Portal-based Modals**: Advanced z-index management for perfect layering

## 🏗️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Components
- **Backend**: Supabase (Database, Auth, Real-time, Storage)
- **State Management**: React Context + Custom Hooks
- **Animations**: Framer Motion
- **Build Tool**: Vite with hot module replacement

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agent-academy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 📦 Build & Deploy

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Deploy to your hosting platform
# Built files will be in the `dist/` directory
```

## 🏆 Competition Ready

This platform was designed for hackathon competition with:
- **Zero friction user onboarding** (Guest Mode)
- **Advanced technical architecture** (Portal components, hybrid auth)
- **Product strategy demonstration** (Freemium model readiness)
- **Professional polish** (Production-ready UI/UX)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AgentCard.tsx   # Individual agent display
│   ├── Dashboard.tsx   # Main dashboard
│   ├── MCPMarketplace.tsx # MCP marketplace
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configuration
│   ├── supabase.ts    # Supabase client
│   └── utils.ts       # Helper functions
└── ...
```

## 🤝 Contributing

This is a hackathon project, but contributions and suggestions are welcome!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for AI Agent innovation and hackathon excellence**
