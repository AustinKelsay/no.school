/**
 * Markdown renderer component with syntax highlighting and proper styling
 * Uses react-markdown with plugins for GitHub-flavored markdown
 */

'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { ExternalLink, Copy, Check } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * Code block component with copy functionality
 */
function CodeBlock({ inline, className, children, ...props }: CodeBlockProps & React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(String(children))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  if (inline) {
    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground border" {...props}>
        {children}
      </code>
    )
  }
  
  return (
    <div className="relative mb-4">
      <div className="flex items-center justify-between bg-muted border rounded-t-lg px-4 py-2">
        <Badge variant="secondary" className="text-xs">
          {className?.replace('language-', '') || 'code'}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="bg-muted border border-t-0 rounded-b-lg p-4 overflow-x-auto">
        <code className={`font-mono text-sm ${className || ''}`} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}

/**
 * Custom components for markdown rendering
 */
const MarkdownComponents = {
  // Custom heading renderer
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mb-4 mt-8 first:mt-0 text-foreground border-b border-border pb-2" {...props}>
      {children}
    </h1>
  ),
  
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold mb-3 mt-6 text-foreground border-b border-border pb-1" {...props}>
      {children}
    </h2>
  ),
  
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mb-2 mt-5 text-foreground" {...props}>
      {children}
    </h3>
  ),
  
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground" {...props}>
      {children}
    </h4>
  ),
  
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="text-base font-semibold mb-1 mt-3 text-foreground" {...props}>
      {children}
    </h5>
  ),
  
  h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="text-sm font-semibold mb-1 mt-2 text-foreground" {...props}>
      {children}
    </h6>
  ),
  
  // Custom paragraph renderer
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 text-foreground leading-relaxed" {...props}>
      {children}
    </p>
  ),
  
  // Custom code block renderer
  code: CodeBlock,
  
  // Custom list renderers
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-foreground" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-foreground" {...props}>
      {children}
    </ol>
  ),
  
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-foreground leading-relaxed" {...props}>
      {children}
    </li>
  ),
  
  // Custom blockquote renderer
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground bg-muted/50 py-2 rounded-r" {...props}>
      {children}
    </blockquote>
  ),
  
  // Custom table renderers
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse border border-border rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props}>
      {children}
    </tbody>
  ),
  
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-border hover:bg-muted/50" {...props}>
      {children}
    </tr>
  ),
  
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-2 text-foreground" {...props}>
      {children}
    </td>
  ),
  
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-2 text-left font-semibold text-foreground" {...props}>
      {children}
    </th>
  ),
  
  // Custom link renderer
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http')
    
    return (
      <a
        href={href}
        className="text-primary hover:text-primary/80 underline underline-offset-4 inline-flex items-center gap-1"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
        {isExternal && <ExternalLink className="h-3 w-3" />}
      </a>
    )
  },
  
  // Custom image renderer
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <div className="my-4">
      <OptimizedImage
        src={typeof src === 'string' ? src : ''}
        alt={alt || ''}
        width={800}
        height={600}
        className="max-w-full h-auto rounded-lg border border-border"
      />
      {alt && (
        <p className="text-sm text-muted-foreground mt-2 text-center italic">
          {alt}
        </p>
      )}
    </div>
  ),
  
  // Custom horizontal rule
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),
  
  // Custom strong/bold
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  
  // Custom emphasis/italic
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-foreground" {...props}>
      {children}
    </em>
  ),
}

/**
 * Markdown renderer component
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={MarkdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
} 