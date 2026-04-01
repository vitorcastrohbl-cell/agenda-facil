import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

const Index = () => {
  const agendarRef = useRef<HTMLDivElement>(null);

  const scrollToAgendar = () => {
    agendarRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar onAgendarClick={scrollToAgendar} />
      <Hero onAgendarClick={scrollToAgendar} />
      <Services />
      <HowItWorks />
      <div ref={agendarRef}>
        <BookingForm />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
