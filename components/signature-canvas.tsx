"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Eraser, Pen, RotateCcw } from "lucide-react"
import { cn } from "../lib/utils"

interface SignatureCanvasProps {
  onSave: (data: string) => void
  disabled?: boolean
  existingSignature?: string
}

export function SignatureCanvas({ onSave, disabled = false, existingSignature = "" }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(!!existingSignature)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#f9fafb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw border
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Load existing signature if available
    if (existingSignature) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
      img.src = existingSignature
    }
  }, [existingSignature])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    setHasSignature(true)

    // Get canvas position
    const rect = canvas.getBoundingClientRect()

    // Set drawing style
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Start new path
    ctx.beginPath()

    // Move to cursor position
    if (e.type === "mousedown") {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>
      ctx.moveTo(mouseEvent.clientX - rect.left, mouseEvent.clientY - rect.top)
    } else if (e.type === "touchstart") {
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>
      e.preventDefault() // Prevent scrolling
      ctx.moveTo(touchEvent.touches[0].clientX - rect.left, touchEvent.touches[0].clientY - rect.top)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get canvas position
    const rect = canvas.getBoundingClientRect()

    // Draw line to new position
    if (e.type === "mousemove") {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>
      ctx.lineTo(mouseEvent.clientX - rect.left, mouseEvent.clientY - rect.top)
    } else if (e.type === "touchmove") {
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>
      e.preventDefault() // Prevent scrolling
      ctx.lineTo(touchEvent.touches[0].clientX - rect.left, touchEvent.touches[0].clientY - rect.top)
    }

    ctx.stroke()
  }

  const endDrawing = () => {
    setIsDrawing(false)

    if (disabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Save signature data
    const signatureData = canvas.toDataURL("image/png")
    onSave(signatureData)
  }

  const clearCanvas = () => {
    if (disabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#f9fafb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw border
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    setHasSignature(false)
    onSave("")
  }

  return (
    <div className="space-y-2">
      <div className="relative rounded border border-input bg-gray-50">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className={cn("w-full rounded", disabled ? "cursor-not-allowed" : "cursor-crosshair")}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        {disabled && hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-gray-100/50">
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">Signature Saved</span>
          </div>
        )}
        {disabled && !hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">No signature provided</span>
          </div>
        )}
      </div>
      {!disabled && (
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={clearCanvas} disabled={!hasSignature}>
            <RotateCcw className="mr-1 h-4 w-4" /> Clear
          </Button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Pen className="mr-1 h-3 w-3" /> Sign here
            </span>
            <span className="flex items-center">
              <Eraser className="mr-1 h-3 w-3" /> Clear to redo
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

