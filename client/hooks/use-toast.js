"use client";

import { useEffect, useState } from "react";

// Lightweight, dependency-free toast store. `toast()` can be called from
// anywhere (event handlers, async flows); `useToast()` subscribes the UI.
let count = 0;
const listeners = new Set();
let memory = [];

const TOAST_TTL = 4500;

function emit() {
  for (const l of listeners) l(memory);
}

export function toast({ title, description, variant = "default", duration = TOAST_TTL }) {
  const id = ++count;
  memory = [{ id, title, description, variant }, ...memory].slice(0, 4);
  emit();
  if (duration !== Infinity) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

export function dismiss(id) {
  memory = memory.filter((t) => t.id !== id);
  emit();
}

export function useToast() {
  const [toasts, setToasts] = useState(memory);
  useEffect(() => {
    listeners.add(setToasts);
    return () => listeners.delete(setToasts);
  }, []);
  return { toasts, toast, dismiss };
}
