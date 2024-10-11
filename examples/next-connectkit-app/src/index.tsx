'use client';

import demoImage from '@/assets/demo.gif';
import Header from '@/components/header';
import { useAccount } from '@particle-network/connectkit';
import { isEVMChain } from '@particle-network/connectkit/chains';
import Image from 'next/image';
import Demo from './components/demo';
import styles from './index.module.css';

export default function Index() {
  const { isConnected, chain } = useAccount();

  return (
    <>
      <Header />
      <main className={styles['main-content']}>
        {isConnected && chain && isEVMChain(chain) ? (
          <Demo />
        ) : (
          <Image sizes='100%' src={demoImage} style={{ width: '100%' }} alt='demo' />
        )}
      </main>
    </>
  );
}
