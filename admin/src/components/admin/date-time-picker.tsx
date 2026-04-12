"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
  date?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
}

export function DateTimePicker({ date, onChange, placeholder = "Pilih tanggal & waktu" }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [hours, setHours] = React.useState<string>(date ? format(date, "HH") : "00")
  const [minutes, setMinutes] = React.useState<string>(date ? format(date, "mm") : "00")

  // Update internal state when prop changes
  React.useEffect(() => {
    if (date) {
      setSelectedDate(date)
      setHours(format(date, "HH"))
      setMinutes(format(date, "mm"))
    }
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined)
      onChange?.(undefined)
      return
    }

    const updatedDate = new Date(newDate)
    updatedDate.setHours(parseInt(hours) || 0)
    updatedDate.setMinutes(parseInt(minutes) || 0)
    
    setSelectedDate(updatedDate)
    onChange?.(updatedDate)
  }

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    let val = value.replace(/[^0-9]/g, "").slice(0, 2)
    const intVal = parseInt(val)

    if (type === "hours") {
      if (intVal > 23) val = "23"
      setHours(val)
      if (selectedDate && val) {
        const newDate = new Date(selectedDate)
        newDate.setHours(parseInt(val))
        onChange?.(newDate)
      }
    } else {
      if (intVal > 59) val = "59"
      setMinutes(val)
      if (selectedDate && val) {
        const newDate = new Date(selectedDate)
        newDate.setMinutes(parseInt(val))
        onChange?.(newDate)
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-9 bg-surface border-input",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP HH:mm", { locale: id })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-popover shadow-xl border-border overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          className="bg-popover rounded-t-lg"
        />
        <div className="p-3 border-t border-border flex items-center gap-4 bg-muted/80 rounded-b-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">Waktu</span>
          </div>
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={hours}
              onChange={(e) => handleTimeChange("hours", e.target.value)}
              className="w-12 h-8 text-center px-1"
              placeholder="HH"
            />
            <span className="text-muted-foreground">:</span>
            <Input
              type="text"
              value={minutes}
              onChange={(e) => handleTimeChange("minutes", e.target.value)}
              className="w-12 h-8 text-center px-1"
              placeholder="mm"
            />
          </div>
          <div className="ml-auto">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">24H Format</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
