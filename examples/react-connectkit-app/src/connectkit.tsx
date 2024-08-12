'use client';

import { ConnectKitProvider, createConfig } from '@particle-network/connectkit';
import { authWalletConnectors } from '@particle-network/connectkit/auth';
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  linea,
  mainnet,
  optimism,
  polygon,
  solana,
} from '@particle-network/connectkit/chains';
import { evmWalletConnectors } from '@particle-network/connectkit/evm';
import { solanaWalletConnectors } from '@particle-network/connectkit/solana';
import { EntryPosition, wallet } from '@particle-network/connectkit/wallet';
import React from 'react';

const projectId = process.env.REACT_APP_PROJECT_ID as string;
const clientKey = process.env.REACT_APP_CLIENT_KEY as string;
const appId = process.env.REACT_APP_APP_ID as string;
const walletConnectProjectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string;

if (!projectId || !clientKey || !appId) {
  throw new Error('Please configure the Particle project in .env first!');
}

const config = createConfig({
  projectId,
  clientKey,
  appId,
  appearance: {
    recommendedWallets: [
      { walletId: 'metaMask', label: 'Recommended' },
      { walletId: 'coinbaseWallet', label: 'popular' },
    ],
    language: 'en-US',
  },
  walletConnectors: [
    evmWalletConnectors({
      metadata: { name: 'My App', icon: '', description: '', url: '' },
      walletConnectProjectId: walletConnectProjectId,
    }),
    authWalletConnectors(),
    solanaWalletConnectors(),
  ],
  plugins: [
    wallet({
      visible: false,
      entryPosition: EntryPosition.BR,
    }),
  ],
  chains: [mainnet, base, arbitrum, avalanche, linea, bsc, optimism, polygon, solana],
});

// Wrap your application with this component.
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
