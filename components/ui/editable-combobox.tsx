"use client"

import * as React from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface EditableComboboxProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  emptyMessage?: string
  className?: string
  contentClassName?: string
}

export function EditableCombobox({
  value,
  onChange,
  options,
  placeholder = "Digite ou selecione",
  emptyMessage = "Nenhuma opção",
  className,
  contentClassName,
}: EditableComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value ?? "")

  React.useEffect(() => {
    setInputValue(value ?? "")
  }, [value])

  const filtered = React.useMemo(() => {
    const term = inputValue.toLowerCase()
    return options.filter((opt) => opt.toLowerCase().includes(term))
  }, [inputValue, options])

  const handleSelect = (current: string) => {
    onChange(current)
    setInputValue(current)
    setOpen(false)
  }

  const handleEnterCustom = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onChange(inputValue)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-[#0A0A0A] border-[#1A1A1A] text-white", className)}
        >
          <span className="truncate text-left">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[var(--radix-popover-trigger-width)] p-0 bg-[#0A0A0A] border-[#1A1A1A]", contentClassName)} align="start" sideOffset={4}>
        <Command shouldFilter={false}>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            placeholder={placeholder}
            onKeyDown={handleEnterCustom}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filtered.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      opt === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
