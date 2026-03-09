"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

// Import styles
import "react-quill-new/dist/quill.snow.css"

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-[120px] bg-muted/20 animate-pulse rounded-md" />
})

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }, 'bold', 'italic', 'underline', 'strike',
     { 'list': 'ordered' }, { 'list': 'bullet' }, 'blockquote', 'link', 'clean']
  ],
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'blockquote', 'link'
]

export function PostJobModal({ children }: { children?: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [coverLetter, setCoverLetter] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={children || (
          <button className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95 group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Yeni Elan Əlavə Et
          </button>
        )}
      />
      <DialogContent className="max-w-[420px] w-[calc(100vw-2rem)] sm:w-full p-0 overflow-hidden rounded-xl border border-border bg-background">
        <DialogHeader className="px-5 pt-5 pb-2">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">Müraciət</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            İş elanına müraciət geri alına bilməz və hər elan üçün yalnız bir dəfə edilə bilər.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 pb-2 space-y-3">
          {/* Job Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Vakansiya Başlığı</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Məs: Senior React Developer"
              className="h-9 text-sm rounded-md bg-muted/30 border-border focus-visible:ring-ring/30"
            />
          </div>

          {/* Cover Letter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Müraciət Məktubu</label>
            <div className="border border-border rounded-md overflow-hidden bg-card focus-within:ring-1 focus-within:ring-ring transition-all">
              <ReactQuill
                theme="snow"
                value={coverLetter}
                onChange={setCoverLetter}
                modules={quillModules}
                formats={quillFormats}
                className="bg-transparent"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Opsional</p>
          </div>
        </div>

        <DialogFooter className="px-5 pt-2 pb-5">
          <Button 
            onClick={() => setOpen(false)}
            className="w-full h-10 rounded-md bg-foreground text-background hover:opacity-90 font-semibold text-sm transition-all active:scale-[0.98]"
          >
            Əlavə Et
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

