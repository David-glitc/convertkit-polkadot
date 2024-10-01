/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react"
import { ApiPromise, WsProvider } from "@polkadot/api"

type NFTProps = {
  userAddress: string
}

export function UniqueNFTs({ userAddress }: NFTProps) {
  const [nfts, setNfts] = useState<unknown>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const wsProvider = new WsProvider("wss://rpc-opal.unique.network")
        const api = await ApiPromise.create({ provider: wsProvider })

        // Query NFTs for the user address (replace with actual method for fetching NFTs)
        const nftsOwned = await api.query.nft.addressTokens(userAddress,"717")

        // const nftData = nftsOwned.map(([key, value]) => {
        //   // Extract NFT details here, adapt as necessary
        //   return { key, value }
        // })

        console.log(nftsOwned)
        setNfts(nftsOwned)
      } catch (error) {
        setError("Failed to fetch NFTs")
      }
    }

    fetchNFTs()
  }, [userAddress])

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h3>NFTs owned by {userAddress}</h3>
      {Array.isArray(nfts) ? nfts.map((nft, index) => (
        <div key={index}>{/* Render NFT item */}</div>
      )) : null}
    </div>
  )
}
