import BinanceChain from '../../components/Svg/Icons/BinanceChain';
import Blocto from '../../components/Svg/Icons/Blocto';
import Brave from '../../components/Svg/Icons/Brave';
import Coin98 from '../../components/Svg/Icons/Coin98';
import CoinbaseWallet from '../../components/Svg/Icons/CoinbaseWallet';
import MathWallet from '../../components/Svg/Icons/MathWallet';
import Metamask from '../../components/Svg/Icons/Metamask';
import Opera from '../../components/Svg/Icons/Opera';
import SafePal from '../../components/Svg/Icons/SafePal';
import TokenPocket from '../../components/Svg/Icons/TokenPocket';
import TrustWallet from '../../components/Svg/Icons/TrustWallet';
import WalletConnect from '../../components/Svg/Icons/WalletConnect';
import { Config, ConnectorNames } from './types';

const connectors: Config[] = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: ConnectorNames.MetaMask,
    priority: 1,
    href: "https://metamask.app.link/dapp/kazamaswap.finance/",
  },
  {
    title: "Binance Wallet",
    icon: BinanceChain,
    connectorId: ConnectorNames.BSC,
    priority: 2,
  },
  {
    title: "Coinbase Wallet",
    icon: CoinbaseWallet,
    connectorId: ConnectorNames.WalletLink,
    priority: 3,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: ConnectorNames.Injected,
    priority: 4,
    href: "https://link.trustwallet.com/open_url?url=https://kazamaswap.finance/",
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: ConnectorNames.WalletConnect,
    priority: 5,
  },
  {
    title: "Opera Wallet",
    icon: Opera,
    connectorId: ConnectorNames.Injected,
    priority: () => {
      return typeof window !== "undefined" && Boolean(window.ethereum?.isOpera) ? 0 : 6;
    },
    installed: typeof window !== "undefined" && Boolean(window.ethereum?.isOpera),
    href: "https://www.opera.com/crypto/next",
  },
  {
    title: "Brave Wallet",
    icon: Brave,
    connectorId: ConnectorNames.Injected,
    priority: () => {
      return typeof window !== "undefined" && Boolean(window.ethereum?.isBraveWallet) ? 0 : 6;
    },
    installed: typeof window !== "undefined" && Boolean(window.ethereum?.isBraveWallet),
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== "undefined" && Boolean(window.ethereum?.isMathWallet),
    priority: () => {
      // @ts-ignore
      return typeof window !== "undefined" && Boolean(window.ethereum?.isMathWallet) ? 0 : 999;
    },
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    connectorId: ConnectorNames.Injected,
    priority: () => {
      return typeof window !== "undefined" && Boolean(window.ethereum?.isTokenPocket) ? 0 : 999;
    },
    installed: typeof window !== "undefined" && Boolean(window.ethereum?.isTokenPocket),
  },
  {
    title: "SafePal",
    icon: SafePal,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== "undefined" && Boolean(window.ethereum?.isSafePal),
    priority: () => {
      // @ts-ignore
      return typeof window !== "undefined" && Boolean(window.ethereum?.isSafePal) ? 0 : 999;
    },
  },
  {
    title: "Coin98",
    icon: Coin98,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== "undefined" && (Boolean(window.ethereum?.isCoin98) || Boolean(window.coin98)),
    priority: () => {
      // @ts-ignore
      return typeof window !== "undefined" && (Boolean(window.ethereum?.isCoin98) || Boolean(window.coin98)) ? 0 : 999;
    },
  },
  {
    title: "Blocto",
    icon: Blocto,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== "undefined" && Boolean(window.ethereum?.isBlocto),
    priority: () => {
      // @ts-ignore
      return typeof window !== "undefined" && Boolean(window.ethereum?.isBlocto) ? 0 : 999;
    },
  },
];

export default connectors;
export const connectorLocalStorageKey = "connectorIdv2";
export const walletLocalStorageKey = "wallet";

export const walletConnectConfig = connectors.find((c) => c.title === "WalletConnect");
