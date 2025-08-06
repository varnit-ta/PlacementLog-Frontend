"use client"

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Link as LinkIcon } from 'lucide-react';

interface SimpleEditorProps {
  onContentChange: (content: string) => void;
  value?: string;
  placeholder?: string;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({ 
  onContentChange, 
  value = '', 
  placeholder = "Share your experience..." 
}) => {
  const [content, setContent] = useState(value);
  const [isPreview, setIsPreview] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  }, [onContentChange]);

  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    onContentChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [content, onContentChange]);

  const formatBold = () => insertText('**', '**');
  const formatItalic = () => insertText('*', '*');
  const formatList = () => insertText('\n- ', '');
  const formatLink = () => insertText('[', '](url)');

  const renderPreview = () => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatBold}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatItalic}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatList}
          className="h-8 w-8 p-0"
          title="List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatLink}
          className="h-8 w-8 p-0"
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[150px]">
        {isPreview ? (
          <div 
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
          />
        ) : (
          <textarea
            value={content}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full min-h-[150px] p-4 border-0 resize-none focus:outline-none"
            style={{ fontFamily: 'inherit' }}
          />
        )}
      </div>
    </div>
  );
};

export default SimpleEditor;
