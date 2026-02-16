import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合併 Tailwind CSS 類別
 * 結合 clsx 和 tailwind-merge 的功能
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
