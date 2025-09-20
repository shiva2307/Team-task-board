"use client";

import { cn } from "@team-task-board/ui";

interface FormMessageProps {
  message?: string;
  variant?: "error" | "success";
  className?: string;
}

export function FormMessage({ message, variant = "error", className }: FormMessageProps) {
  if (!message) return null;

  const variantClass =
    variant === "error"
      ? "text-sm font-medium text-rose-400"
      : "text-sm font-medium text-emerald-400";

  return <p className={cn(variantClass, className)}>{message}</p>;
}
