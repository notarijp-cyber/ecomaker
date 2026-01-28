import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = {}): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'facile':
      return 'bg-primary-light bg-opacity-10 text-primary';
    case 'medio':
      return 'bg-warning bg-opacity-10 text-warning';
    case 'avanzato':
      return 'bg-error bg-opacity-10 text-error';
    default:
      return 'bg-primary-light bg-opacity-10 text-primary';
  }
}

export function getMaterialTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'plastica':
      return 'bg-blue-100 text-blue-600';
    case 'carta':
      return 'bg-green-100 text-green-600';
    case 'vetro':
      return 'bg-cyan-100 text-cyan-600';
    case 'metallo':
      return 'bg-orange-100 text-orange-600';
    case 'legno':
      return 'bg-amber-100 text-amber-600';
    case 'tessile':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Convert base64 to blob for file uploads
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get the day of month and month name from a date
export function getEventDateDisplay(dateString: string): { day: string; month: string } {
  const date = new Date(dateString);
  const day = date.getDate().toString();
  const month = date.toLocaleString('it-IT', { month: 'short' });
  
  return { day, month };
}
