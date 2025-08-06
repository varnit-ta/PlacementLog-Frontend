"use client";

import { useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Preload critical resources for Next.js
const usePreloadResources = () => {
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    // Preload critical API endpoints that are used immediately
    const criticalEndpoints = [
      `${API_BASE_URL}/posts`
    ];

    criticalEndpoints.forEach(endpoint => {
      // Use Next.js prefetch approach instead of direct DOM manipulation
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
      link.href = new URL(endpoint).origin; // DNS prefetch only needs the origin
      document.head.appendChild(link);
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

    // Service Worker registration for caching (only if it exists)
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Cleanup function to remove added links when component unmounts
    return () => {
      const links = document.querySelectorAll('link[rel="preload"], link[rel="dns-prefetch"]');
      links.forEach(link => {
        if (link.getAttribute('href')?.includes(API_BASE_URL) || 
            dnsPrefetchDomains.includes(link.getAttribute('href') || '')) {
          link.remove();
        }
      });
    };
  }, []);
};

export default usePreloadResources;
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
