import { motion } from "framer-motion";
import { Scissors, Sparkles, Heart, Palette } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Corte de Cabelo",
    duration: "45 min",
    price: "R$ 60",
    description: "Corte profissional com lavagem e finalização.",
  },
  {
    icon: Sparkles,
    title: "Limpeza de Pele",
    duration: "60 min",
    price: "R$ 120",
    description: "Tratamento facial completo com produtos premium.",
  },
  {
    icon: Palette,
    title: "Coloração",
    duration: "90 min",
    price: "R$ 180",
    description: "Coloração personalizada com tintas de alta qualidade.",
  },
  {
    icon: Heart,
    title: "Massagem Relaxante",
    duration: "60 min",
    price: "R$ 150",
    description: "Massagem completa para aliviar tensões e stress.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Services = () => {
  return (
    <section id="servicos" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
            Nossos Serviços
          </h2>
          <p className="text-muted-foreground">
            Escolha o serviço ideal para você
          </p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="group rounded-lg border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-heading text-lg font-semibold">
                {service.title}
              </h3>
              <p className="mb-3 text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{service.duration}</span>
                <span className="font-semibold text-primary">{service.price}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
