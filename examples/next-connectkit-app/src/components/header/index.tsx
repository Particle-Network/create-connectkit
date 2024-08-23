import Image from 'next/image'
import logo from '@/assets/images/logo.png';
import Button from '../Button';
import {
  ConnectButton,
  useWallets,
  useAccount,
} from "@particle-network/connectkit";

import styles from './index.module.css';

export default function Header() {

return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles['nav-start']}>
          <Image src={logo} width={150} height={36} alt="logo"></Image>
        </div>
        <div className={styles['nav-content']}>
          <div className={styles['nav-item']}>Docs</div>
          <div className={styles['nav-item']}>Github</div>
          <div className={styles['nav-item']}>About</div>
          <div className={styles['nav-item']}>Demo</div>
        </div>
        <div className={styles['nav-end']}>
          <ConnectButton />
        </div>
      </nav>
    </div>  
)
}