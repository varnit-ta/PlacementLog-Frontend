# VIT Placement Log 2026 🎯

[![Repository Views](https://komarev.com/ghpvc/?username=varnit-ta&repo=PlacementLog-Frontend&color=blue&style=flat-square)](https://github.com/varnit-ta/PlacementLog-Frontend)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-placement--log.vercel.app-success?style=flat-square&logo=vercel)](https://placement-log.vercel.app)
[![Backend Repo](https://img.shields.io/badge/Backend-PlacementLog--Backend-blue?style=flat-square&logo=github)](https://github.com/varnit-ta/PlacementLog-Backend)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

A comprehensive placement data tracker for **Vellore Institute of Technology (VIT) 2026 batch**. This Next.js application helps students track placement statistics, share experiences, and analyze placement trends across different companies and branches.

> **📍 Note**: This project was previously built with React and Vite. The React version is available on the [`react-frontend`](https://github.com/varnit-ta/PlacementLog-Frontend/tree/react-frontend) branch. This current version has been migrated to **Next.js 15** for better SEO, performance, and modern features.

## 🌟 Features

### 📊 **Placement Statistics Dashboard**
- **Real-time Analytics**: Live placement data visualization and trends
- **Company-wise Data**: Detailed placement statistics for each recruiting company
- **CTC Analysis**: Comprehensive salary package analysis with min, max, average, and median
- **Branch-wise Insights**: Placement data segmented by engineering branches
- **Interactive Charts**: Beautiful data visualizations using Recharts
- **Export Capabilities**: Download placement data and reports

### 📝 **Experience Sharing Platform**
- **Rich Text Editor**: Advanced TipTap editor for detailed placement experiences
- **Post Management**: Create, edit, and manage placement posts
- **Review System**: Admin moderation for quality content
- **Anonymous Posting**: Option to share experiences anonymously
- **Search & Filter**: Advanced filtering by company, role, CTC, and more
- **User Authentication**: Secure user registration and login

### 🎯 **Key Highlights**
- **🚀 Next.js 15**: Modern React framework with App Router
- **⚡ Performance Optimized**: Server-side rendering, static generation, and optimized bundles
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🔍 SEO Optimized**: Complete SEO implementation with metadata, structured data, and sitemaps
- **🎨 Modern UI**: Clean interface built with Radix UI components
- **🔒 Type Safe**: Full TypeScript implementation
- **📈 Analytics**: Vercel Analytics and Speed Insights integration

## 🚀 Live Demo

Visit the live application: **[VIT Placement Log 2026](https://placement-log.vercel.app)**

## 🛠️ Tech Stack

### Frontend Framework
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible headless UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Rich Text Editing
- **[TipTap](https://tiptap.dev/)** - Headless rich text editor
- **[Mantine TipTap](https://mantine.dev/)** - Additional TipTap components
- **[KaTeX](https://katex.org/)** - Math expression rendering

## 🔧 Installation & Setup

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/varnit-ta/PlacementLog-Frontend.git
   cd PlacementLog-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   ├── admin-auth/               # Admin authentication
│   ├── admin-dashboard/          # Admin dashboard
│   ├── create/                   # Post creation
│   ├── my-posts/                 # User posts management
│   ├── placement-stats/          # Statistics dashboard
│   ├── simple/                   # Simple editor page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Home page
│   └── favicon.ico               # Site favicon
│
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── placement-stats/          # Statistics components
│   │   ├── PlacementStatsPage.tsx
│   │   ├── BranchWiseStatsCard.tsx
│   │   ├── CompanyStatsTable.tsx
│   │   └── ...
│   ├── tiptap-ui/               # TipTap editor components
│   ├── tiptap-node/             # Custom TipTap nodes
│   ├── editor.tsx               # Main rich text editor
│   ├── Navbar.tsx               # Navigation component
│   ├── postcard.tsx             # Post display component
│   ├── MyPosts.tsx              # User posts component
│   └── StructuredData.tsx       # SEO structured data
│
├── context/                      # React Context providers
│   ├── user-context.tsx         # User authentication context
│   ├── posts-context.tsx        # Posts data context
│   └── placements-context.tsx   # Placement data context
│
├── lib/                          # Utility libraries
│   ├── api.ts                    # Main API client
│   ├── placement-api.ts          # Placement-specific API calls
│   ├── utils.ts                  # Helper utilities
│   └── cache.ts                  # Caching utilities
│
├── hooks/                        # Custom React hooks
│   ├── usePerformance.ts         # Performance monitoring
│   └── useResourcePreloader.ts   # Resource preloading
│
├── public/                       # Static assets
│   ├── manifest.json             # PWA manifest
│   ├── robots.txt                # SEO robots file
│   ├── sitemap.xml               # SEO sitemap
│   └── og-image.png              # Social media image
│
├── styles/                       # Styling files
│   └── tiptap.css                # TipTap editor styles
│
├── temp-react-files/             # Legacy React components
│   └── ...                       # (Preserved for reference)
│
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
├── vercel.json                   # Vercel deployment config
└── package.json                  # Dependencies and scripts
```

## 🌐 API Integration

The application integrates with a GoLang backend API

**Backend Repository**: [PlacementLog-Backend](https://github.com/varnit-ta/PlacementLog-Backend)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types
   - Write meaningful commit messages
4. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```
5. **Submit a pull request**

### Contribution Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Components**: Use Radix UI components when possible
- **Styling**: Use Tailwind CSS utility classes
- **Testing**: Ensure your changes don't break existing functionality
- **Documentation**: Update README if needed

## 🔗 Links

- **🌐 Live Application**: [https://placement-log.vercel.app](https://placement-log.vercel.app)
- **🔧 Backend Repository**: [PlacementLog-Backend](https://github.com/varnit-ta/PlacementLog-Backend)
- **📱 React Version**: [react-frontend branch](https://github.com/varnit-ta/PlacementLog-Frontend/tree/react-frontend)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/varnit-ta/PlacementLog-Frontend/issues)
- **💬 Feedback**: [Google Form](https://forms.gle/jSTDJA1XwP

---

<div align="center">

**⭐ If this project helped you, please give it a star! ⭐**

Made with ❤️ for VIT students by VIT students

[🚀 Live Demo](https://placementlog.vercel.app) • [📖 Documentation](https://github.com/varnit-ta/PlacementLog-Frontend) • [🐛 Report Bug](https://github.com/varnit-ta/PlacementLog-Frontend/issues)

</div>
