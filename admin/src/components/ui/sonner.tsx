"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      expand={true}
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-start gap-4 p-4 w-full bg-card border border-border text-card-foreground shadow-xl rounded-xl transition-all",
          title: "text-sm font-bold !text-[#191C1D]",
          description: "text-[13px] !text-[#44493B] font-medium mt-1 leading-snug",
          icon: "mt-0.5",
          actionButton:
            "bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-semibold ml-auto",
          cancelButton:
            "bg-muted text-muted-foreground px-3 py-1.5 rounded-md text-xs font-semibold",
          success: "border-l-4 border-l-success",
          error: "border-l-4 border-l-destructive",
          warning: "border-l-4 border-l-warning",
          info: "border-l-4 border-l-info",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
