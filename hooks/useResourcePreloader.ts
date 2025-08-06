"use client"

import { useEffect } from 'react';

// Preload critical resources to improve page loading
export const useResourcePreloader = () => {
  useEffect(() => {
    // Preload critical fonts and CSS for faster rendering
    const preloadResources = [
      // Essential CSS that might be loaded dynamically
      '/styles/tiptap.css',
    ];

    preloadResources.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });

    // Prefetch commonly used icons
    const iconUrls = [
      'https://lucide.dev/icons/building-2',
      'https://lucide.dev/icons/briefcase',
      'https://lucide.dev/icons/dollar-sign',
      'https://lucide.dev/icons/graduation-cap',
      'https://lucide.dev/icons/clock',
      'https://lucide.dev/icons/file-text',
    ];

    iconUrls.forEach(url => {
      try {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = url;
        document.head.appendChild(link);
      } catch (error) {
        // Silently fail if icon preloading doesn't work
      }
    });

    // Cleanup function
    return () => {
      // Remove preload links if component unmounts
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach(link => {
        if (preloadResources.some(resource => link.getAttribute('href')?.includes(resource))) {
          link.remove();
        }
      });
    };
  }, []);
};

export default useResourcePreloader;
