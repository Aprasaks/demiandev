// src/lib/tiptap-utils.js

import { supabase } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Checks if a mark exists in the editor schema.
 * @param markName - The name of the mark to check.
 * @param editor - The Tiptap editor instance.
 * @returns boolean indicating if the mark exists in the schema.
 */
export const isMarkInSchema = (markName, editor) => {
  if (!editor?.schema) return false;
  return editor.schema.spec.marks.get(markName) !== undefined;
};

/**
 * Checks if a node exists in the editor schema.
 * @param nodeName - The name of the node to check.
 * @param editor - The Tiptap editor instance.
 * @returns boolean indicating if the node exists in the schema.
 */
export const isNodeInSchema = (nodeName, editor) => {
  if (!editor?.schema) return false;
  return editor.schema.spec.nodes.get(nodeName) !== undefined;
};

/**
 * Gets the active attributes of a specific mark in the current editor selection.
 * @param editor - The Tiptap editor instance.
 * @param markName - The name of the mark to look for (e.g., "highlight", "link").
 * @returns The attributes object of the active mark or null if not active.
 */
export function getActiveMarkAttrs(editor, markName) {
  if (!editor) return null;
  const { state } = editor;
  const marks = state.storedMarks || state.selection.$from.marks();
  const mark = marks.find((m) => m.type.name === markName);
  return mark?.attrs ?? null;
}

/**
 * Checks if a node is empty (no child content).
 * @param node - A ProseMirror Node.
 * @returns boolean
 */
export function isEmptyNode(node) {
  return !!node && node.content.size === 0;
}

/**
 * Utility function to conditionally join class names into a single string.
 * Filters out falsey values.
 * @param classes - List of class name strings or falsey values.
 * @returns A single space-separated string of valid class names.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Finds the position and instance of a node in the document.
 * @param props.editor - The Tiptap editor instance.
 * @param props.node - The node to find (optional if nodePos is provided).
 * @param props.nodePos - The position of the node to find (optional if node is provided).
 * @returns { pos, node } or null if not found.
 */
export function findNodePosition({ editor, node, nodePos }) {
  if (!editor || !editor.state?.doc) return null;

  if (nodePos !== undefined && nodePos !== null) {
    const at = editor.state.doc.nodeAt(nodePos);
    if (at) return { pos: nodePos, node: at };
    return null;
  }

  let found = null;
  editor.state.doc.descendants((currentNode, pos) => {
    if (currentNode === node) {
      found = { pos, node: currentNode };
      return false; // stop descending
    }
    return true;
  });
  return found;
}

/**
 * Handles image upload via Supabase Storage.
 * - 업로드 진행률을 콜백(onProgress)으로 전달
 * - 취소 signal 지원
 * @param file - The File object to upload.
 * @param onProgress - Optional callback({ progress }) for upload percentage.
 * @param abortSignal - Optional AbortSignal to cancel upload.
 * @returns Promise<string> resolving to the public URL of the uploaded image.
 */
export const handleImageUpload = async (file, onProgress, abortSignal) => {
  if (!file) {
    throw new Error("No file provided");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum (${MAX_FILE_SIZE/(1024*1024)}MB)`);
  }

  // 1) 고유한 파일명 생성
  const ext     = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${ext}`;

  // 2) Supabase Storage에 업로드
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from("post-images") // 버킷 이름 (대시보드와 맞춰 주세요)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      progress: (p) => {
        onProgress?.({ progress: Math.round(p * 100) });
      }
    });

  if (uploadError) {
    throw uploadError;
  }

  // 3) 퍼블릭 URL 요청
  const { publicUrl, error: urlError } = supabase
    .storage
    .from("post-images")
    .getPublicUrl(uploadData.path);

  if (urlError) {
    throw urlError;
  }
  return publicUrl;
};

/**
 * (선택) File을 Base64로 변환
 * @param file - File object
 * @param abortSignal - Optional AbortSignal
 * @returns Promise<string> base64
 */
export const convertFileToBase64 = (file, abortSignal) => {
  if (!file) return Promise.reject(new Error("No file provided"));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const onAbort = () => {
      reader.abort();
      reject(new Error("Upload cancelled"));
    };
    abortSignal?.addEventListener("abort", onAbort);

    reader.onloadend = () => {
      abortSignal?.removeEventListener("abort", onAbort);
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to convert file"));
    };
    reader.onerror = (err) => reject(new Error(`File read error: ${err}`));
    reader.readAsDataURL(file);
  });
};