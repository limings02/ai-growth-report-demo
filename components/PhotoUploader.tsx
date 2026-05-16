"use client";

import { useRef } from "react";
import { PhotoItem } from "@/lib/types";

type Props = {
  photos: PhotoItem[];
  onAdd: (items: PhotoItem[]) => void;
  onRemove: (id: string) => void;
};

export default function PhotoUploader({ photos, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newItems: PhotoItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    onAdd(newItems);
    // 重置 input，允许重复选同一文件
    e.target.value = "";
  }

  return (
    <section className="rounded-3xl p-6 mb-6"
      style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
      <h3 className="text-base font-bold mb-1" style={{ color: "var(--foreground)" }}>
        📸 上传照片
      </h3>
      <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
        照片仅在本地预览，不会上传服务器
      </p>

      {/* 上传区域 */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-2xl
          border-dashed cursor-pointer transition-colors hover:bg-white"
        style={{ border: "2px dashed var(--primary-light)", background: "transparent" }}
      >
        <span className="text-3xl">📷</span>
        <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>
          点击选择照片
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          支持 JPG、PNG、WEBP，可多选
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 照片预览网格 */}
      {photos.length > 0 && (
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.previewUrl}
                alt="照片预览"
                className="w-full h-full object-cover rounded-xl"
              />
              {/* 删除按钮，hover 时显示 */}
              <button
                type="button"
                onClick={() => onRemove(photo.id)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center
                  text-white text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.55)" }}
                title="删除这张照片"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p className="mt-3 text-xs text-center" style={{ color: "var(--text-muted)" }}>
          已选 {photos.length} 张 · 鼠标悬停可删除
        </p>
      )}
    </section>
  );
}
