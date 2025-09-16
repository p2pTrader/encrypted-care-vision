import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Encrypted Care Vision',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475',
  chains: [sepolia, mainnet],
  ssr: false,
});

export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';
export const chainId = parseInt(import.meta.env.VITE_CHAIN_ID || '11155111');
