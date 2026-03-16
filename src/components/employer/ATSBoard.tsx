"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Application } from "@/store/useApplicationStore";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Star, MoreHorizontal, FileText, Sparkles, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STAGES = [
  { id: "Applied", title: "Yeni", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "Interview", title: "Müsahibə", color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "Offered", title: "Təklif", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "Rejected", title: "İmtina", color: "text-red-500", bg: "bg-red-500/10" },
];

interface BoardProps {
  applications: Application[];
  onStageChange: (id: string, newStage: string) => void;
  onViewResume: (id: string) => void;
  onViewAnalysis: (analysis: any) => void;
}

export function ATSBoard({ applications, onStageChange, onViewResume, onViewAnalysis }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeApp = applications.find((a) => a.id === active.id);
    const overId = over.id as string;

    // Logic to handle dragging between containers is handled in onDragEnd for simplicity 
    // unless we want real-time list reordering within the same column
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeApp = applications.find((a) => a.id === active.id);
    if (!activeApp) return;

    // Determine if we dropped over a column or another card
    let newStage = over.id as string;
    
    // If dropped over a card, get its stage
    const overApp = applications.find((a) => a.id === over.id);
    if (overApp) {
      newStage = overApp.stage;
    }

    // Only update if the stage actually changed
    if (STAGES.map(s => s.id).includes(newStage) && activeApp.stage !== newStage) {
      onStageChange(activeApp.id, newStage);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-350px)] min-h-[500px]">
        {STAGES.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-72 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", stage.color.replace('text-', 'bg-'))} />
                <h3 className="font-black text-sm uppercase tracking-widest text-foreground/80">{stage.title}</h3>
                <Badge variant="secondary" className="rounded-lg font-bold bg-muted text-muted-foreground">
                  {applications.filter((a) => a.stage === stage.id).length}
                </Badge>
              </div>
            </div>

            <SortableContext
              id={stage.id}
              items={applications.filter((a) => a.stage === stage.id).map(a => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <div 
                className={cn(
                  "flex-1 rounded-3xl p-3 border-2 border-dashed transition-colors flex flex-col gap-3 overflow-y-auto",
                  "border-transparent bg-muted/30"
                )}
              >
                {applications
                  .filter((a) => a.stage === stage.id)
                  .map((app) => (
                    <SortableCard 
                      key={app.id} 
                      app={app} 
                      onViewResume={onViewResume}
                      onViewAnalysis={onViewAnalysis}
                    />
                  ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeId ? (
          <div className="w-64">
            <CardContent 
                app={applications.find(a => a.id === activeId)!} 
                isDragging 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SortableCard({ app, onViewResume, onViewAnalysis }: { app: Application, onViewResume: (id: string) => void, onViewAnalysis: (analysis: any) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing outline-none",
        isDragging && "opacity-0"
      )}
    >
      <CardContent 
        app={app} 
        onViewResume={(e) => {
            e.stopPropagation();
            onViewResume(app.id);
        }}
        onViewAnalysis={(e) => {
            e.stopPropagation();
            onViewAnalysis(app.aiAnalysis);
        }}
      />
    </div>
  );
}

function CardContent({ 
    app, 
    isDragging = false,
    onViewResume,
    onViewAnalysis
}: { 
    app: Application; 
    isDragging?: boolean;
    onViewResume?: (e: React.MouseEvent) => void;
    onViewAnalysis?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-4 border border-border dark:border-white/10 shadow-sm transition-all group",
      isDragging ? "rotate-2 scale-105 shadow-2xl border-primary" : "hover:border-primary/50 hover:shadow-md"
    )}>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col min-w-0">
            <h4 className="font-black text-sm text-foreground truncate">{app.name}</h4>
            <p className="text-[10px] text-muted-foreground font-bold truncate opacity-60 uppercase">{app.jobTitle}</p>
          </div>
          {app.matchScore !== undefined && (
            <div 
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                    app.matchScore > 80 ? "bg-emerald-500/10 text-emerald-500" : 
                    app.matchScore > 50 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                )}
                onClick={onViewAnalysis}
            >
              {app.matchScore}%
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                        key={s} 
                        size={10} 
                        className={cn(
                            s <= app.rating ? "text-amber-400 fill-amber-400" : "text-muted/20"
                        )} 
                    />
                ))}
            </div>
            
            <div className="flex gap-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    onClick={onViewResume}
                >
                    <FileText size={14} />
                </Button>
                {app.matchScore !== undefined && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500"
                        onClick={onViewAnalysis}
                    >
                        <Brain size={14} />
                    </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
