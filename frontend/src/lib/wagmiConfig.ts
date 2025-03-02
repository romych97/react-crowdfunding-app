import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import dotenv from 'dotenv';

dotenv.config();

console.log("🚀 ~ ALCHEMY_API_KEY:", process.env.NEXT_PUBLIC_ALCHEMY_KEY)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
  },
})