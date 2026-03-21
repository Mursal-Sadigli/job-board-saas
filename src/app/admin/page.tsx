import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Briefcase, FileText, TrendingUp, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  // Statik məlumatlar (Backend ilə birləşdiriləcək)
  const stats = [
    {
      title: "Cəmi İstifadəçi",
      value: "1,284",
      description: "+12% keçən aydan",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Aktiv İş Elanları",
      value: "452",
      description: "+5% keçən həftədən",
      icon: Briefcase,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
    },
    {
      title: "Cəmi Müraciətlər",
      value: "8,432",
      description: "Son 24 saatda 142",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    },
    {
      title: "Platforma Gəliri",
      value: "₼12,450",
      description: "Hədəfin 85%-i",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Dashboard İcmalı
        </h2>
        <p className="text-muted-foreground">
          Platformanın fəaliyyətinə real vaxt rejimində nəzarət edin.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${stat.bgColor.split(' ')[0]}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Son İstifadəçilər</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Burada son qeydiyyatdan keçənlərin siyahısı olacaq */}
            <div className="text-sm text-muted-foreground italic">
              İstifadəçi siyahısı yüklənir...
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Aktivlik Qrafiki</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[200px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg flex items-center justify-center border border-dashed text-muted-foreground">
                Qrafik tezliklə əlavə olunacaq
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
