import { useEffect } from 'react';

// Preload critical resources
const usePreloadResources = () => {
  useEffect(() => {
    // Preload critical API endpoints
    const criticalEndpoints = [
      'https://placementlog-backend.vercel.app/api/posts',
      'https://placementlog-backend.vercel.app/api/placement-stats'
    ];

    criticalEndpoints.forEach(endpoint => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = endpoint;
      link.crossOrigin = 'anonymous';
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
