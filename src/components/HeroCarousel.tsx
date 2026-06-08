import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function HeroCarousel() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] md:h-[520px] lg:h-[560px]">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=80"
          alt="Top Beauty Brands"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
          <div className="max-w-xl text-white mt-20">
            <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/20 backdrop-blur">
              Trusted by millions
            </span>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mt-5 leading-[1.05]">
              Top Beauty Brands
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/80 max-w-md">
              Maybelline, L'Oréal, Covergirl, Revlon & more.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 rounded-full bg-primary text-primary-foreground hover:bg-rose hover:text-white transition shadow-lg"
            >
              Browse Brands
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
