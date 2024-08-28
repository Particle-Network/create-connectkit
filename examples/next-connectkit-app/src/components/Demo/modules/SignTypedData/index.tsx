'use client'

import { useState } from 'react';
import {
  useWallets,
  useAccount
} from "@particle-network/connectkit";
import { useToast } from '../../store/useGlobalState';
import Collapse from '../Collapse';
import Button from '../Button';
import { Textarea } from '../InputWrapper';
import styles from './index.module.css';

export default function SignTypedData() {
  const [primaryWallet] = useWallets();
  const toast = useToast()
  
  // Address tied to the connected wallet (or social login)
  const { address } = useAccount();

  const [signTypedDataValue, setSignTypedDataValue] = useState(
    `{
        domain: {
          name: 'NFT Marketplace',
          version: '1',
          chainId: 1,
          verifyingContract: '0x1234567890123456789012345678901234567890',
        },
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Order: [
            { name: 'maker', type: 'address' },
            { name: 'tokenContract', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'price', type: 'uint256' },
            { name: 'expirationTime', type: 'uint256' },
            { name: 'salt', type: 'uint256' },
          ],
        },
        primaryType: 'Order',
        message: {
          maker: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          tokenContract: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          tokenId: '123456',
          price: '1000000000000000000',
          expirationTime: '1690000000',
          salt: '31337',
        },
      }
  `
  );

  // Sign typed data
  const signTypedData = async () => {
    try {
      const walletClient = primaryWallet.getWalletClient();

      const signature = await walletClient.signTypedData({
        account: address as `0x${string}`,
        ...eval(`(${signTypedDataValue})`)
      });
      console.log('signature', signature);
      toast.current?.show(signature)
    } catch (error) {
      console.error("Error signing typed data:", error);
    }
  }

  return (
    <Collapse title="Sign Typed Data" activeIndex={3}>
      <div className={styles['collapse-content']}>
        <Textarea 
          type='textarea' 
          label="Message"
          value={signTypedDataValue}
          setValue={setSignTypedDataValue}
        />
        <Button className={styles['right-btn']} onClick={signTypedData}>SIGN</Button>
      </div>
    </Collapse>
  )
}