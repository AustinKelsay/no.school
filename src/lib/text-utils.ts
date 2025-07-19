/**
 * Utility functions for text formatting and rendering
 */

/**
 * Preserves line breaks in text by applying white-space CSS
 * Use this for displaying text with \n characters as actual line breaks
 */
export function preserveLineBreaks(text: string): { 
  content: string;
  style: React.CSSProperties;
} {
  return {
    content: text,
    style: { whiteSpace: 'pre-line' }
  }
}

/**
 * Alternative approach: split text by line breaks for manual rendering
 * Returns an array of lines that can be mapped to JSX
 */
export function splitTextByLines(text: string): string[] {
  if (!text) return []
  return text.split('\n')
}