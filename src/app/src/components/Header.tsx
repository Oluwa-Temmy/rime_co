import { NavLink } from "react-router-dom";
import { useCart } from "../lib/cart";
import { useSiteConfig } from "../lib/useSiteConfig";
import "./Header.css";

export function Header() {
  const { config } = useSiteConfig();
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="container header__inner">
        <NavLink to="/" className="header__brand">
          {config.site_name}
        </NavLink>
        <nav className="header__nav">
          <NavLink to="/products" className="header__link">
            Water
          </NavLink>
          <NavLink to="/about" className="header__link">
            Our Sources
          </NavLink>
          <NavLink to="/contact" className="header__link">
            Contact
          </NavLink>
          <NavLink to="/checkout" className="header__link header__cart">
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
