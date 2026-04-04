import { motion } from "framer-motion";
import { Scissors, Sparkles, Heart, Palette, Clock, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Corte de Cabelo",
    duration: "45 min",
    price: "R$ 60",
    description: "Corte profissional com lavagem e finalização completa.",
    color: "from-violet-500/20 to-purple-500/20",
    iconBg: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: Sparkles,
    title: "Limpeza de Pele",
    duration: "60 min",
    price: "R$ 120",
    description: "Tratamento facial completo com produtos premium importados.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Palette,
    title: "Coloração",
    duration: "90 min",
    price: "R$ 180",
    description: "Coloração personalizada com tintas de alta qualidade.",
    color: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Heart,
    title: "Massagem Relaxante",
    duration: "60 min",
    price: "R$ 150",
    description: "Massagem completa para aliviar tensões e renovar energias.",
    color: "from-rose-500/20 to-pink-500/20",
    iconBg: "bg-rose-500/10 text-rose-600",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Services = () => {
  return (
    <section id="servicos" className="relative py-24 md:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Serviços
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Nossos <span className="text-gradient">Serviços</span>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Conheça nossos serviços profissionais e escolha o ideal para você
          </p>
        </motion.div>

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
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-elevated cursor-pointer"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className={`mb-5 inline-flex rounded-xl p-3 ${service.iconBg} transition-all duration-300 group-hover:scale-110`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold">
                  {service.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {service.duration}
                  </div>
                  <span className="font-heading text-lg font-bold text-primary">
                    {service.price}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Agendar
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
