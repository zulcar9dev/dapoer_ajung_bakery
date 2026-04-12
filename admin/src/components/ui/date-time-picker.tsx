"use client"

import * as React from "react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { CalendarIcon, Clock, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showTime?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled = false,
  className,
  showTime = true,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [timeValue, setTimeValue] = React.useState(
    value ? format(value, "HH:mm") : "08:00"
  )

  React.useEffect(() => {
    if (value) {
      setTimeValue(format(value, "HH:mm"))
    }
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange(undefined)
      return
    }

    const [hours, minutes] = timeValue.split(":").map(Number)
    selectedDate.setHours(hours, minutes, 0, 0)
    onChange(new Date(selectedDate))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTimeValue(newTime)

    if (value) {
      const [hours, minutes] = newTime.split(":").map(Number)
      const updated = new Date(value)
      updated.setHours(hours, minutes, 0, 0)
      onChange(updated)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            data-empty={!value}
            className={cn(
              "w-full justify-between text-left font-normal h-9 data-[empty=true]:text-muted-foreground",
              className
            )}
          />
        }
      >
        <span className="flex items-center gap-2 truncate">
          <CalendarIcon className="size-4 shrink-0 opacity-70" />
          {value ? (
            showTime
              ? format(value, "dd MMM yyyy, HH:mm", { locale: localeId })
              : format(value, "dd MMM yyyy", { locale: localeId })
          ) : (
            placeholder
          )}
        </span>
        <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="start"
        sideOffset={8}
      >
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            handleDateSelect(date)
            if (!showTime) setOpen(false)
          }}
        />
        {showTime && (
          <div className="border-t border-border px-4 py-3 flex items-center gap-3">
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">Waktu</span>
            <input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="ml-auto bg-transparent text-sm outline-none border border-input rounded-md px-2.5 py-1.5 w-28 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        )}
        {showTime && (
          <div className="border-t border-border px-4 py-2.5 flex items-center justify-between">
            {value && (
              <button
                type="button"
                onClick={() => { onChange(undefined); setOpen(false) }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Hapus tanggal
              </button>
            )}
            <Button
              type="button"
              size="sm"
              className="ml-auto text-xs h-7 px-3"
              onClick={() => setOpen(false)}
            >
              Selesai
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
