import logo from '@/assets/images/logo.png';
import { ConnectButton } from '@particle-network/connectkit';
import Image from 'next/image';
import Link from 'next/link';

import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles['nav-start']}>
          <div className={styles['nav-start-slogan']}>particle network</div>
          <Image src={logo} width={36} height={36} alt='logo'></Image>
        </div>
        <div className={styles['nav-content']}>
          <Link
            href='https://developers.particle.network/guides/wallet-as-a-service/waas/connect/web-quickstart'
            target='_blank'
          >
            <div className={styles['nav-item']}>Docs</div>
          </Link>
          <Link href='https://github.com/Particle-Network' target='_blank'>
            <div className={styles['nav-item']}>Github</div>
          </Link>
          <Link href='https://particle.network/' target='_blank'>
            <div className={styles['nav-item']}>About</div>
          </Link>
          <Link href='https://demo.particle.network/' target='_blank'>
            <div className={styles['nav-item']}>Demo</div>
          </Link>
        </div>
        <div className={styles['nav-end']}>
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}
