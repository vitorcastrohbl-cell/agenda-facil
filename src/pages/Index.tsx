import { useState, useEffect, useMemo } from "react";
import { format, isToday, isTomorrow, parseISO, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  CalendarIcon,
  Clock,
  Send,
  Sparkles,
  UserCog,
  X,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Settings2,
  Plus,
  Palette,
  LayoutGrid,
  Lock,
  Eye,
  AlertCircle,
  Moon,
  Sun,
  TrendingUp,
  DollarSign,
  Image as ImageIcon,
  Instagram,
  Facebook,
  MapPin,
  Check,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { DEFAULT_CONFIG, BusinessConfig, iconMap, IconType } from "@/config";

// ── Types ──────────────────────────────
interface Appointment {
  id: string;
  nome: string;
  servico: string;
  data: string;
  horario: string;
  observacao?: string;
  criadoEm: string;
}

// ── Constants ──────────────────────────
const APPTS_KEY = "agendafacil_appointments";
const CONFIG_KEY = "agendafacil_business_config";

function generateTimeSlots(opening: string, closing: string, duration: number): string[] {
  const slots: string[] = [];
  let current = new Date(`2000-01-01T${opening}:00`);
  const end = new Date(`2000-01-01T${closing}:00`);

  while (current < end) {
    slots.push(format(current, "HH:mm"));
    current = new Date(current.getTime() + duration * 60000);
  }
  return slots;
}

const iconsList: IconType[] = Object.keys(iconMap) as IconType[];

// ── Helpers ────────────────────────────
function getAppointments(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem(APPTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAppointments(list: Appointment[]) {
  localStorage.setItem(APPTS_KEY, JSON.stringify(list));
}

function getStoredConfig(): BusinessConfig {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    // Merge with DEFAULT_CONFIG to ensure new fields are present
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

function saveStoredConfig(conf: BusinessConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(conf));
}

function dayLabel(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return "Hoje";
  if (isTomorrow(d)) return "Amanhã";
  return format(d, "EEEE, dd 'de' MMMM", { locale: ptBR });
}

// ── Component ──────────────────────────
const Index = () => {
  // Config state
  const [config, setConfig] = useState<BusinessConfig>(DEFAULT_CONFIG);
  
  // Booking form state
  const [date, setDate] = useState<Date>();
  const [horario, setHorario] = useState("");
  const [servico, setServico] = useState("");
  const [nome, setNome] = useState("");
  const [observacao, setObservacao] = useState("");
  const { theme, setTheme } = useTheme();

  // Admin state
  const [adminOpen, setAdminOpen] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'none' | 'appt' | 'full'>('none');
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Load config & initial appts
  useEffect(() => {
    setConfig(getStoredConfig());
    setAppointments(getAppointments()); // Always load to check busyness
  }, []);

  useEffect(() => {
    if (accessLevel !== 'none') setAppointments(getAppointments());
  }, [accessLevel]);

  const BusinessIcon = iconMap[config.icon] || Sparkles;

  // ── Calculate occupied slots for the selected date ──
  const occupiedSlots = useMemo(() => {
    if (!date) return [];
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments
      .filter((a) => a.data === dateStr)
      .map((a) => a.horario);
  }, [date, appointments]);

  const horariosFixos = useMemo(() => {
    return generateTimeSlots(config.openingTime, config.closingTime, config.slotDuration);
  }, [config.openingTime, config.closingTime, config.slotDuration]);

  // ── Booking submit ───────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !horario || !servico || !nome.trim()) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setIsSummaryOpen(true);
  };

  const confirmAndRedirect = () => {
    if (!date || !horario || !servico || !nome) return;

    const dateStr = format(date, "yyyy-MM-dd");
    
    // Final safety check: Is this time still free?
    const currentAppts = getAppointments();
    const isOccupied = currentAppts.some(a => a.data === dateStr && a.horario === horario);
    
    if (isOccupied) {
      toast({ 
        title: "Horário Indisponível", 
        description: "Alguém acabou de reservar esse horário. Por favor, escolha outro.",
        variant: "destructive" 
      });
      setAppointments(currentAppts); // Update view
      setHorario(""); // Clear selection
      setIsSummaryOpen(false);
      return;
    }

    const newAppt: Appointment = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      servico,
      data: dateStr,
      horario,
      observacao: observacao.trim() || undefined,
      criadoEm: new Date().toISOString(),
    };
    
    const updated = [...currentAppts, newAppt];
    saveAppointments(updated);
    setAppointments(updated); // Sync state

    const dataFormatada = format(date, "dd/MM/yyyy");
    let mensagem =
      `Olá! Gostaria de agendar no *${config.name}* 📅\n\n` +
      `👤 *Nome:* ${nome}\n` +
      `💈 *Serviço:* ${servico}\n` +
      `📆 *Data:* ${dataFormatada}\n` +
      `⏰ *Horário:* ${horario}`;
    
    if (observacao.trim()) {
      mensagem += `\n📝 *Observação:* ${observacao.trim()}`;
    }
    
    mensagem += `\n\n✅ *Solicitado via Site* 🚀`;

    window.open(
      `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );

    toast({
      title: "Agendamento salvo! 📱",
      description: `Enviado para ${config.name}`,
    });

    setIsSummaryOpen(false);
    setDate(undefined);
    setHorario("");
    setServico("");
    setNome("");
    setObservacao("");
  };

  // ── Admin actions ────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const settingsPass = config.settingsPassword || "mestre";
    const apptPass = config.apptPassword || "agenda";

    if (password === settingsPass) {
      setAccessLevel('full');
      setPassword("");
      toast({ title: "Bem-vindo, Mestre! 👑" });
    } else if (password === apptPass) {
      setAccessLevel('appt');
      setPassword("");
      toast({ title: "Bem-vindo à Agenda! 📝" });
    } else {
      toast({ title: "Senha incorreta", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setAccessLevel('none');
    setAdminOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = getAppointments().filter((a) => a.id !== id);
    saveAppointments(updated);
    setAppointments(updated);
  };

  // ── Config actions ───────────────────
  const updateConfig = (newConf: Partial<BusinessConfig>) => {
    const updated = { ...config, ...newConf };
    setConfig(updated);
    saveStoredConfig(updated);
  };

  const addService = () => {
    const updated = [...config.services, { name: "Novo Serviço", price: 0 }];
    updateConfig({ services: updated });
  };

  const removeService = (index: number) => {
    const updated = config.services.filter((_, i) => i !== index);
    updateConfig({ services: updated });
  };

  const editService = (index: number, name: string, price: number) => {
    const updated = [...config.services];
    updated[index] = { name, price };
    updateConfig({ services: updated });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 1.5) { // 1.5MB limit to keep localStorage safe
      toast({ title: "Arquivo muito grande", description: "Escolha uma foto menor que 1.5MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updated = [...(config.galleryImages || []), base64].slice(-8); // Limit to 8 photos
      updateConfig({ galleryImages: updated });
      toast({ title: "Foto adicionada!" });
    };
    reader.readAsDataURL(file);
  };

  const removeGalleryImage = (index: number) => {
    const updated = (config.galleryImages || []).filter((_, i) => i !== index);
    updateConfig({ galleryImages: updated });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 512) { // 512KB for logo is enough
      toast({ title: "Arquivo muito grande", description: "Escolha uma imagem menor que 512KB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updateConfig({ logoUrl: base64 });
      toast({ title: "Logo atualizada!" });
    };
    reader.readAsDataURL(file);
  };

  // ── Filter day appointments (Admin) ──
  const selectedDayStr = format(selectedDay, "yyyy-MM-dd");
  const dayAppointments = appointments
    .filter((a) => a.data === selectedDayStr)
    .sort((a, b) => a.horario.localeCompare(b.horario));

  const navigateDay = (dir: number) => {
    const next = new Date(selectedDay);
    next.setDate(next.getDate() + dir);
    setSelectedDay(next);
  };

  const futureCount = appointments.filter((a) =>
    isAfter(parseISO(a.data), startOfDay(new Date())) || a.data === format(new Date(), "yyyy-MM-dd")
  ).length;

  const totalEarnings = useMemo(() => {
    return dayAppointments.reduce((sum, a) => {
      const priceStr = a.servico.split("R$")[1]?.trim();
      return sum + (Number(priceStr) || 0);
    }, 0);
  }, [dayAppointments]);

  return (
    <div 
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8"
      style={{ "--primary-color": config.primaryColor } as any}
    >
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--primary-color)] opacity-10 blur-3xl animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-accent/6 blur-3xl animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="fixed top-5 right-5 z-50 flex gap-2"
      >
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-card/80 backdrop-blur-md text-muted-foreground hover:text-[var(--primary-color)] hover:border-[var(--primary-color)]/30 transition-all shadow-sm"
        >
          {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
        <button
          onClick={() => setAdminOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-card/80 backdrop-blur-md text-muted-foreground hover:text-[var(--primary-color)] hover:border-[var(--primary-color)]/30 transition-all shadow-sm"
        >
          <UserCog className="h-4.5 w-4.5" />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4 }}
            className="mx-auto mb-6 flex h-36 w-full max-w-[240px] items-center justify-center rounded-3xl text-white overflow-hidden p-2"
          >
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="h-full w-full object-contain" />
            ) : (
              <div 
                className="flex h-24 w-24 items-center justify-center rounded-3xl shadow-elevated"
                style={{ backgroundColor: config.primaryColor }}
              >
                <BusinessIcon className="h-12 w-12" />
              </div>
            )}
          </motion.div>

          <motion.h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            {config.name.split(" ")[0]} 
            <span style={{ color: config.primaryColor }}>
              {config.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>

          <motion.p className="mt-2 text-sm text-muted-foreground">
            <Sparkles className="mr-1 inline h-3.5 w-3.5" style={{ color: config.primaryColor }} />
            Agende seu horário em segundos
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border bg-card/80 backdrop-blur-2xl p-6 sm:p-8 shadow-card"
        >
          <div className="space-y-1.5">
            <Label htmlFor="nome" className="text-xs font-medium">Nome</Label>
            <Input id="nome" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} className="h-11 rounded-2xl bg-background/60" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Serviço</Label>
            <Select value={servico} onValueChange={setServico}>
              <SelectTrigger className="h-11 rounded-2xl bg-background/60">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {config.services.map((s) => (
                  <SelectItem key={s.name} value={`${s.name} - R$ ${s.price}`}>
                    {s.name} - R$ {s.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("h-11 w-full justify-start rounded-2xl bg-background/60 text-left font-normal text-sm", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {date ? format(date, "dd/MM/yy", { locale: ptBR }) : "Escolha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none bg-transparent" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} initialFocus className="rounded-3xl border bg-card shadow-card pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Horário</Label>
              <Select value={horario} onValueChange={setHorario} disabled={!date}>
                <SelectTrigger className="h-11 rounded-2xl bg-background/60">
                  <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder={!date ? "Escolha a data" : "Hora"} />
                </SelectTrigger>
                <SelectContent>
                  {horariosFixos.map((h) => {
                    const isBusy = occupiedSlots.includes(h);
                    return (
                      <SelectItem key={h} value={h} disabled={isBusy} className="relative">
                        <div className="flex items-center justify-between w-full min-w-[80px]">
                          <span>{h}</span>
                          {isBusy && <span className="text-[10px] text-destructive ml-2 font-bold uppercase tracking-tighter">Ocupado</span>}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="obs" className="text-xs font-medium text-muted-foreground">Observação (Opcional)</Label>
            <Textarea
              id="obs"
              placeholder="Algum detalhe extra?"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="min-h-[80px] rounded-2xl bg-background/60 resize-none text-sm"
            />
          </div>

          <Button 
            type="submit" 
            className="group mt-2 h-12 w-full rounded-2xl text-sm font-semibold shadow-elevated border-none text-white transition-transform hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: config.primaryColor }}
          >
            <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            Confirmar via WhatsApp
          </Button>
        </motion.form>

        {/* Gallery Section */}
        {config.galleryImages && config.galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-8 space-y-3"
          >
            <div className="flex items-center gap-2 px-2">
              <ImageIcon className="h-4 w-4 text-[var(--primary-color)]" />
              <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">Nossos Trabalhos</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scroll-smooth snap-x">
              {config.galleryImages.map((img, i) => (
                <div key={i} className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl border bg-muted snap-center shadow-sm hover:scale-[1.02] transition-transform">
                  <img src={img} alt={`Gallery ${i}`} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <footer className="mt-12 text-center text-xs text-muted-foreground/60 space-y-4">
          <div className="flex items-center justify-center gap-4">
            {config.instagram && (
              <a href={`https://instagram.com/${config.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {config.facebook && (
              <a href={`https://facebook.com/${config.facebook}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
          {config.address && (
            <div className="flex items-center justify-center gap-1.5 opacity-80">
              <MapPin className="h-3 w-3" />
              <span>{config.address}</span>
            </div>
          )}
          <p>&copy; {new Date().getFullYear()} {config.name}. Todos os direitos reservados.</p>
        </footer>
      </motion.div>

      {/* ── AGENDAMENTO SUMMARY MODAL ── */}
      <AnimatePresence>
        {isSummaryOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm rounded-[32px] bg-card p-6 shadow-2xl border relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Resumo do Agendamento</h3>
                <p className="text-sm text-muted-foreground">Confira os detalhes para prosseguir</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground uppercase">Cliente</span>
                  <span className="text-sm font-bold truncate ml-2">{nome}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground uppercase">Serviço</span>
                  <span className="text-sm font-bold truncate ml-2">{servico}</span>
                </div>
                <div className="flex justify-between items-start p-3 rounded-2xl bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground uppercase mt-0.5">Data & Hora</span>
                  <div className="text-right">
                    <p className="text-sm font-bold">{date && format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
                    <p className="text-xs text-primary font-bold">às {horario}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={confirmAndRedirect} size="lg" className="h-14 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20">
                  Confirmar e Enviar <Send className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => setIsSummaryOpen(false)} className="h-12 rounded-xl text-muted-foreground">
                  Alterar dados
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {adminOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
            onClick={() => { if (accessLevel === 'none') setAdminOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-3xl border bg-card/95 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => { setAdminOpen(false); setAccessLevel('none'); setPassword(""); }}
                className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>

              {accessLevel === 'none' ? (
                <div className="p-10">
                  <div className="text-center mb-8">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Lock className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold font-heading">Painel Restrito</h2>
                    <p className="text-xs text-muted-foreground">{config.name}</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-2xl text-center text-lg bg-background/50" autoFocus />
                    <Button type="submit" className="h-12 w-full rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white">Entrar</Button>
                  </form>
                </div>
              ) : (
                <Tabs defaultValue="appt" className="flex flex-col max-h-[90vh]">
                  <div className="px-6 pt-6 pb-2 border-b">
                    <TabsList className={cn("grid w-full rounded-2xl h-12 p-1.5 bg-muted/50", accessLevel === 'appt' ? 'grid-cols-1' : 'grid-cols-2')}>
                      <TabsTrigger value="appt" className="rounded-xl flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        Agendas
                      </TabsTrigger>
                      {accessLevel === 'full' && (
                        <TabsTrigger value="settings" className="rounded-xl flex items-center gap-2">
                          <Settings2 className="h-4 w-4" />
                          Master
                        </TabsTrigger>
                      )}
                    </TabsList>
                  </div>

                  <TabsContent value="appt" className="flex-1 overflow-hidden flex flex-col p-0">
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/10">
                      <button onClick={() => navigateDay(-1)} className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
                      <div className="text-center">
                        <div className="text-sm font-bold capitalize">{dayLabel(format(selectedDay, "yyyy-MM-dd"))}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}</div>
                      </div>
                      <button onClick={() => navigateDay(1)} className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 px-6 py-4 bg-muted/5 border-b">
                      <div className="p-3 rounded-2xl border bg-background/50">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                          Ganhos do Dia
                        </div>
                        <div className="text-xl font-black text-foreground">
                          <span className="text-xs font-medium mr-1 text-muted-foreground">R$</span>
                          {totalEarnings}
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl border bg-background/50">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          <CalendarIcon className="h-3 w-3 text-indigo-500" />
                          Agendamentos
                        </div>
                        <div className="text-xl font-black text-foreground">
                          {dayAppointments.length}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {dayAppointments.length === 0 ? (
                        <div className="py-20 text-center opacity-40">
                          <CalendarDays className="h-12 w-12 mx-auto mb-4" />
                          <p className="text-sm font-medium">Tudo livre hoje</p>
                        </div>
                      ) : (
                        dayAppointments.map(a => (
                          <div key={a.id} className="group relative flex flex-col gap-3 p-4 rounded-2xl border bg-background/50 transition-all hover:bg-background">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-2xl flex flex-col items-center justify-center border" style={{ backgroundColor: `${config.primaryColor}10`, borderColor: `${config.primaryColor}30`, color: config.primaryColor }}>
                                <span className="text-xs font-bold leading-none">{a.horario}</span>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-bold">{a.nome}</div>
                                <div className="text-[11px] text-muted-foreground uppercase font-semibold">{a.servico}</div>
                              </div>
                              <button onClick={() => handleDelete(a.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                            </div>
                            {a.observacao && (
                              <div className="flex gap-2 p-3 rounded-xl bg-muted/30 text-[11px] text-muted-foreground leading-relaxed italic border border-dashed">
                                <MessageSquare className="h-3 w-3 mt-0.5" />
                                {a.observacao}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">{futureCount} pendentes</span>
                      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground h-8 px-3 rounded-lg"><LogOut className="h-3.5 w-3.5 mr-2" />Sair</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nome do Negócio</Label>
                          <Input value={config.name} onChange={e => updateConfig({ name: e.target.value })} className="h-11 rounded-xl bg-background/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">WhatsApp Destino</Label>
                          <Input value={config.whatsapp} onChange={e => updateConfig({ whatsapp: e.target.value })} className="h-11 rounded-xl bg-background/50" />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Ícone & Cor</Label>
                          <div className="flex gap-2">
                            <Select value={config.icon} onValueChange={(val: IconType) => updateConfig({ icon: val })}>
                              <SelectTrigger className="h-11 flex-1 rounded-xl bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {iconsList.map(i => {
                                  const Icon = iconMap[i];
                                  return <SelectItem key={i} value={i}><div className="flex items-center gap-2 text-xs"><Icon className="h-4 w-4" /> {i}</div></SelectItem>
                                })}
                              </SelectContent>
                            </Select>
                            <Input type="color" value={config.primaryColor} onChange={e => updateConfig({ primaryColor: e.target.value })} className="h-11 w-14 p-1 rounded-xl bg-background/50 cursor-pointer" />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground underline decoration-primary/30">Logo da Empresa</Label>
                          <div className="flex gap-3">
                            <div className="h-11 w-11 rounded-xl border bg-background/50 flex items-center justify-center overflow-hidden shrink-0 group relative">
                              {config.logoUrl ? (
                                <>
                                  <img src={config.logoUrl} className="h-full w-full object-cover" />
                                  <button onClick={() => updateConfig({ logoUrl: undefined })} className="absolute inset-0 flex items-center justify-center bg-destructive/60 opacity-0 group-hover:opacity-100 text-white transition-opacity">
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </>
                              ) : (
                                <BusinessIcon className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 relative">
                              <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                              <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()} className="h-11 w-full rounded-xl bg-background/50 border-dashed hover:border-primary/50 text-xs">
                                <Plus className="h-3 w-3 mr-2 text-primary" /> Carregar Foto
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Senhas Admin</Label>
                          <div className="flex gap-2">
                            <Input placeholder="Agenda" value={config.apptPassword} onChange={e => updateConfig({ apptPassword: e.target.value })} className="h-11 flex-1 rounded-xl bg-background/50 text-xs" />
                            <Input placeholder="Mestre" value={config.settingsPassword} onChange={e => updateConfig({ settingsPassword: e.target.value })} className="h-11 flex-1 rounded-xl bg-background/50 text-xs" />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Endereço Físico</Label>
                          <Input value={config.address} onChange={e => updateConfig({ address: e.target.value })} placeholder="Ex: Av. Brasil, 100 - Centro" className="h-11 rounded-xl bg-background/50 text-xs" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Instagram (@user)</Label>
                          <Input value={config.instagram} onChange={e => updateConfig({ instagram: e.target.value })} placeholder="Ex: amanda_beauty" className="h-11 rounded-xl bg-background/50 text-xs" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Facebook (nome-usuario)</Label>
                          <Input value={config.facebook} onChange={e => updateConfig({ facebook: e.target.value })} placeholder="Ex: amanda.beleza" className="h-11 rounded-xl bg-background/50 text-xs" />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Horários (Abre / Fecha)</Label>
                          <div className="flex gap-2">
                            <Input type="time" value={config.openingTime} onChange={e => updateConfig({ openingTime: e.target.value })} className="h-11 flex-1 rounded-xl bg-background/50 text-xs" />
                            <Input type="time" value={config.closingTime} onChange={e => updateConfig({ closingTime: e.target.value })} className="h-11 flex-1 rounded-xl bg-background/50 text-xs" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Duração (minutos)</Label>
                          <Input type="number" step="15" min="15" max="180" value={config.slotDuration} onChange={e => updateConfig({ slotDuration: Number(e.target.value) })} className="h-11 rounded-xl bg-background/50 text-xs text-center" />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px] uppercase font-bold">Serviços & Preços</Label>
                          <Button size="sm" onClick={addService} className="h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Plus className="h-4 w-4 mr-1" /> Novo</Button>
                        </div>
                        <div className="space-y-3">
                          {config.services.map((s, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <Input value={s.name} onChange={e => editService(idx, e.target.value, s.price)} className="flex-1 h-10 rounded-xl bg-background/30 text-sm" />
                              <div className="relative w-24">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">R$</span>
                                <Input type="number" value={s.price} onChange={e => editService(idx, s.name, Number(e.target.value))} className="h-10 pl-8 rounded-xl bg-background/30 text-sm" />
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeService(idx)} className="h-10 w-10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px] uppercase font-bold">Galeria de Fotos</Label>
                          <div className="relative">
                            <input 
                              type="file" 
                              id="gallery-upload" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handleImageUpload} 
                            />
                            <Button size="sm" onClick={() => document.getElementById('gallery-upload')?.click()} className="h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                              <Plus className="h-4 w-4 mr-1" /> Galeria
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {(config.galleryImages || []).map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
                              <img src={img} className="h-full w-full object-cover" />
                              <button 
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute inset-0 flex items-center justify-center bg-destructive/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-muted-foreground uppercase text-center font-medium">Máximo de 8 fotos para melhor performance</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
