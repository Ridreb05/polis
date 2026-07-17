# Polis — Client

The Next.js 14 (App Router) frontend for **Polis**, the on-chain governance platform.

## Develop

```bash
npm install
cp .env.example .env    # NEXT_PUBLIC_CONTRACT_ADDRESS
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint |

## Architecture notes

- **`context/PolisContext.jsx`** exposes wallet state and all election actions via `usePolis()`.
- **`services/contract.js`** wraps ethers (read/write contract instances, normalizers, error parsing).
- **`services/network.js`** holds AIA Testnet config and network-switching helpers.
- **`components/ui/`** contains styled primitives (`Button`, `Card`, `Badge`, `Input`, `Toaster`).
- **`lib/constants.js`** is generated from the compiled contract ABI.

Fonts (Inter, Space Grotesk) load via CSS `@import` in `app/globals.css`; the
design tokens live there as CSS variables consumed by `tailwind.config.js`.
