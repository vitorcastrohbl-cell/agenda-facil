import { motion } from "framer-motion";
import { UserPlus, CalendarCheck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Escolha o Serviço",
    description: "Navegue pelos nossos serviços e encontre o ideal para você.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Selecione Data e Hora",
    description: "Escolha o melhor dia e horário disponível na nossa agenda.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Confirme pelo WhatsApp",
    description: "Receba a confirmação instantânea direto no seu WhatsApp.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Passo a passo
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Como <span className="text-gradient">Funciona</span>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Em 3 passos simples você agenda seu horário
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3 md:gap-12">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-[60%] hidden h-[2px] w-[80%] bg-gradient-to-r from-primary/30 to-primary/5 md:block" />
              )}

              {/* Step number badge */}
              <div className="mx-auto mb-6 relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elevated">
                  <s.icon className="h-8 w-8" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground shadow-sm">
                  {s.step}
                </span>
              </div>

              <h3 className="mb-2 font-heading text-xl font-semibold">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
