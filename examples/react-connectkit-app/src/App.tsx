import { useAccount } from '@particle-network/connectkit';
import demoImage from './assets/demo.gif';

import Demo from './components/demo';
import Header from './components/header';

import styles from './App.module.css';

function App() {
  const { isConnected } = useAccount();

  return (
    <>
      <Header />
      <main className={styles['main-content']}>
        {isConnected ? <Demo /> : <img src={demoImage} style={{ width: '100%' }} />}
      </main>
    </>
  );
}

export default App;
