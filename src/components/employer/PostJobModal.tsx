"use client"

import { useState, useEffect } from "react"
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
import { Plus, Image as ImageIcon, X, Upload } from "lucide-react"
import { useRef } from "react"

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
  categoryId: string
  jobType: "full-time" | "part-time" | "contract" | "internship"
  experienceLevel: "junior" | "mid" | "senior" | "lead"
  deadline?: string
  logoFile?: File | null
  logoUrl?: string
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
  categoryId: "",
  experienceLevel: "mid",
  deadline: "",
  logoFile: null,
  logoUrl: ""
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
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const response = await fetch(`${API_BASE}/api/jobs/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

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
    
    // Create FormData for file upload
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'logoFile' && value) {
        formData.append('logo', value as File)
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })
    
    onSuccess?.(form) // Keeping the original onSuccess for compatibility, but the parent should use FormData if possible
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      set("logoFile", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        set("logoUrl", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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

      <DialogContent className="max-w-[560px] w-[calc(100vw-2rem)] sm:w-full p-0 overflow-hidden rounded-xl border border-border dark:border-white/10 bg-background dark:bg-[#0f1423] max-h-[90vh] flex flex-col backdrop-blur-xl shadow-2xl">
        <DialogHeader className="px-5 pt-5 pb-2 shrink-0">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            {initialData?.id ? "Elanı Redaktə Et" : "Yeni İş Elanı"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-2 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Logo Upload */}
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-xl bg-muted/10 group hover:border-primary/40 transition-all relative overflow-hidden">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoChange} 
              className="hidden" 
              accept="image/*" 
            />
            {form.logoUrl ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-lg border-4 border-background group/image">
                <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { set("logoUrl", ""); set("logoFile", null); }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <ImageIcon size={24} />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-bold text-foreground">Şirkət Loqosu</p>
                  <p className="text-[9px] text-muted-foreground">JPG, PNG (Maks. 2MB)</p>
                </div>
              </div>
            )}
          </div>

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
            <SelectField
              label="Şəhər"
              field="city"
              options={[
                { value: "", label: "Şəhər seçin" },
                { value: "Bakı", label: "Bakı" },
                { value: "Gəncə", label: "Gəncə" },
                { value: "Sumqayıt", label: "Sumqayıt" },
                { value: "Lənkəran", label: "Lənkəran" },
                { value: "Şəki", label: "Şəki" },
                { value: "Quba", label: "Quba" },
                { value: "Mingəçevir", label: "Mingəçevir" },
                { value: "Naxçıvan", label: "Naxçıvan" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              label="Kateqoriya"
              field="categoryId"
              options={[
                { value: "", label: "Kateqoriya seçin" },
                ...categories.map(c => ({ value: c.id, label: c.name }))
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

          {/* Deadline */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Son Müraciət Tarixi</label>
            <Input
              type="date"
              value={form.deadline || ""}
              onChange={e => set("deadline", e.target.value)}
              className="h-9 w-full sm:w-1/2 text-sm rounded-md bg-muted/30 border-border focus-visible:ring-ring/30"
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
