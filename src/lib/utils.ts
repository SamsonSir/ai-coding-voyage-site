import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** public/ 资源路径，带上 Vite base，GitHub Pages 子路径才能找到文件 */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/"
  return `${base}${path.replace(/^\/+/, "")}`
}
