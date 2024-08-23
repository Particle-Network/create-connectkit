'use client'

import Image from 'next/image';
import Header from './components/header';
import demoImage from '@/assets/demo.gif';
import Collapse from './components/Collapse';
import Divider from './components/Divider';
import { Input, Textarea, Selector } from './components/InputWrapper';
import {
  useAccount,
} from "@particle-network/connectkit";
import SignMessage from './components/SignMessage';
import SendNativeToken from './components/SendNativeToken';
import SignTypedData from './components/SignTypedData';
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
              <Collapse title="Contract Interaction" activeIndex={4}>
                <div className={styles['collapse-content']}>
                  <Textarea placeholder="Please enter the ABI" tags={['ERC20', 'ERC721', 'ERC1155']}/>
                  <Input label="Contract Address" placeholder="0x..." />
                  <Selector label="Method" placeholder="Select a method" options={
                    [
                      {
                        label: 'balanceOf',
                        value: 'balanceOf'
                      },
                      {
                        label: 'transfer',
                        value: 'transfer'
                      },
                      {
                        label: 'transferFrom',
                        value: 'transferFrom'
                      },
                      {
                        label: 'approve',
                        value: 'approve'
                      },
                      {
                        label: 'totalSupply',
                        value: 'totalSupply'
                      }
                    ]
                  } />
                </div>
              </Collapse>
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