import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Camila Ferreira",
    role: "Cliente há 2 anos",
    avatar: "CF",
    text: "O melhor sistema de agendamento que já usei! Super prático e rápido. Nunca mais perdi horário.",
    rating: 5,
  },
  {
    name: "Rafael Santos",
    role: "Cliente há 1 ano",
    avatar: "RS",
    text: "Incrível como é fácil agendar pelo site. Em menos de 1 minuto já tenho meu horário garantido!",
    rating: 5,
  },
  {
    name: "Ana Paula Costa",
    role: "Cliente há 6 meses",
    avatar: "AC",
    text: "Adorei a experiência! O agendamento pelo WhatsApp facilita muito. Recomendo para todos.",
    rating: 5,
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

const Testimonials = () => {
  return (
    <section id="depoimentos" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Depoimentos
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
            O que nossos <span className="text-gradient">clientes</span> dizem
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Veja o que dizem as pessoas que já usam o AgendaFácil
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative rounded-2xl border bg-card p-7 shadow-card transition-shadow duration-300 hover:shadow-elevated"
            >
              {/* Quote icon */}
              <Quote className="mb-4 h-8 w-8 text-primary/20" />

              {/* Rating */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
