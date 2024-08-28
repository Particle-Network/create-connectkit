'use client'

import { useState } from 'react';
import {
  useWallets,
  useAccount
} from "@particle-network/connectkit";
import Collapse from '../Collapse';
import Button from '../Button';
import { Textarea } from '../InputWrapper';
import Toast from '../Toast';
import styles from './index.module.css';

type SignMessageProps = {
  activeIndex: number;
}

export default function SignMessage(props: SignMessageProps) {
  const [signValue, setSignValue] = useState("\nHello Particle Network!💰💰💰 \n\nThe fastest path from ideas to deployment in a single workflow for high performance dApps.\n\nhttps://particle.network");
  const [primaryWallet] = useWallets();
  // Address tied to the connected wallet (or social login)
  const { address } = useAccount();

  // Sign a message
  const signMessage = async () => {
    try {
      const walletClient = primaryWallet.getWalletClient();
      
      const signature = await walletClient.signMessage({
        message: signValue,
        account: address as `0x${string}`,
      });
      console.log('signature', signature)
    } catch (error) {
      console.error("Error signing message:", error);
    }
  }

  return (
    <Collapse title="Sign Message" activeIndex={props.activeIndex}>
      <div className={styles['collapse-content']}>
        <Textarea type='textarea' label="Message" value={signValue} setValue={setSignValue} />
        <Button className={styles['right-btn']} onClick={signMessage}>SIGN</Button>
      </div>
    </Collapse>
  )
}