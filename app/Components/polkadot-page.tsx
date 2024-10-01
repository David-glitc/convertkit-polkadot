/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import Papa from "papaparse"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Result } from "./result"
import { UniqueNFTs } from "./NFTs"


const parachains = [
  { name: "Unique Network", prefix: 7391 },
  { name: "Acala", prefix: 7875 },
  { name: "Moonbeam", prefix: 1284 },
  { name: "Phala Network", prefix: 10006 },
  { name: "Astar", prefix: 2006 },
  { name: "Parallel", prefix: 10000 },
]

export function PolkadotPageComponent() {
  const [polkadotAddress, setPolkadotAddress] = useState("")
  const [connectedAddress, setConnectedAddress] = useState("")
  const [connectedAccount, setConnectedAccount] = useState<InjectedAccountWithMeta | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [convertedAddresses, setConvertedAddresses] = useState<string[]>([])
  const [selectedChain, setSelectedChain] = useState<number>(7391)
  const [addresses, setAddresses] = useState<string[]>([])
  const [showFileInput, setShowFileInput] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [collectionId, setCollectionId] = useState<number | null>(null)
  const [customAddress, setCustomAddress] = useState<string>("")

  useEffect(() => {
    setIsClient(true);
  }, [connectedAccount]);

  useEffect(() => {
    if (connectedAccount) {
      handleConvert([connectedAccount.address])
    }
  }, [connectedAccount, selectedChain])

  const connectWallet = async () => {
    if (typeof window === "undefined") return

    try {
      const { web3Enable, web3Accounts } = await import("@polkadot/extension-dapp")
      const extensions = await web3Enable("ConvertKit-Polkadot")
      if (extensions.length === 0) {
        setErrorMessage("No Polkadot extension detected. Please install Polkadot{.js} extension.")
        return
      }

      const accounts = await web3Accounts()
      if (accounts.length === 0) {
        setErrorMessage("No accounts found. Please add an account in your Polkadot extension.")
        return
      }

      const selectedAccount = accounts[0]
      setConnectedAccount(selectedAccount)
      setPolkadotAddress(selectedAccount.address)
      setConnectedAddress(selectedAccount.address)
      setErrorMessage("")
    } catch (error) {
      setErrorMessage("Failed to connect to wallet. Please try again.")
    }
  }

  const disconnectWallet = () => {
    setConnectedAccount(null)
    setPolkadotAddress("")
    setConnectedAddress("")
    setErrorMessage("")
  }

  const handleConvert = async (addressesToConvert: string[]) => {
    if (typeof window === "undefined") return

    try {
      const { decodeAddress, encodeAddress } = await import("@polkadot/util-crypto")
      const convertedAddrs = addressesToConvert.map((addr) => {
        const publicKey = decodeAddress(addr)
        return encodeAddress(publicKey, selectedChain)
      })
      setConvertedAddresses(convertedAddrs)
      setShowResult(true)
      setErrorMessage("")
    } catch (error) {
      setErrorMessage("Invalid Polkadot address(es). Please check and try again.")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedAddresses = results.data.map((row: unknown) => {
            return Array.isArray(row) ? row[0] : ""
          })
          setAddresses(parsedAddresses)
        },
        error: (error) => {
          setErrorMessage(`Error parsing CSV: ${error.message}`)
        },
      })
    }
  }

  const handleConvertClick = () => {
    const addressesToConvert = addresses.length > 0 ? addresses : polkadotAddress.split("\n").filter(Boolean)
    handleConvert(addressesToConvert)
  }

  if (!isClient) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="h-auto container0 overflow-hidden">
        <div className="container mx-auto max-w-screen-lg p-4 pt-20 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600">
                <CardTitle className="text-white text-2xl">Mass Address Converter</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {!connectedAccount ? (
                  <Button onClick={connectWallet} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                    Connect Polkadot Wallet
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p>Connected Account: <strong>{connectedAccount.meta.name}</strong></p>
                    <p>Polkadot Address: <strong>{connectedAddress}</strong></p>
                    <p>Converted Address: <strong>{convertedAddresses[0] || "Not converted yet"}</strong></p>
                    <Button variant="destructive" onClick={disconnectWallet} className="w-full">Disconnect Wallet</Button>
                  </div>
                )}

                {errorMessage && (
                  <motion.p
                    className="text-destructive"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {errorMessage}
                  </motion.p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="parachain-select">Select Parachain:</Label>
                  <Select value={selectedChain.toString()} onValueChange={(value) => setSelectedChain(Number(value))}>
                    <SelectTrigger id="parachain-select">
                      <SelectValue placeholder="Select a parachain" />
                    </SelectTrigger>
                    <SelectContent>
                      {parachains.map((chain) => (
                        <SelectItem key={chain.prefix} value={chain.prefix.toString()}>
                          {chain.name} ({chain.prefix})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collection-id">NFT Collection ID:</Label>
                  <Input
                    id="collection-id"
                    type="number"
                    value={collectionId || ""}
                    onChange={(e) => setCollectionId(parseInt(e.target.value, 10))}
                    placeholder="Enter NFT Collection ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-address">Custom Address (Optional):</Label>
                  <Input
                    id="custom-address"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Enter a custom address (optional)"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-file-input"
                    checked={showFileInput}
                    onCheckedChange={setShowFileInput}
                  />
                  <Label htmlFor="show-file-input">Use CSV file input</Label>
                </div>

                {!showFileInput && (
                  <div className="space-y-2">
                    <Label htmlFor="addresses">Polkadot Addresses (one per line):</Label>
                    <Textarea
                      id="addresses"
                      value={polkadotAddress}
                      onChange={(e) => setPolkadotAddress(e.target.value)}
                      placeholder="Enter Polkadot Addresses"
                      className="h-40"
                    />
                  </div>
                )}

                {showFileInput && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="file-upload">Upload CSV:</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input id="file-upload" type="file" accept=".csv" onChange={handleFileUpload} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload a CSV file with one column of addresses without headers and commas</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                )}

                <Button
                  onClick={handleConvertClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Convert Addresses
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {showResult && (
              <Result
                convertedAddresses={convertedAddresses}
                onClose={() => setShowResult(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
              <UniqueNFTs
                userAddress={customAddress || convertedAddresses[0]} // Use custom address if provided, otherwise use converted address
                collectionId={collectionId} // Pass collection ID to the NFT component
              />
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  )
}
