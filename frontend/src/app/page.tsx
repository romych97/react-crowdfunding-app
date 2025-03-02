import WalletConnector from "@/components/Login/WalletConnector";
import Donate from "@/components/Donate/Donate";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div>
        <Donate />
      </div>
      <div>
        <h1 className="text-2xl font-bold">Decentralized Crowdfunding</h1>
        <WalletConnector />
      </div>
    </main>
  );
}
