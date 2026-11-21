"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { XIcon } from "@/components/icons";

export type CropMode = "avatar" | "banner";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  mode: CropMode;
  onClose: () => void;
  onApply: (croppedFile: File, previewUrl: string) => void;
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  mode,
  onClose,
  onApply,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const [boxSize, setBoxSize] = useState({ width: 280, height: 280 });
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropBoxRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const updateBoxSize = useCallback(() => {
    if (cropBoxRef.current) {
      const rect = cropBoxRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setBoxSize({ width: rect.width, height: rect.height });
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateBoxSize();
    window.addEventListener("resize", updateBoxSize);
    return () => window.removeEventListener("resize", updateBoxSize);
  }, [isOpen, updateBoxSize]);

  const baseScale = Math.max(
    boxSize.width / Math.max(1, naturalSize.width),
    boxSize.height / Math.max(1, naturalSize.height)
  );

  const renderedW = naturalSize.width * baseScale * zoom;
  const renderedH = naturalSize.height * baseScale * zoom;

  const clampOffset = useCallback(
    (x: number, y: number, currentZoom: number) => {
      const w = naturalSize.width * baseScale * currentZoom;
      const h = naturalSize.height * baseScale * currentZoom;
      const maxX = Math.max(0, (w - boxSize.width) / 2);
      const maxY = Math.max(0, (h - boxSize.height) / 2);

      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      };
    },
    [naturalSize.width, naturalSize.height, baseScale, boxSize.width, boxSize.height]
  );

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({
      width: img.naturalWidth || 1,
      height: img.naturalHeight || 1,
    });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    updateBoxSize();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffset(
      clampOffset(
        dragStartRef.current.offsetX + dx,
        dragStartRef.current.offsetY + dy,
        zoom
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(false);
    }
  };

  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.min(3, Math.max(1, newZoom));
    setZoom(clampedZoom);
    setOffset((prev) => clampOffset(prev.x, prev.y, clampedZoom));
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    handleZoomChange(zoom + delta);
  };

  const handleApplyCrop = () => {
    if (!imgRef.current || isProcessing) return;

    setIsProcessing(true);

    const outputWidth = mode === "avatar" ? 400 : 1200;
    const outputHeight = 400;

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const totalScale = baseScale * zoom;
    const cropLeftInRendered = (renderedW - boxSize.width) / 2 - offset.x;
    const cropTopInRendered = (renderedH - boxSize.height) / 2 - offset.y;

    const sx = cropLeftInRendered / totalScale;
    const sy = cropTopInRendered / totalScale;
    const sWidth = boxSize.width / totalScale;
    const sHeight = boxSize.height / totalScale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      imgRef.current,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      outputWidth,
      outputHeight
    );

    canvas.toBlob(
      (blob) => {
        setIsProcessing(false);
        if (!blob) return;

        const fileName =
          mode === "avatar"
            ? `avatar-${Date.now()}.webp`
            : `banner-${Date.now()}.webp`;
        const croppedFile = new File([blob], fileName, {
          type: "image/webp",
        });
        const previewUrl = URL.createObjectURL(blob);
        onApply(croppedFile, previewUrl);
      },
      "image/webp",
      0.9
    );
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "avatar" ? "Crop profile photo" : "Crop banner"}
        className="relative z-10 w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <header className="px-4 py-3 sm:px-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Cancel crop"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {mode === "avatar" ? "Edit profile photo" : "Edit header banner"}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="px-5 py-1.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            {isProcessing ? "Applying…" : "Apply"}
          </button>
        </header>

        {/* Cropper Stage */}
        <div className="bg-black/90 p-6 sm:p-8 flex flex-col items-center justify-center select-none">
          <div
            ref={cropBoxRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className={`relative overflow-hidden border-2 border-primary shadow-2xl touch-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            } ${
              mode === "avatar"
                ? "w-64 h-64 sm:w-72 sm:h-72 rounded-full"
                : "w-full aspect-3/1 rounded-2xl"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={handleImageLoad}
              draggable={false}
              className="pointer-events-none max-w-none absolute left-1/2 top-1/2 select-none"
              style={{
                width: `${renderedW}px`,
                height: `${renderedH}px`,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />

            {/* Subtle Rule-of-Thirds Grid Overlay */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25">
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-white/60" />
              <div className="border-r border-white/60" />
              <div />
            </div>
          </div>

          <p className="mt-3 text-xs text-white/70">
            Drag to reposition ·{" "}
            {mode === "avatar" ? "1:1 (400×400 px)" : "3:1 (1200×400 px)"}
          </p>
        </div>

        {/* Zoom Slider Footer */}
        <div className="px-6 py-4 bg-card border-t border-border flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.02}
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="flex-1 accent-primary cursor-pointer"
            aria-label="Zoom image"
          />
          <span className="text-xs font-semibold text-foreground w-10 text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
