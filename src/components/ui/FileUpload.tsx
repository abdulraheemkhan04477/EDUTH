import { useRef, useState, useCallback } from 'react'
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react'

export interface FileUploadProps {
  accept?: string
  maxSizeMB?: number
  onFileSelect: (file: File) => void
  onRemove?: () => void
  className?: string
}

export function FileUpload({
  accept,
  maxSizeMB = 10,
  onFileSelect,
  onRemove,
  className = '',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (f: File) => {
      setError(null)
      if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be under ${maxSizeMB}MB`)
        return
      }
      setFile(f)
      onFileSelect(f)
    },
    [maxSizeMB, onFileSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const handleRemove = () => {
    setFile(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
    onRemove?.()
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (file) {
    return (
      <div className={`border border-border rounded-[var(--radius-btn)] p-3 flex items-center gap-3 ${className}`}>
        <div className="bg-brand-100 p-2 rounded">
          <File className="h-5 w-5 text-brand-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
          <p className="text-xs text-ink-400">{formatSize(file.size)}</p>
        </div>
        <CheckCircle className="h-5 w-5 text-success-600 shrink-0" />
        <button
          onClick={handleRemove}
          className="p-1 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 cursor-pointer"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-[var(--radius-card)] p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-brand-600 bg-brand-100/50' : 'border-border hover:border-brand-500 hover:bg-canvas'
        }`}
      >
        <Upload className="h-8 w-8 text-ink-400 mx-auto mb-2" />
        <p className="text-sm text-ink-600">
          <span className="font-medium text-brand-600">Click to upload</span> or drag and drop
        </p>
        {accept && <p className="text-xs text-ink-400 mt-1">{accept}</p>}
        <p className="text-xs text-ink-400 mt-1">Max size: {maxSizeMB}MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
      {error && (
        <div className="flex items-center gap-1 mt-2 text-xs text-danger-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}
    </div>
  )
}
