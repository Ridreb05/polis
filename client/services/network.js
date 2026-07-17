// Network configuration for the AIA testnet that Polis is deployed to.
export const AIA_TESTNET = {
  chainIdDecimal: 1320,
  chainIdHex: "0x528",
  chainName: "AIA Testnet",
  rpcUrl: "https://aia-dataseed1-testnet.aiachain.org/",
  explorerUrl: "https://testnet.aiascan.com",
  nativeCurrency: { name: "AIA", symbol: "AIA", decimals: 18 },
};

export function hasInjectedWallet() {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
}

/** Ensure the injected wallet is on the AIA testnet, adding it if unknown. */
export async function ensureNetwork() {
  if (!hasInjectedWallet()) return;
  const current = await window.ethereum.request({ method: "eth_chainId" });
  if (current === AIA_TESTNET.chainIdHex) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: AIA_TESTNET.chainIdHex }],
    });
  } catch (err) {
    // 4902 = chain not added to the wallet yet.
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: AIA_TESTNET.chainIdHex,
            chainName: AIA_TESTNET.chainName,
            rpcUrls: [AIA_TESTNET.rpcUrl],
            nativeCurrency: AIA_TESTNET.nativeCurrency,
            blockExplorerUrls: [AIA_TESTNET.explorerUrl],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export function explorerAddress(address) {
  return `${AIA_TESTNET.explorerUrl}/address/${address}`;
}
