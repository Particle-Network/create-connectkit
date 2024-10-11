import { useAccount, useWallets } from '@particle-network/connectkit';
import { useState } from 'react';
import Button from '../Button';
import Collapse from '../Collapse';
import { Textarea } from '../InputWrapper';

import styles from './index.module.css';

type SignMessageProps = {
  activeIndex: number;
};

export default function SignMessage(props: SignMessageProps) {
  const [signValue, setSignValue] = useState(
    '\nHello Particle Network!💰💰💰 \n\nThe fastest path from ideas to deployment in a single workflow for high performance dApps.\n\nhttps://particle.network'
  );
  const [primaryWallet] = useWallets();
  // Address tied to the connected wallet (or social login)
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  // Sign a message
  const signMessage = async () => {
    try {
      setLoading(true);
      setResult('');
      const walletClient = primaryWallet.getWalletClient();

      const signature = await walletClient.signMessage({
        message: signValue,
        account: address as `0x${string}`,
      });

      setResult(`Signature: ${signature}`);
    } catch (error) {
      console.error('Error signing message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapse title='Sign Message' activeIndex={props.activeIndex}>
      <div className={styles['collapse-content']}>
        <Textarea type='textarea' label='Message' value={signValue} setValue={setSignValue} />
        <Button loading={loading} className={styles['right-btn']} onClick={signMessage}>
          SIGN
        </Button>
      </div>
      {result ? <div className={styles.result}>{result}</div> : null}
    </Collapse>
  );
}
