import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");

  // Define shop links with their corresponding API or filter type keys
  const shopLinks = [
    { label: "Lipstick", path: "/products?category=lipstick" },
    { label: "Foundation", path: "/products?category=foundation" },
    { label: "Mascara", path: "/products?category=mascara" },
    { label: "Skincare", path: "/products?category=skincare" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl">
            ny<span className="text-rose">kaa</span>
            <span className="text-rose">.</span>
          </h3>
          <p className="text-sm mt-3 text-primary-foreground/70 leading-relaxed">
            Premium beauty for the modern individual. Cruelty-free,
            dermatologist-tested, made with love.
          </p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="size-9 grid place-items-center rounded-full border border-primary-foreground/20 hover:bg-rose hover:border-rose transition"
                aria-label="social"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">
            Shop
          </h4>
          <ul className="space-y-2 text-sm">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className="text-primary-foreground/70 hover:text-rose transition-colors duration-200 block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/about" className="hover:text-rose transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-rose transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-rose transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/press" className="hover:text-rose transition-colors">
                Press
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">
            Newsletter
          </h4>
          <p className="text-sm text-primary-foreground/70 mb-3">
            Get 10% off your first order.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Subscribed!");
              setEmail("");
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 rounded-md bg-primary-foreground/10 text-sm border border-primary-foreground/20 focus:outline-none focus:border-rose"
            />

            <button className="px-4 py-2 rounded-md bg-rose text-white text-sm hover:opacity-90 cursor-pointer transition-opacity">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/50">
        © 2026 Nykaa Beauty. All rights reserved.
      </div>
    </footer>
  );
}
