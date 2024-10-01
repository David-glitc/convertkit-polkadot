/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { AccountTokensResult } from '@unique-nft/substrate-client/tokens';
import { initSubstrate } from '../lib/api';
import { TokenByIdResponse } from '@unique-nft/sdk/full';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Box } from '@mui/material';

type UniqueNFTsProps = {
  userAddress: string;
  collectionId: number | null;
};

export function UniqueNFTs({userAddress, collectionId}: UniqueNFTsProps) {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);

      try {
        // Initialize SDK
        const { sdk } = await initSubstrate();
     
        // Fetch the NFTs owned by the user
        const tokensResult: AccountTokensResult = await sdk.token.accountTokens({
          collectionId: collectionId || 717, // Adjust collectionId as per your needs
          address: userAddress,
        });

        if (tokensResult.tokens && tokensResult.tokens.length > 0) {
          const fetchedNFTs = await Promise.all(
            tokensResult.tokens.map(async (token) => {
              const nftData = await sdk.token.get({
                collectionId: token.collectionId,
                tokenId: token.tokenId,
              });

              return nftData;
            })
          );

          setNfts(fetchedNFTs);
        } else {
          setNfts([]);
        }
      } catch (err) {
        setError('Failed to fetch NFTs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userAddress) {
      fetchNFTs();
    }
  }, [userAddress]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!nfts.length) {
    return <p>No NFTs found for this address.</p>;
  }

  return (
    <div>

      {loading ? (
        <p>Loading NFTs...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <Grid container spacing={3}>
        {nfts.map((nft: TokenByIdResponse, index: number) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={nft.image?.fullUrl || 'https://via.placeholder.com/200'}
              alt={`NFT ${nft.tokenId}`}
            />
            <CardContent>
              <Typography variant="h6">Collection ID: {nft.collectionId}</Typography>
              <Typography variant="body2">Token ID: {nft.tokenId}</Typography>
              <Typography variant="body2">Owner: {nft.owner}</Typography>
              {/* {nft.attributes && Object.keys(nft.attributes).map((key) => (
                <Typography variant="body2" key={key}>
                  {key}: {nft.attributes[]}
                </Typography>
              ))} */}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
      )} 
    
    </div>
  );
}
