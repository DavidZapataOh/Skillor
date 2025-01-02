import { useState, useEffect } from 'react';
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from 'ethers';

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export function useTokenBalance() {
  const { user } = usePrivy();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.wallet?.address) return;

      try {
        const provider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL
        );

        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
          ERC20_ABI,
          provider
        );

        const [rawBalance, decimals] = await Promise.all([
          contract.balanceOf(user.wallet.address),
          contract.decimals()
        ]);

        const formattedBalance = parseFloat(
          ethers.formatUnits(rawBalance, decimals)
        );

        setBalance(formattedBalance);
      } catch (error) {
        console.error('Error fetching token balance:', error);
        setBalance(0);
      }
    };

    fetchBalance();
    
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [user?.wallet?.address]);

  return balance;
} 