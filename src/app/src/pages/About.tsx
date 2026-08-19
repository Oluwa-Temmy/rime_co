import { useSiteConfig } from "../lib/useSiteConfig";
import "./About.css";

export function About() {
  const { config } = useSiteConfig();

  return (
    <section className="container about-page">
      <h1>{config.about_headline}</h1>
      <p className="about-page__body">{config.about_body}</p>

      <div className="about-page__principles">
        <div className="about-page__principle">
          <h3>Protected Sources</h3>
          <p>
            Each source is independently monitored to ensure we draw only what
            can be sustainably replenished.
          </p>
        </div>
        <div className="about-page__principle">
          <h3>Bottled at Origin</h3>
          <p>
            Water is bottled within hours of extraction, close to its source,
            to preserve its natural mineral character.
          </p>
        </div>
        <div className="about-page__principle">
          <h3>No Additives</h3>
          <p>
            Nothing added, nothing adjusted. What you taste is exactly what
            the source produced.
          </p>
        </div>
      </div>
    </section>
  );
}
