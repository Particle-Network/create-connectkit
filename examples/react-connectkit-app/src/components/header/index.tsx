import logo from '@/assets/images/logo.png';
import { ConnectButton } from '@particle-network/connectkit';
import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles['nav-start']}>
          <div className={styles['nav-start-slogan']}>particle network</div>
          <img src={logo} width={36} height={36} alt='logo'></img>
        </div>
        <div className={styles['nav-content']}>
          <a
            href='https://developers.particle.network/guides/wallet-as-a-service/waas/connect/web-quickstart'
            target='_blank'
            className={styles['nav-item']}
            rel='noreferrer'
          >
            Docs
          </a>
          <a href='https://github.com/Particle-Network' target='_blank' className={styles['nav-item']} rel='noreferrer'>
            Github
          </a>
          <a href='https://particle.network/' target='_blank' className={styles['nav-item']} rel='noreferrer'>
            About
          </a>
          <a href='https://demo.particle.network/' target='_blank' className={styles['nav-item']} rel='noreferrer'>
            Demo
          </a>
        </div>
        <div className={styles['nav-end']}>
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}
