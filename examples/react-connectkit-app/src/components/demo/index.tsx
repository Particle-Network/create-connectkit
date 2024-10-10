import ContractInteraction from './modules/ContractInteraction';
import Divider from './modules/Divider';
import SendNativeToken from './modules/SendNativeToken';
import SignMessage from './modules/SignMessage';
import SignTypedData from './modules/SignTypedData';
import { ContextProvider } from './store/useGlobalState';

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
