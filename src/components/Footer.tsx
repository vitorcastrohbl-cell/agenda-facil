import { CalendarDays } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/30 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 font-heading text-xl font-bold">
            <CalendarDays className="h-5 w-5 text-primary" />
            AgendaFácil
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Simplifique seus agendamentos. Rápido, fácil e sem complicações.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgendaFácil. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
