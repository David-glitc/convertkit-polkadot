"use client";
import { useState, useEffect } from "react";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import Papa from "papaparse";



export default function PolkadotPage() {
  const [polkadotAddress, setPolkadotAddress] = useState("");
  const [uniqueAddress, setUniqueAddress] = useState("");
  const [connectedAccount, setConnectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [convertedAddresses, setConvertedAddresses] = useState<string[]>([]);
  const [selectedChain, setSelectedChain] = useState<number | null>(7391); // Default to Unique Network
  const [addresses, setAddresses] = useState<string[]>([]);
  const [parachains] = useState([
    { name: "Unique Network", prefix: 7391 },
    { name: "Acala", prefix: 7875 },
    { name: "Moonbeam", prefix: 1284 },
    { name: "Phala Network", prefix: 10006 },
    { name: "Astar", prefix: 2006 },
    { name: "Parallel", prefix: 10000 },
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to connect to the Polkadot Wallet
  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    try {
      const { web3Enable, web3Accounts } = await import(
        "@polkadot/extension-dapp"
      );
      const extensions = await web3Enable("Mass Address Converter");
      if (extensions.length === 0) {
        setErrorMessage(
          "No Polkadot extension detected. Please install Polkadot{.js} extension."
        );
        return;
      }

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        setErrorMessage(
          "No accounts found. Please add an account in your Polkadot extension."
        );
        return;
      }

      const selectedAccount = accounts[0];
      setConnectedAccount(selectedAccount);
      setPolkadotAddress(selectedAccount.address);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to connect to wallet. Please try again.");
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setConnectedAccount(null);
    setPolkadotAddress("");
    setUniqueAddress("");
    setErrorMessage("");
  };

  // Function to handle conversion
  const handleConvert = async () => {
    if (typeof window === "undefined") return;

    try {
      const { decodeAddress, encodeAddress } = await import(
        "@polkadot/util-crypto"
      );
      const publicKey = decodeAddress(polkadotAddress);
      const uniqueNetworkAddress = encodeAddress(publicKey, selectedChain!);
      console.log(uniqueNetworkAddress);
      setUniqueAddress(uniqueNetworkAddress);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Invalid Polkadot address. Please check and try again.");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Use PapaParse to parse the CSV file
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedAddresses = results.data.map((row: unknown) => {
            return Array.isArray(row) ? row[0] : "";
          });

          // Set the addresses in the state
          setAddresses(parsedAddresses);
        },
        error: (error) => {
          setErrorMessage(`Error parsing CSV: ${error.message}`);
        },
      });
    }
  };

  if (!isClient) {
    return null; // Return null or a spinner while waiting for the client-side to mount
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center h-screen p-6 pb-16 gap-14 overflow-y-hidden sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 dark:bg-stone-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Mass Address Converter</h1>

        {/* Connect Polkadot Wallet */}
        {!connectedAccount ? (
          <button
            onClick={connectWallet}
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Connect Polkadot Wallet
          </button>
        ) : (
          <div className="text-sm">
            <p>
              Connected Account: <strong>{connectedAccount.meta.name}</strong>
            </p>
            <p>
              Polkadot Address: <strong>{polkadotAddress}</strong>
            </p>
            <button
              onClick={disconnectWallet}
              className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-red-500 text-white hover:bg-red-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 mt-4"
            >
              Disconnect Wallet
            </button>
          </div>
        )}

        {errorMessage && (
          <p className="text-red-500 dark:text-red-400">{errorMessage}</p>
        )}

        {/* Dropdown to select the parachain */}
        <div>
          <label htmlFor="parachain-select" className="block mb-2">
            Select Parachain:
          </label>
          <select
            id="parachain-select"
            value={selectedChain ?? ""}
            onChange={(e) => setSelectedChain(Number(e.target.value))}
            className="rounded-full border px-4 py-2 text-sm sm:text-base"
          >
            {parachains.map((chain) => (
              <option key={chain.prefix} value={chain.prefix}>
                {chain.name} ({chain.prefix})
              </option>
            ))}
          </select>
        </div>

        {/* Text Area to input addresses */}
        <div className="w-full sm:w-96">
          <textarea
            value={addresses.join("\n") || ""}
            onChange={(e) =>
              setAddresses(e.target.value.split("\n").filter(Boolean))
            }
            placeholder="Enter Polkadot Addresses (one per line)"
            className="w-full h-40 rounded-lg border bg-white dark:bg-stone-900 text-gray-900 dark:text-gray-100 p-2 text-sm sm:text-base"
          />
        </div>

        {/* CSV Upload */}
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block mb-2 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Convert Addresses
        </button>

        {/* Display Converted Addresses */}
        {convertedAddresses.length > 0 && (
          <div className="w-full sm:w-96 mt-4 text-sm">
            <strong>Converted Addresses:</strong>
            <textarea
              value={convertedAddresses.join("\n")}
              readOnly
              className="w-full h-40 rounded-lg border bg-white dark:bg-stone-900 text-gray-900 dark:text-gray-100 p-2 mt-2 text-sm sm:text-base"
            />
          </div>
        )}
      </main>
    </div>
  );
}
