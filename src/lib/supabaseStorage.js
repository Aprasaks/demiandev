// src/lib/supabaseStorage.js
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 }      from "uuid";   // npm install uuid

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BUCKET = "demiandev";
const FOLDER = "images";

/**
 * Supabase Storage 에 파일 업로드하고, public URL 리턴
 * @param {File} file          업로드할 파일
 * @param {function} onProgress 진행 콜백 ({ progress: number })
 * @param {AbortSignal} signal 취소 신호
 * @returns {Promise<string>}  퍼블릭 URL
 */
export async function uploadImageToStorage(file, onProgress, signal) {
  // 1) 확장자만 뽑아서
  const ext = file.name.split(".").pop();
  // 2) UUID + 확장자로 새 파일명 생성 (한글·공백 걱정 제로)
  const fileName = `${uuidv4()}.${ext}`;
  // 3) 전체 경로: images/uuid.ext
  const path = `${FOLDER}/${fileName}`;

  // 4) 실제 업로드
  const { data: up, error: upErr } = await supabase
    .storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      signal,
      onUploadProgress: (evt) => {
        onProgress?.({ progress: Math.round((evt.loaded / evt.total) * 100) });
      },
    });
  if (upErr) {
    throw new Error(upErr.message);
  }

  // 5) 퍼블릭 URL 얻기
  const { data: urlData, error: urlErr } = supabase
    .storage
    .from(BUCKET)
    .getPublicUrl(up.path);
  if (urlErr) {
    throw new Error(urlErr.message);
  }

  return urlData.publicUrl;
}