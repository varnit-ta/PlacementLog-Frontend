"use client"

import React, { useState, useCallback } from 'react';
import RichTextEditor, { BaseKit } from 'reactjs-tiptap-editor';

import {
  BubbleMenuKatex,
} from 'reactjs-tiptap-editor/bubble-extra';

// Optimized imports - only importing essential extensions for placement posts
import { Blockquote } from 'reactjs-tiptap-editor/blockquote';
import { Bold } from 'reactjs-tiptap-editor/bold';
import { BulletList } from 'reactjs-tiptap-editor/bulletlist';
import { Clear } from 'reactjs-tiptap-editor/clear';
import { Code } from 'reactjs-tiptap-editor/code';
import { Heading } from 'reactjs-tiptap-editor/heading';
import { History } from 'reactjs-tiptap-editor/history';
import { Italic } from 'reactjs-tiptap-editor/italic';
import { Link } from 'reactjs-tiptap-editor/link';
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { SlashCommand } from 'reactjs-tiptap-editor/slashcommand';
import { Strike } from 'reactjs-tiptap-editor/strike';
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline';

import 'reactjs-tiptap-editor/style.css';
import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';
import 'katex/dist/katex.min.css';
import 'easydrawer/styles.css';
import 'react-image-crop/dist/ReactCrop.css';

// Optimized extensions - only essential ones for placement posts
const extensions = [
  BaseKit.configure({
    placeholder: { showOnlyCurrent: true },
    characterCount: { limit: 50000 },
  }),
  History,
  Clear,
  Heading.configure({ spacer: true }),
  Bold,
  Italic,
  TextUnderline,
  Strike,
  BulletList,
  OrderedList,
  Link,
  Blockquote,
  Code.configure({ toolbar: false }),
  SlashCommand,
];

interface EditorProps {
  onContentChange: (content: string) => void;
  value?: string;
}

const Editor: React.FC<EditorProps> = ({ onContentChange, value }) => {
  const [content, setContent] = useState(value || '');

  React.useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value);
    }
  }, [value]);

  const handleChange = useCallback((value: string) => {
    setContent(value);
    onContentChange?.(value);
  }, [onContentChange]);

  return (
    <div>
      <RichTextEditor
        dark={false}
        output="html"
        content={content}
        onChangeContent={handleChange}
        extensions={extensions}
        bubbleMenu={{
          render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
            return (
              <>
                {bubbleDefaultDom}
                {extensionsNames.includes('katex') && (
                  <BubbleMenuKatex editor={editor} disabled={disabled} />
                )}
              </>
            );
          },
        }}
      />
    </div>
  );
};

export default Editor;
