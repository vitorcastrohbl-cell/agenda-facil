import { useState, useEffect } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onAgendarClick: () => void;
}

const Navbar = ({ onAgendarClick }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5 font-heading text-xl font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elevated">
            <CalendarDays className="h-5 w-5" />
          </div>
          <span className="tracking-tight">
            Agenda<span className="text-primary">Fácil</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <a
            href="#servicos"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Serviços
          </a>
          <a
            href="#como-funciona"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Como Funciona
          </a>
          <a
            href="#depoimentos"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Depoimentos
          </a>
          <Button
            size="sm"
            className="rounded-full px-6 font-semibold shadow-elevated"
            onClick={onAgendarClick}
          >
            Agendar Agora
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b bg-background/95 backdrop-blur-xl sm:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
              <a
                href="#servicos"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Serviços
              </a>
              <a
                href="#como-funciona"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Como Funciona
              </a>
              <a
                href="#depoimentos"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Depoimentos
              </a>
              <Button
                className="w-full rounded-full font-semibold shadow-elevated"
                onClick={() => {
                  setMobileOpen(false);
                  onAgendarClick();
                }}
              >
                Agendar Agora
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
