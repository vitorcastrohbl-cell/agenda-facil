import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Sparkles, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onAgendarClick: () => void;
}

const Hero = ({ onAgendarClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Decorative grid */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-[10%] h-96 w-96 rounded-full bg-accent/8 blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4 pt-24 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Agendamento online simplificado
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 font-heading text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Agende seus{" "}
            <span className="text-gradient">serviços</span>
            <br />
            em segundos
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Escolha o serviço, selecione o melhor horário e pronto.
            Simples, rápido e sem complicações.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button
              size="lg"
              className="group rounded-full px-8 text-base font-semibold shadow-elevated"
              onClick={onAgendarClick}
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              Agendar agora
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-base font-semibold bg-card/50 backdrop-blur-sm"
              onClick={() => document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver serviços
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 grid grid-cols-3 gap-8 mx-auto max-w-lg"
          >
            {[
              { icon: Star, value: "4.9", label: "Avaliação" },
              { icon: CalendarDays, value: "500+", label: "Agendamentos" },
              { icon: Clock, value: "24/7", label: "Disponível" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="font-heading text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
