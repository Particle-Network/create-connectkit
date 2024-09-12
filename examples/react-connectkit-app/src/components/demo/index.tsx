import React, { useRef } from 'react';
import SignMessage from './modules/SignMessage';
import SendNativeToken from './modules/SendNativeToken';
import SignTypedData from './modules/SignTypedData';
import ContractInteraction from './modules/ContractInteraction';
import Divider from './modules/Divider';
import { ContextProvider } from './store/useGlobalState';
import Toast from './modules/Toast';

import styles from './index.module.css'


export default function Demo() {
  const ToastRef: any = useRef(null);
  return (
    <ContextProvider toast={ToastRef}>
      <div className={styles.demo}>
        <SendNativeToken />
        <Divider />
        <SignMessage activeIndex={2} />
        <Divider />
        <SignTypedData />
        <Divider />
        <ContractInteraction />
      </div>
      <Toast ref={ToastRef} />
    </ContextProvider>
  )
}