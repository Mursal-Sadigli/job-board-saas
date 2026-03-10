"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
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
  loading: () => <div className="h-[160px] bg-muted/20 animate-pulse rounded-md" />
})

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['blockquote', 'link', 'clean']
  ],
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'blockquote', 'link'
]

export type JobFormData = {
  id?: string
  title: string
  description: string
  isActive: boolean
  isFeatured: boolean
  salary: string
  district: string
  city: string
  locationType: "remote" | "hybrid" | "in-office"
  jobType: "full-time" | "part-time" | "contract" | "internship"
  experienceLevel: "junior" | "mid" | "senior" | "lead"
}

const defaultForm: JobFormData = {
  title: "",
  description: "",
  isActive: true,
  isFeatured: false,
  salary: "",
  district: "",
  city: "",
  locationType: "in-office",
  jobType: "full-time",
  experienceLevel: "mid",
}

export function PostJobModal({ 
  children,
  initialData,
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: { 
  children?: React.ReactElement;
  initialData?: JobFormData;
  onSuccess?: (data: JobFormData) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [form, setForm] = useState<JobFormData>(initialData || defaultForm)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled
    ? (val: boolean) => controlledOnOpenChange?.(val)
    : setInternalOpen

  const handleOpen = (val: boolean) => {
    if (val) {
      setForm(initialData || defaultForm)
    }
    setOpen(val)
  }

  const set = <K extends keyof JobFormData>(key: K, value: JobFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!form.title.trim()) return
    setOpen(false)
    onSuccess?.({ ...form, id: form.id || crypto.randomUUID() })
  }

  const SelectField = ({ label, field, options }: { 
    label: string; 
    field: keyof JobFormData;
    options: { value: string; label: string }[];
  }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <select
        className="w-full h-9 rounded-md border border-input bg-muted/30 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
        value={form[field] as string}
        onChange={e => set(field, e.target.value as never)}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-card text-foreground">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      {!isControlled && (
        <DialogTrigger
          render={children || (
            <button className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95 group">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Yeni Elan Əlavə Et
            </button>
          )}
        />
      )}

      <DialogContent className="max-w-[560px] w-[calc(100vw-2rem)] sm:w-full p-0 overflow-hidden rounded-xl border border-border bg-background max-h-[90vh] flex flex-col">
        <DialogHeader className="px-5 pt-5 pb-2 shrink-0">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            {initialData?.id ? "Elanı Redaktə Et" : "Yeni İş Elanı"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-2 space-y-4 overflow-y-auto flex-1">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Vakansiya Başlığı <span className="text-red-500">*</span></label>
            <Input
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="Məs: Senior React Developer"
              className="h-9 text-sm rounded-md bg-muted/30 border-border focus-visible:ring-ring/30"
            />
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-2.5">
            <div>
              <p className="text-sm font-semibold text-foreground">Aktiv Status</p>
              <p className="text-xs text-muted-foreground">Elan yayımlanacaq</p>
            </div>
            <button
              type="button"
              onClick={() => set("isActive", !form.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                form.isActive ? "bg-emerald-500" : "bg-muted-foreground/30"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                form.isActive ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>

          {/* Salary */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Maaş</label>
            <Input
              value={form.salary}
              onChange={e => set("salary", e.target.value)}
              placeholder="Məs: 1500-2000 AZN"
              className="h-9 text-sm rounded-md bg-muted/30 border-border focus-visible:ring-ring/30"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Rayon</label>
              <Input
                value={form.district}
                onChange={e => set("district", e.target.value)}
                placeholder="Məs: Nəsimi"
                className="h-9 text-sm rounded-md bg-muted/30 border-border focus-visible:ring-ring/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Şəhər</label>
              <Input
                value={form.city}
                onChange={e => set("city", e.target.value)}
                placeholder="Məs: Bakı"
                className="h-9 text-sm rounded-md bg-muted/30 border-border focus-visible:ring-ring/30"
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectField
              label="İş Rejimi"
              field="locationType"
              options={[
                { value: "in-office", label: "Ofisdə" },
                { value: "hybrid", label: "Hibrid" },
                { value: "remote", label: "Uzaqdan" },
              ]}
            />
            <SelectField
              label="İş Növü"
              field="jobType"
              options={[
                { value: "full-time", label: "Tam İş Günü" },
                { value: "part-time", label: "Yarımştat" },
                { value: "contract", label: "Müqavilə" },
                { value: "internship", label: "Təcrübəçi" },
              ]}
            />
            <SelectField
              label="Təcrübə"
              field="experienceLevel"
              options={[
                { value: "junior", label: "Junior" },
                { value: "mid", label: "Mid Level" },
                { value: "senior", label: "Senior" },
                { value: "lead", label: "Lead" },
              ]}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Vakansiya Təsviri</label>
            <div className="border border-border rounded-md overflow-hidden bg-card focus-within:ring-1 focus-within:ring-ring transition-all">
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={val => set("description", val)}
                modules={quillModules}
                formats={quillFormats}
                className="bg-transparent"
                placeholder="Vakansiya haqqında ətraflı məlumat daxil edin..."
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 pt-2 pb-5 shrink-0 gap-2">
          <Button 
            variant="outline" 
            className="h-10 rounded-md"
            onClick={() => setOpen(false)}
          >
            Ləğv Et
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!form.title.trim()}
            className="h-10 rounded-md bg-foreground text-background hover:opacity-90 font-semibold text-sm transition-all active:scale-[0.98]"
          >
            {initialData?.id ? "Yadda Saxla" : "Elan Yarat"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
