import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
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
  "Corte de Cabelo",
  "Limpeza de Pele",
  "Coloração",
  "Massagem Relaxante",
];

const horarios = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

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
    toast({
      title: "Agendamento confirmado! ✅",
      description: `${servico} em ${format(date, "dd/MM/yyyy")} às ${horario}. Até lá, ${nome}!`,
    });
    setDate(undefined);
    setHorario("");
    setServico("");
    setNome("");
    setTelefone("");
  };

  return (
    <section id="agendar" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
            Faça seu Agendamento
          </h2>
          <p className="text-muted-foreground">
            Preencha os dados abaixo e garanta seu horário
          </p>
        </div>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="mx-auto max-w-lg space-y-5 rounded-xl border bg-card p-8 shadow-card"
        >
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone / WhatsApp</Label>
            <Input
              id="telefone"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Serviço</Label>
            <Select value={servico} onValueChange={setServico}>
              <SelectTrigger>
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
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
              <Label>Horário</Label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger>
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
          <Button type="submit" className="w-full text-base font-semibold shadow-elevated" size="lg">
            Confirmar Agendamento
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
