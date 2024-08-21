import demo from '@/assets/demo.gif';
import { ConnectButton } from '@particle-network/connectkit';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container min-h-screen flex justify-center items-center mx-auto flex-col gap-4">
      <div className="absolute top-6 right-6">
        <ConnectButton />
      </div>

      <Link href="https://demo.particle.network" target="_blank" className="text-2xl text-purple-500">
        Particle Connect Demo
      </Link>

      <Link href="https://developers.particle.network/guides/wallet-as-a-service/waas/connect/web-quickstart" target="_blank" className="text-2xl text-purple-500">
        Particle Connect Docs
      </Link>

      <Image src={demo} className="max-lg:w-full max-w-[800px]" alt="demo"></Image>
    </div>
  );
}
