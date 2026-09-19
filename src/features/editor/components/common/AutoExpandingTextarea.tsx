"use client";

import React, { useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { AutoExpandingTextareaProps } from "../../types";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function AutoExpandingTextarea({
  value,
  onFocus,
  onClick,
  onChange,
  style,
  className,
  placeholder,
}: AutoExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Reset height to auto first to let scrollHeight accurately represent contents
    el.style.height = "auto";
    const newHeight = Math.max(16, el.scrollHeight);
    el.style.height = `${newHeight}px`;
  }, []);

  useIsomorphicLayoutEffect(() => {
    resize();
  }, [value, style?.fontSize, style?.fontFamily, style?.fontWeight, style?.textAlign, resize]);

  useEffect(() => {
    resize();

    // Re-calculate when web fonts finish downloading
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        resize();
      });
    }

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resize]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onFocus={onFocus}
      onClick={onClick}
      onInput={() => {
        resize();
      }}
      onChange={(e) => {
        onChange(e);
        resize();
      }}
      rows={1}
      style={{
        lineHeight: 1.25,
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
      className={className}
      placeholder={placeholder}
    />
  );
}
