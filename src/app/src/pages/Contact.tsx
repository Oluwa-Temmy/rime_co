import { FormEvent, useState } from "react";
import { api } from "../lib/api";
import { useSiteConfig } from "../lib/useSiteConfig";
import "./Contact.css";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const { config } = useSiteConfig();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    try {
      await api.submitContact({ name, email, message });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="container contact-page">
      <div className="contact-page__grid">
        <div>
          <h1>Get in touch</h1>
          <p className="contact-page__lead">
            Questions about sourcing, wholesale, or partnerships? We'd love to
            hear from you.
          </p>
          {config.contact_email && (
            <a className="contact-page__email" href={`mailto:${config.contact_email}`}>
              {config.contact_email}
            </a>
          )}
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="contact-form__field">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="contact-form__field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="contact-form__field">
            <span>Message</span>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send Message"}
          </button>
          {status === "success" && (
            <p className="contact-form__status success">Thanks — we'll be in touch.</p>
          )}
          {status === "error" && (
            <p className="contact-form__status error">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
