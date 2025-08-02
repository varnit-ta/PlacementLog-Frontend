import { useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Preload critical resources
const usePreloadResources = () => {
  useEffect(() => {
    // Preload critical API endpoints that are used immediately
    const criticalEndpoints = [
      `${API_BASE_URL}/posts`
    ];

    criticalEndpoints.forEach(endpoint => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = endpoint;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // DNS prefetch for placement endpoints (used conditionally, not immediately)
    const prefetchEndpoints = [
      `${API_BASE_URL}/placements`,
      `${API_BASE_URL}/placements/company-branch`,
      `${API_BASE_URL}/placements/branch-company`
    ];

    prefetchEndpoints.forEach(endpoint => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = endpoint;
      document.head.appendChild(link);
    });

    // Preload important fonts if any
    const fontLinks = document.querySelectorAll('link[rel="stylesheet"]') as NodeListOf<HTMLLinkElement>;
    fontLinks.forEach(link => {
      if (link.href.includes('fonts')) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'style';
        preloadLink.href = link.href;
        document.head.appendChild(preloadLink);
      }
    });

    // Add DNS prefetch for external domains
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://placementlog-backend.vercel.app',
      'https://api.github.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Service Worker registration for caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);
};

export default usePreloadResources;
