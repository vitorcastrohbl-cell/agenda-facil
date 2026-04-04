import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "@/hooks/use-toast";

const servicos = [
  "Corte de Cabelo - R$ 60",
  "Limpeza de Pele - R$ 120",
  "Coloração - R$ 180",
  "Massagem Relaxante - R$ 150",
];

const horarios = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const WHATSAPP_NUMBER = "5511999999999"; // Número do WhatsApp

const BookingForm = () => {
  const [date, setDate] = useState<Date>();
  const [horario, setHorario] = useState("");
  const [servico, setServico] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !horario || !servico || !nome.trim() || !telefone.trim()) {
      toast({
        title: "Preencha todos os campos",
        description: "Todos os campos são obrigatórios para o agendamento.",
        variant: "destructive",
      });
      return;
    }

    const dataFormatada = format(date, "dd/MM/yyyy");
    const mensagem =
      `Olá! Gostaria de agendar um serviço 📅\n\n` +
      `👤 *Nome:* ${nome}\n` +
      `📱 *Telefone:* ${telefone}\n` +
      `💈 *Serviço:* ${servico}\n` +
      `📆 *Data:* ${dataFormatada}\n` +
      `⏰ *Horário:* ${horario}\n\n` +
      `Aguardo confirmação! 😊`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");

    toast({
      title: "Redirecionando para o WhatsApp! 📱",
      description: `Confirme seu agendamento de ${servico.split(" - ")[0]} para ${dataFormatada} às ${horario}.`,
    });

    setDate(undefined);
    setHorario("");
    setServico("");
    setNome("");
    setTelefone("");
  };

  return (
    <section id="agendar" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Agendamento
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Faça seu <span className="text-gradient">Agendamento</span>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Preencha os dados e confirme pelo WhatsApp em segundos
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="mx-auto max-w-lg space-y-6 rounded-2xl border bg-card/80 backdrop-blur-sm p-8 md:p-10 shadow-card"
        >
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">
              Nome completo
            </Label>
            <Input
              id="nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="h-12 rounded-xl bg-background/50"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-sm font-medium">
              Telefone / WhatsApp
            </Label>
            <Input
              id="telefone"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="h-12 rounded-xl bg-background/50"
            />
          </div>

          {/* Serviço */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Serviço</Label>
            <Select value={servico} onValueChange={setServico}>
              <SelectTrigger className="h-12 rounded-xl bg-background/50">
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data + Horário */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 w-full justify-start rounded-xl bg-background/50 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "dd 'de' MMM, yyyy", { locale: ptBR })
                      : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Horário</Label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger className="h-12 rounded-xl bg-background/50">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Horário" />
                </SelectTrigger>
                <SelectContent>
                  {horarios.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="group h-13 w-full rounded-xl text-base font-semibold shadow-elevated"
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Confirmar via WhatsApp
            <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Você será redirecionado para o WhatsApp para confirmar o agendamento
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
