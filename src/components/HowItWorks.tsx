import { motion } from "framer-motion";
import { UserPlus, CalendarCheck, Clock } from "lucide-react";

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
    description: "Escolha o melhor dia e horário disponível na agenda.",
  },
  {
    icon: Clock,
    step: "03",
    title: "Confirme o Agendamento",
    description: "Preencha seus dados e receba a confirmação instantânea.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
            Como Funciona
          </h2>
          <p className="text-muted-foreground">
            Em 3 passos simples você agenda seu horário
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevated">
                <s.icon className="h-7 w-7" />
              </div>
              <span className="mb-2 block font-heading text-sm font-bold uppercase tracking-wider text-primary">
                Passo {s.step}
              </span>
              <h3 className="mb-2 font-heading text-xl font-semibold">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
