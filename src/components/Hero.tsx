import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onAgendarClick: () => void;
}

const Hero = ({ onAgendarClick }: HeroProps) => {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <CalendarDays className="h-4 w-4" />
            Agendamento online simplificado
          </div>
          <h1 className="mb-6 font-heading text-5xl font-800 leading-tight tracking-tight md:text-7xl">
            Agende seus{" "}
            <span className="text-primary">serviços</span>{" "}
            em segundos
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Escolha o serviço, selecione o melhor horário e pronto. Simples, rápido e sem complicações.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="px-8 text-base font-semibold shadow-elevated" onClick={onAgendarClick}>
              Agendar agora
            </Button>
            <Button variant="outline" size="lg" className="px-8 text-base font-semibold" onClick={onAgendarClick}>
              Ver serviços
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
