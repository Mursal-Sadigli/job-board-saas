"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-border text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm outline-none cursor-pointer">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Tema seçin</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 min-w-[120px] shadow-lg">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg">
          <Sun size={14} />
          Açıq
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg">
          <Moon size={14} />
          Tünd
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg">
          <span className="text-sm">💻</span>
          Sistem
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
