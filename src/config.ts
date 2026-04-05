import { 
  Scissors, 
  Sparkles, 
  Flower2, 
  Baby, 
  Waves, 
  HeartPulse, 
  Stethoscope,
  Dog,
  Car,
  Utensils
} from "lucide-react";

export type IconType = "Scissors" | "Sparkles" | "Flower2" | "Baby" | "Waves" | "HeartPulse" | "Stethoscope" | "Dog" | "Car" | "Utensils";

export const iconMap = {
  Scissors,
  Sparkles,
  Flower2,
  Baby,
  Waves,
  HeartPulse,
  Stethoscope,
  Dog,
  Car,
  Utensils
};

export interface BusinessConfig {
  name: string;
  whatsapp: string;
  primaryColor: string; // Hex color
  icon: IconType;
  services: { name: string; price: number }[];
  apptPassword?: string;
  settingsPassword?: string;
  openingTime: string; // e.g. "09:00"
  closingTime: string; // e.g. "18:00"
  slotDuration: number; // in minutes
  galleryImages: string[];
  logoUrl?: string;
  instagram?: string;
  facebook?: string;
  address?: string;
}

// ── CONFIGURAÇÃO PADRÃO (O QUE VEM NO SITE) ──
export const DEFAULT_CONFIG: BusinessConfig = {
  name: "AgendaFácil",
  whatsapp: "5569993314524",
  primaryColor: "#7c3aed", // Violeta elegante
  icon: "Sparkles",
  logoUrl: undefined,
  instagram: "",
  facebook: "",
  address: "Av. Principal, 1234 - Centro",
  services: [
    { name: "Corte de Cabelo", price: 60 },
    { name: "Limpeza de Pele", price: 120 },
    { name: "Coloração", price: 180 },
    { name: "Massagem Relaxante", price: 150 },
  ],
  apptPassword: "agenda", 
  settingsPassword: "Vitor@2000",
  openingTime: "08:00",
  closingTime: "19:00",
  slotDuration: 30,
  galleryImages: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=800&auto=format&fit=crop&q=60",
  ],
};
