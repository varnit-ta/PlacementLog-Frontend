'use client';

import { useEffect } from 'react';

export function VersionChecker() {
  useEffect(() => {
    async function checkVersion() {
      try {
        // Add a timestamp to prevent caching of the version.json file
        const res = await fetch(`/version.json?t=${Date.now()}`, { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const data = await res.json();
        const currentVersion = localStorage.getItem('app_version');

        // If this is the first visit or version has changed
        if (currentVersion !== data.version) {
          console.log(`Version updated from ${currentVersion} to ${data.version}. Refreshing...`);
          localStorage.setItem('app_version', data.version);
          
          // Force a hard refresh
          window.location.reload();
        } else {
          console.log(`Version ${data.version} is up to date.`);
        }
      } catch (err) {
        console.error('Version check failed:', err);
        // Fallback: If version check fails, set a default version to prevent infinite loops
        if (!localStorage.getItem('app_version')) {
          localStorage.setItem('app_version', '1.0.0');
        }
      }
    }

    // Only run version check in the browser
    if (typeof window !== 'undefined') {
      checkVersion();
    }
  }, []);

  // This component doesn't render anything
  return null;
}
