import { useSiteConfig } from "../lib/useSiteConfig";
import "./Footer.css";

export function Footer() {
  const { config } = useSiteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">{config.site_name}</div>
        <div className="footer__meta">
          <a href={`mailto:${config.contact_email}`}>{config.contact_email}</a>
          {config.instagram_url && (
            <a href={config.instagram_url} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
        </div>
        <div className="footer__copy">
          &copy; {year} {config.site_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
