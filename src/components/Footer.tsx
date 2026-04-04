import { CalendarDays, Heart, Instagram, MapPin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t bg-card/50">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2.5 font-heading text-xl font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CalendarDays className="h-5 w-5" />
              </div>
              <span className="tracking-tight">
                Agenda<span className="text-primary">Fácil</span>
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              Simplifique seus agendamentos. Rápido, fácil e sem complicações.
              A melhor plataforma de agendamento online.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-heading font-semibold">Links Rápidos</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#servicos" className="transition-colors hover:text-foreground hover:text-primary">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="transition-colors hover:text-foreground hover:text-primary">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="transition-colors hover:text-foreground hover:text-primary">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#agendar" className="transition-colors hover:text-foreground hover:text-primary">
                  Agendar
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-heading font-semibold">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Rua Exemplo, 123 - São Paulo, SP
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                contato@agendafacil.com
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                @agendafacil
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t pt-8 text-center sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgendaFácil. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Feito com <Heart className="h-3 w-3 fill-red-500 text-red-500" /> no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
