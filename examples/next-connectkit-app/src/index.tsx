'use client'

import Image from 'next/image';
import Header from './components/header';
import demoImage from '@/assets/demo.gif';
import Divider from './components/Divider';
import {
  useAccount,
} from "@particle-network/connectkit";
import SignMessage from './components/SignMessage';
import SendNativeToken from './components/SendNativeToken';
import SignTypedData from './components/SignTypedData';
import ContractInteraction from './components/ContractInteraction';
import { ContextProvider } from './store/useGlobalState';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import styles from './index.module.css'

export default function Index() {
  const { address, isConnected } = useAccount();

  return (
    <ContextProvider>
      <Header />
      <main className={styles['main-content']}>
        {
          isConnected ? (
            <div className={styles.demo}>
              <SendNativeToken />
              <Divider />
              <SignMessage activeIndex={2} />
              <Divider />
              <SignTypedData />
              <Divider />
              <ContractInteraction />
            </div>
          ) : (
            <Image sizes='100%' src={demoImage} alt='demo' />
          )
        }
       
      </main>
      <ToastContainer />
    </ContextProvider>
  )
}