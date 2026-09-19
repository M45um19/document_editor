"use client";

import React, { useRef, useEffect } from "react";
import { AutoExpandingTextareaProps } from "../../types";

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

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(14, textareaRef.current.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value, style?.fontSize, style?.fontFamily, style?.fontWeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onFocus={onFocus}
      onClick={onClick}
      onChange={(e) => {
        onChange(e);
        resize();
      }}
      rows={1}
      style={{
        lineHeight: 1.25,
        ...style,
      }}
      className={className}
      placeholder={placeholder}
    />
  );
}
