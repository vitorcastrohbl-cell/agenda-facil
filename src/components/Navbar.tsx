import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onAgendarClick: () => void;
}

const Navbar = ({ onAgendarClick }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 font-heading text-xl font-bold">
          <CalendarDays className="h-5 w-5 text-primary" />
          AgendaFácil
        </div>
        <div className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <a href="#servicos" className="text-muted-foreground transition-colors hover:text-foreground">
            Serviços
          </a>
          <a href="#agendar" className="text-muted-foreground transition-colors hover:text-foreground">
            Agendar
          </a>
        </div>
        <Button size="sm" className="font-semibold" onClick={onAgendarClick}>
          Agendar
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
