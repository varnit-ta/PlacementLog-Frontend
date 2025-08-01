# PlacementLog Frontend 🎯

[![Repository Views](https://komarev.com/ghpvc/?username=varnit-ta&repo=PlacementLog-Frontend&color=blue&style=flat-square)](https://github.com/varnit-ta/PlacementLog-Frontend)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-placementlog.vercel.app-success?style=flat-square&logo=vercel)](https://placementlog.vercel.app)
[![Backend Repo](https://img.shields.io/badge/Backend-PlacementLog--Backend-blue?style=flat-square&logo=github)](https://github.com/varnit-ta/PlacementLog-Backend)

A comprehensive platform for tracking and sharing placement experiences, company insights, and career journey management. Built with React, TypeScript, and modern web technologies.

## 🌟 Features

### 📊 **Placement Statistics Dashboard**
- Real-time placement analytics and trends
- Company-wise placement data visualization
- CTC (Cost to Company) statistics and charts
- Branch-wise placement insights
- Interactive data tables and graphs

### 📝 **Experience Sharing**
- Share detailed placement experiences
- Rich text editor for formatting posts
- Company reviews and interview insights
- Search and filter through experiences
- User authentication and personal post management

### 🎯 **Key Highlights**
- **SEO Optimized**: Complete SEO implementation with meta tags, structured data, and sitemap
- **PWA Ready**: Progressive Web App with offline capabilities
- **Responsive Design**: Mobile-first design approach
- **Performance Optimized**: Code splitting, lazy loading, and caching strategies
- **Modern UI**: Clean and intuitive interface built with Tailwind CSS and Radix UI

## 🚀 Live Demo

Visit the live application: **[PlacementLog](https://placementlog.vercel.app)**

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Helmet Async** - SEO meta tag management

### Key Libraries
- **TipTap** - Rich text editor for post creation
- **Recharts** - Data visualization and charts
- **Lucide React** - Modern icon library
- **Sonner** - Toast notifications
- **React Window** - Virtualization for large lists

### Performance & SEO
- **Vite PWA** - Progressive Web App capabilities
- **Service Worker** - Offline caching and performance
- **JSON-LD Structured Data** - Rich search results
- **Open Graph & Twitter Cards** - Social media optimization

## 📱 Pages & Features

### 🏠 **Dashboard (`/`)**
- Browse all placement experiences
- Search by company, role, or user
- Infinite scrolling for large datasets
- Real-time post counts and statistics

### 📊 **Placement Statistics (`/placement-stats`)**
- Comprehensive analytics dashboard
- CTC distribution charts
- Company-wise placement tables
- Branch-wise statistics
- Interactive data visualization

### ✍️ **Create Post (`/create`)**
- Rich text editor with formatting options
- Image upload and embedding
- Form validation and error handling
- Real-time preview

### 👤 **User Management**
- Authentication system (`/auth`)
- Personal post management (`/my-posts`)
- Admin dashboard (`/admin`) for authorized users

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/varnit-ta/PlacementLog-Frontend.git
   cd PlacementLog-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://placementlog-backend.vercel.app
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── placement-stats/# Statistics page components
│   ├── SEO.tsx         # SEO meta tag component
│   └── ...
├── pages/              # Page components
│   ├── dashboard.tsx   # Main dashboard
│   ├── placement-stats.tsx
│   └── ...
├── context/            # React context providers
│   ├── user-context.tsx
│   ├── posts-context.tsx
│   └── placements-context.tsx
├── lib/                # Utility functions and API clients
│   ├── api.ts          # Main API client
│   ├── placement-api.ts # Placement-specific API
│   └── utils.ts        # Helper functions
├── hooks/              # Custom React hooks
└── styles/             # Global styles and CSS
```

## 🌐 API Integration

The frontend integrates with the PlacementLog Backend API:
- **Base URL**: `https://placementlog-backend.vercel.app`
- **Repository**: [PlacementLog-Backend](https://github.com/varnit-ta/PlacementLog-Backend)

### Key API Endpoints
- `GET /api/posts` - Fetch all placement posts
- `POST /api/posts` - Create new placement post
- `GET /api/placement-stats` - Get placement statistics
- `POST /api/auth/login` - User authentication

## 🎨 UI/UX Features

### Design System
- **Consistent Color Palette**: Professional and accessible colors
- **Typography**: Clean and readable font hierarchy
- **Spacing**: Consistent spacing using Tailwind CSS utilities
- **Animations**: Subtle transitions and micro-interactions

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Flexible grid systems
- Touch-friendly interfaces

## 🔍 SEO Implementation

### Technical SEO
- ✅ Meta tags and Open Graph optimization
- ✅ JSON-LD structured data
- ✅ XML sitemap generation
- ✅ Robots.txt configuration
- ✅ Canonical URLs
- ✅ PWA implementation

### Performance SEO
- ✅ Code splitting and lazy loading
- ✅ Image optimization
- ✅ Caching strategies
- ✅ Core Web Vitals optimization

## 📈 Performance Metrics

- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Links

- **Live Application**: [placementlog.vercel.app](https://placementlog.vercel.app)
- **Backend Repository**: [PlacementLog-Backend](https://github.com/varnit-ta/PlacementLog-Backend)
- **Feedback Form**: [Submit Feedback](https://forms.gle/jSTDJA1XwPLYVrvk8)

## 👨‍💻 Author

**Varnit Agarwal**
- GitHub: [@varnit-ta](https://github.com/varnit-ta)

---

⭐ **Star this repository if you find it helpful!**
