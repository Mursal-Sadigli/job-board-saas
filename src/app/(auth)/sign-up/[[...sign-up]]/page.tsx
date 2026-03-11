import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-all text-sm font-bold",
            card: "shadow-xl border border-border rounded-2xl dark:bg-[#1C1F26]",
            headerTitle: "text-foreground font-bold",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "border-border hover:bg-muted transition-colors",
            socialButtonsBlockButtonText: "text-foreground font-medium",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            formFieldLabel: "text-foreground font-medium",
            formFieldInput: "bg-muted/50 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all",
            footerActionText: "text-muted-foreground",
            footerActionLink: "text-primary hover:text-primary/80 transition-colors font-semibold"
          },
        }}
      />
    </div>
  );
}
