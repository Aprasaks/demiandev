// src/components/PostViewer.jsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit      from "@tiptap/starter-kit";
import CodeBlockLowlight  from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight }  from "lowlight";
import ImageUploadNode     from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";  // ← 추가
import Image               from "@tiptap/extension-image";                                              // ← 추가
import LinkExtension       from "@/components/tiptap-extension/link-extension";
import TaskList            from "@tiptap/extension-task-list";
import TaskItem            from "@tiptap/extension-task-item";
import TextAlign           from "@tiptap/extension-text-align";
import Typography          from "@tiptap/extension-typography";
import Highlight           from "@tiptap/extension-highlight";
import Underline           from "@tiptap/extension-underline";
import Superscript         from "@tiptap/extension-superscript";
import Subscript           from "@tiptap/extension-subscript";
import Selection           from "@/components/tiptap-extension/selection-extension";
import TrailingNode        from "@/components/tiptap-extension/trailing-node-extension";

import "highlight.js/styles/github-dark.css";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";

const lowlight = createLowlight(common);

export default function PostViewer({ content }) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),

      Image,                          // 이 줄을 추가하세요
           LinkExtension.configure({ openOnClick: true }),

      LinkExtension.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading","paragraph"] }),
      Typography,
      Highlight.configure({ multicolor: true }),
      Underline,
      Superscript,
      Subscript,
      Selection,
      TrailingNode,
    ],
    content,
  });

  return (
    <div className="prose mx-auto dark:prose-invert">
      <EditorContent editor={editor} />
    </div>
  );
}