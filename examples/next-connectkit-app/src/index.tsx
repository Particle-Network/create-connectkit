'use client'

import Image from 'next/image';
import Header from './components/header';
import demoImage from '@/assets/demo.gif';
import {
  useAccount,
} from "@particle-network/connectkit";
import Demo from './components/Demo';

import styles from './index.module.css'

export default function Index() {
  const { isConnected } = useAccount();

  return (
    <>
      <Header />
      <main className={styles['main-content']}>
        {
          isConnected ? (
            <Demo />
          ) : (
            <Image sizes='100%' src={demoImage} alt='demo' />
          )
        }
      </main>
    </>
  )
}