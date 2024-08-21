import {
  ConnectButton,
  useWallets,
  useAccount,
} from "@particle-network/connectkit";
import { useState } from "react";
import './App.css';
import demo from './assets/demo.gif';

function App() {
  const [primaryWallet] = useWallets();
  const [signedMessage, setSignedMessage] = useState<string | null>(null);

  const { address } = useAccount();

  // Sign a message
  const signMessage = async () => {
    try {
      const walletClient = primaryWallet.getWalletClient();

      const message = "Gm Particle Network. I am signing a message!";
      const signature = await walletClient.signMessage({
        message,
        account: address as `0x${string}`,
      });
      setSignedMessage(signature);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <div className="container min-h-screen flex justify-center items-center mx-auto flex-col gap-6">
      <div className="absolute top-6 right-6">
        <ConnectButton />
      </div>
      <div className="border border-purple-500 p-8 rounded-lg flex flex-col gap-4 items-center bg-black bg-opacity-80 shadow-lg mt-10">
        <h2 className="text-2xl">Learn more about Particle Connect</h2>
        <Link
          href="https://demo.particle.network"
          target="_blank"
          className="text-xl text-purple-400 hover:text-purple-200 transition duration-300 ease-in-out"
        >
          Particle Connect Demo
        </Link>

        <Link
          href="https://developers.particle.network/guides/wallet-as-a-service/waas/connect/web-quickstart"
          target="_blank"
          className="text-xl text-purple-400 hover:text-purple-200 transition duration-300 ease-in-out"
        >
          Particle Connect Docs
        </Link>
      </div>

      <div className="border border-purple-500 p-6 rounded-lg flex flex-col gap-4 items-center bg-black bg-opacity-80 shadow-lg mt-10">
        <h2 className="text-2xl text-white mb-4">Sign a Message</h2>
        <button
          onClick={signMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-400 transition duration-300 ease-in-out"
        >
          Sign Message
        </button>
        {signedMessage && (
          <div className="mt-4 text-white break-all">
            <p>Signed Message:</p>
            <p>{signedMessage}</p>
            <p>From:</p>
            <p></p>
            <p>{address}</p>
          </div>
        )}
      </div>

      <Image
        src={demo}
        className="max-lg:w-full max-w-[800px] mt-8"
        alt="demo"
      ></Image>
    </div>
  );
}

export default App;
