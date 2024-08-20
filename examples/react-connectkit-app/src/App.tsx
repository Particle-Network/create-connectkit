import { ConnectButton } from '@particle-network/connectkit';
import './App.css';
import demo from './assets/demo.gif';

function App() {
  return (
    <div className="App">
      <div className="connect-btn-container">
        <ConnectButton />
      </div>

      <a href="https://demo.particle.network" target="_blank" rel="noreferrer" className="text-2xl text-purple-500">
        Particle Connect Demo
      </a>

      <a
        href="https://developers.particle.network/guides/wallet-as-a-service/waas/connect/web-quickstart"
        target="_blank"
        rel="noreferrer"
        className="text-2xl text-purple-500"
      >
        Particle Connect Docs
      </a>

      <img src={demo} className="demo" alt="demo"></img>
    </div>
  );
}

export default App;
