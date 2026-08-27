# AddisPay Interactive Developer Documentation Portal

Self-contained, standalone interactive developer portal and API documentation website for **AddisPay Financial Technology Share Company** (NBE License `NPS/PSO/007/2022`).

Built with **Fumadocs**, **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

---

## Features

- **Interactive API Playground**: Test payment creation, direct debits, EthQR generation, status queries, and refunds in real time.
- **Live Signed Webhook Dispatcher**: Trigger cryptographically signed (`X-AddisPay-Signature`) test webhooks to your local server or public receiver.
- **Dynamic EthQR & Telebirr QR Code Visualizer**: Generate and parse NBE EMVCo QR code payloads.
- **HMAC-SHA256 Signature Calculator**: Live calculator and multi-language verification snippets (Node.js, Python, Go, PHP, Java).
- **OpenAPI 3.1.0 JSON Route**: Downloadable schema served at `/api/dev-doc/openapi.json`.
- **Ethiopian Payment Rail Deep Dives**: Telebirr, CBE Birr, Awash Pay, Dashen Amole, EthSwitch cards, International cards (3DS 2.0).
- **Android SoftPOS (Tap to Pay)**: EMV L2 contactless flow, PIN-on-glass, and terminal batch settlement.
- **Admin CMS API Reference**: Complete Go backend REST API reference.
- **Fast Full-Text Search**: Powered by Fumadocs search engine.

---

## Quick Start

```bash
cd dev-doc
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Production Build

```bash
npm run build
npm start
```
