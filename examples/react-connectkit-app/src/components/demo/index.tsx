'use client';

import ContractInteraction from '@/components/demo/modules/ContractInteraction';
import Divider from '@/components/demo/modules/Divider';
import SendNativeToken from '@/components/demo/modules/SendNativeToken';
import SignMessage from '@/components/demo/modules/SignMessage';
import SignTypedData from '@/components/demo/modules/SignTypedData';
import { ContextProvider } from '@/components/demo/store/useGlobalState';

import styles from './index.module.css';

export default function Demo() {
  return (
    <ContextProvider>
      <div className={styles.demo}>
        <SendNativeToken />
        <Divider />
        <SignMessage activeIndex={2} />
        <Divider />
        <SignTypedData />
        <Divider />
        <ContractInteraction />
      </div>
    </ContextProvider>
  );
}
