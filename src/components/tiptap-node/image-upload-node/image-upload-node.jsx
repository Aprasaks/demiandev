// src/components/tiptap-node/image-upload-node/image-upload-node-extension.jsx
"use client";

import * as React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { CloseIcon } from "@/components/tiptap-icons/close-icon";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";

// Supabase Storage 업로드 함수
import { uploadImageToStorage } from "@/lib/supabaseStorage";

function useFileUpload(options) {
  const [fileItem, setFileItem] = React.useState(null);

  const uploadFile = async (file) => {
    if (file.size > options.maxSize) {
      options.onError?.(
        new Error(`파일 크기가 너무 큽니다 (${options.maxSize / 1024 / 1024}MB).`)
      );
      return null;
    }

    const abortController = new AbortController();
    const newFileItem = {
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "uploading",
      abortController,
    };
    setFileItem(newFileItem);

    try {
      // 실제 업로드 함수 호출
      const url = await options.upload(file, (event) => {
        setFileItem((prev) =>
          prev
            ? { ...prev, progress: event.progress }
            : prev
        );
      }, abortController.signal);

      if (!url) throw new Error("업로드된 URL을 받아오지 못했습니다.");

      if (!abortController.signal.aborted) {
        setFileItem((prev) =>
          prev
            ? { ...prev, status: "success", url, progress: 100 }
            : prev
        );
        options.onSuccess?.(url);
        return url;
      }
      return null;
    } catch (err) {
      if (!abortController.signal.aborted) {
        setFileItem((prev) =>
          prev ? { ...prev, status: "error", progress: 0 } : prev
        );
        options.onError?.(err instanceof Error ? err : new Error("업로드 실패"));
      }
      return null;
    }
  };

  const uploadFiles = async (files) => {
    if (!files?.length) {
      options.onError?.(new Error("업로드할 파일이 없습니다."));
      return null;
    }
    if (options.limit && files.length > options.limit) {
      options.onError?.(
        new Error(`최대 ${options.limit}개까지 업로드할 수 있습니다.`)
      );
      return null;
    }
    return uploadFile(files[0]);
  };

  const clearFileItem = () => {
    if (!fileItem) return;
    fileItem.abortController?.abort();
    URL.revokeObjectURL(fileItem.url);
    setFileItem(null);
  };

  return { fileItem, uploadFiles, clearFileItem };
}

const CloudUploadIcon = () => (
  <svg /* ... 아이콘 생략 ... */ />
);
const FileIcon = () => (
  <svg /* ... 아이콘 생략 ... */ />
);
const FileCornerIcon = () => (
  <svg /* ... 아이콘 생략 ... */ />
);

const ImageUploadDragArea = ({ onFile, children }) => {
  const [dragover, setDragover] = React.useState(false);
  return (
    <div
      className={`tiptap-image-upload-dragger ${
        dragover ? "tiptap-image-upload-dragger-active" : ""
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragover(true) }}
      onDragLeave={(e) => { e.preventDefault(); setDragover(false) }}
      onDrop={(e) => {
        e.preventDefault(); setDragover(false);
        onFile(Array.from(e.dataTransfer.files));
      }}
    >
      {children}
    </div>
  );
};

const ImageUploadPreview = ({ file, progress, status, onRemove }) => (
  <div className="tiptap-image-upload-preview">
    {status === "uploading" && (
      <div
        className="tiptap-image-upload-progress"
        style={{ width: `${progress}%` }}
      />
    )}
    <div className="tiptap-image-upload-preview-content">
      {/* 파일 이름, 사이즈, 제거 버튼 등 */}
      <div className="tiptap-image-upload-file-info">
        <div className="tiptap-image-upload-file-icon"><CloudUploadIcon /></div>
        <div className="tiptap-image-upload-details">
          <span className="tiptap-image-upload-text">{file.name}</span>
          <span className="tiptap-image-upload-subtext">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      </div>
      <div className="tiptap-image-upload-actions">
        {status === "uploading" && <span>{progress}%</span>}
        <button onClick={(e) => { e.stopPropagation(); onRemove() }}>
          <CloseIcon />
        </button>
      </div>
    </div>
  </div>
);

const DropZoneContent = ({ maxSize }) => (
  <>
    <div className="tiptap-image-upload-dropzone">
      <FileIcon />
      <FileCornerIcon />
      <div className="tiptap-image-upload-icon-container">
        <CloudUploadIcon />
      </div>
    </div>
    <div className="tiptap-image-upload-content">
      <span>
        <em>Click to upload</em> or drag and drop
      </span>
      <span>Maximum file size {maxSize / 1024 / 1024} MB</span>
    </div>
  </>
);

export const ImageUploadNode = (props) => {
  const { accept, limit, maxSize } = props.node.attrs;
  const inputRef = React.useRef(null);
  const extension = props.extension;

  // 여기를 실제 Supabase 업로드 함수로 교체!
  const uploadOptions = {
    maxSize,
    limit,
    accept,
    upload: uploadImageToStorage,
    onSuccess: extension.options.onSuccess,
    onError: extension.options.onError,
  };
  const { fileItem, uploadFiles, clearFileItem } = useFileUpload(uploadOptions);

  const handleClick = () => {
    if (inputRef.current && !fileItem) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleUpload = async (files) => {
    const url = await uploadFiles(files);
    if (url) {
      const pos = props.getPos();
      const filename = files[0].name.replace(/\.[^/.]+$/, "");
      props.editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + 1 })
        .insertContentAt(pos, [
          { type: "image", attrs: { src: url, alt: filename, title: filename } },
        ])
        .run();
    }
  };

  return (
    <NodeViewWrapper
      className="tiptap-image-upload"
      tabIndex={0}
      onClick={handleClick}
    >
      {!fileItem ? (
        <ImageUploadDragArea onFile={handleUpload}>
          <DropZoneContent maxSize={maxSize} />
        </ImageUploadDragArea>
      ) : (
        <ImageUploadPreview
          file={fileItem.file}
          progress={fileItem.progress}
          status={fileItem.status}
          onRemove={clearFileItem}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleUpload(Array.from(e.target.files))}
      />
    </NodeViewWrapper>
  );
};