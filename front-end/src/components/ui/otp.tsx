"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface OTPInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string
  onChange: (value: string) => void
  length?: number
  separator?: React.ReactNode
  containerClassName?: string
  inputClassName?: string
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
  ({ value, onChange, length = 6, separator, containerClassName, inputClassName, ...props }) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
    const [, setActiveIndex] = React.useState<number>(-1)

    const handleInputChange = (index: number, inputValue: string) => {
      const newValue = value.split("")
      newValue[index] = inputValue
      const newValueString = newValue.join("")
      onChange(newValueString)

      // Auto-focus next input
      if (inputValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
      onChange(pastedData)
      
      // Focus the last filled input or the first empty one
      const lastFilledIndex = Math.min(pastedData.length - 1, length - 1)
      if (lastFilledIndex >= 0) {
        inputRefs.current[lastFilledIndex]?.focus()
      }
    }

    return (
      <div className={cn("flex items-center gap-2", containerClassName)}>
        {Array.from({ length }, (_, index) => (
          <React.Fragment key={index}>
            <input
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(-1)}
              className={cn(
                "h-12 w-12 rounded-xl border-2 border-border/50 bg-background text-center text-2xl font-mono outline-none transition-all focus:border-brand/50 focus:ring-2 focus:ring-brand/20",
                inputClassName
              )}
              {...props}
            />
            {index === Math.floor(length / 2) - 1 && separator}
          </React.Fragment>
        ))}
      </div>
    )
  }
)

OTPInput.displayName = "OTPInput"

export { OTPInput }
