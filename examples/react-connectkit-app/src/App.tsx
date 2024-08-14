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
        Particle Demo
      </a>

      <a
        href="https://developers.particle.network"
        target="_blank"
        rel="noreferrer"
        className="text-2xl text-purple-500"
      >
        Document
      </a>

      <img src={demo} className="demo" alt="demo"></img>
    </div>
  );
}

export default App;
