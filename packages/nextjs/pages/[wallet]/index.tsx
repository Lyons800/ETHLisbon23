import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const WalletPage = () => {
  const router = useRouter();
  const { wallet } = router.query;
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    // Fetch balance for wallet from API
    const fetchBalance = async () => {
      const response = await fetch(`/api/wallets/${wallet}/balance`);
      const data = await response.json();
      setBalance(data.balance);
    };
    fetchBalance();
  }, [wallet]);

  return (
    <div>
      <h1>Wallet: {wallet}</h1>
      <p>Balance: {balance} ETH</p>
    </div>
  );
};

export default WalletPage;
