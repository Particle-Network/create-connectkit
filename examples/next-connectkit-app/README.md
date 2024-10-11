# Particle Connect

Particle Connect acts as a simple method of aggregating connection with both Web2 accounts through Particle Auth and Web3 accounts through traditional wallets, creating an equally accessible experience for both Web3 natives and traditional consumers. Specifically, Particle Connect is a custom connection modal built around interaction with Particle.

## Getting Started

First, create and configure the `.env` file by referring to the `.env.sample`.

```
# Particle Project Config, learn more info:  https://dashboard.particle.network/
NEXT_PUBLIC_PROJECT_ID=xxxx
NEXT_PUBLIC_CLIENT_KEY=xxxx
NEXT_PUBLIC_APP_ID=xxxx

# WalletConnect Project Id, learn more info: https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxxx
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

### Connectkit

To learn more about Connectkit, take a look at the following resources:

- [🔥Live Demo](https://demo.particle.netwok) - feature demonstration and custom styling.
- [Docs](https://developers.particle.network/api-reference/connect/desktop/web) - learn about `@particle-network/connectkit` features and API.

### Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
