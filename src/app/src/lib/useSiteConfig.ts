import { useEffect, useState } from "react";
import { SITE_NAME } from "../constants";
import { api } from "./api";
import type { SiteConfig } from "./types";

const fallback: SiteConfig = {
  site_name: SITE_NAME,
  tagline: "",
  hero_headline: "",
  hero_subheadline: "",
  about_headline: "",
  about_body: "",
  contact_email: "",
  instagram_url: "",
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getSiteConfig()
      .then((data) => {
        if (active) setConfig(data);
      })
      .catch(() => {
        // keep fallback if the API is unreachable
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { config, loading };
}
