// src/components/PostViewer.jsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function PostViewer({ content }) {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit],
    content,
  });

  return <EditorContent editor={editor} />;
}