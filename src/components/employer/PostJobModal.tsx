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
import "react-quill/dist/quill.snow.css"

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-[200px] bg-muted/20 animate-pulse rounded-xl" />
})

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    ['link', 'blockquote', 'code-block'],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    ['formula'],
    ['clean']
  ],
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'check',
  'link', 'blockquote', 'code-block',
  'script', 'formula'
]

export function PostJobModal({ children }: { children?: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={children || (
          <Button className="rounded-2xl gap-2 font-bold h-11 px-6">
            <Plus size={18} />
            İş Elanı Paylaş
          </Button>
        )}
      />
      <DialogContent className="max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Yeni Vakansiya</DialogTitle>
          <DialogDescription>
            İş elanının təfərrüatlarını daxil edin və dərhal paylaşın.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 py-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Başlıq</label>
              <Input 
                placeholder="Məs: Senior React Developer" 
                className="h-11 rounded-xl bg-muted/40 border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">İş Təsviri</label>
              <div className="border border-border rounded-xl overflow-hidden bg-muted/20">
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="İş öhdəlikləri, tələblər və s..."
                  className="bg-transparent"
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium italic">
                Opsional
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={() => setOpen(false)}
            className="w-full h-12 rounded-2xl bg-foreground text-background hover:opacity-90 font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]"
          >
            İş Elanı Paylaş
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
