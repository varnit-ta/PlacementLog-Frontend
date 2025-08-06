"use client"

import React, { Suspense, lazy, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SimpleEditor from './SimpleEditor';
import { Button } from '@/components/ui/button';

// Lazy load the heavy Editor component
const FullEditor = lazy(() => import('./editor'));

interface LazyEditorProps {
  onContentChange: (content: string) => void;
  value?: string;
  useSimpleEditor?: boolean;
}

const EditorSkeleton = () => (
  <div className="border border-gray-200 rounded-lg">
    <div className="border-b border-gray-200 p-2">
      <div className="flex space-x-2">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="w-8 h-8 rounded" />
        ))}
      </div>
    </div>
    <div className="p-4">
      <Skeleton className="w-full h-32" />
    </div>
  </div>
);

const LazyEditor: React.FC<LazyEditorProps> = ({ 
  onContentChange, 
  value, 
  useSimpleEditor: forceSimple = false 
}) => {
  const [useFullEditor, setUseFullEditor] = useState(false);
  const [content, setContent] = useState(value || '');

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
  }, [onContentChange]);

  const switchToFullEditor = useCallback(() => {
    setUseFullEditor(true);
  }, []);

  // If forced to use simple editor or user hasn't requested full editor
  if (forceSimple || !useFullEditor) {
    return (
      <div>
        <SimpleEditor 
          onContentChange={handleContentChange} 
          value={content}
          placeholder="Share your placement experience... Use **bold**, *italic*, - lists, and [links](url)"
        />
        {!forceSimple && (
          <div className="mt-2 text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={switchToFullEditor}
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              Switch to advanced editor
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Load the full editor when requested
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <FullEditor onContentChange={handleContentChange} value={content} />
    </Suspense>
  );
};

export default LazyEditor;