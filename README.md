# Rime Co

Rime Co is a luxury water brand website — a storefront for rare glacial,
alpine, and deep mineral spring waters, sourced from protected origins
around the world. The site presents the collection, tells the sourcing
story behind each source, and lets customers buy bottles in single or
multi-bottle packs (4/8/12) with checkout and payment handled on-site
via Stripe.

## Tech Stack

**Frontend** — `src/app`
- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [React Router](https://reactrouter.com/) for client-side routing
- [Stripe.js](https://stripe.com/docs/js) / [React Stripe.js](https://stripe.com/docs/stripe-js/react) for the embedded payment element
- Plain CSS driven by a central `theme.ts` (no hardcoded brand colors/strings — site name and copy are fetched from the backend API)

**Backend** — `src/api`
- [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
- [Stripe](https://stripe.com/docs/api) (Python SDK) for PaymentIntents and webhook-driven order confirmation
- SQLite for local development
- Apps: `products` (catalog + pack pricing), `site_settings` (brand copy served via API), `contact` (contact form submissions), `orders` (cart checkout, Stripe integration)

**Environment**
- Python virtual environment managed with [uv](https://github.com/astral-sh/uv), at `src/.venv`
- Secrets (Stripe keys, etc.) loaded from a git-ignored `.env` file via `python-dotenv` — see `src/api/.env.example`

## Project Structure

```
src/
├── api/        # Django REST API backend
└── app/        # Vite + React + TypeScript frontend
```

## License

All rights reserved — see [LICENSE](LICENSE).
