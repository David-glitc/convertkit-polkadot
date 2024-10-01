/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
dotenv.config();

import { Sdk } from "@unique-nft/sdk/full";
// import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";


export async function initSubstrate() {
  const { NEXT_PUBLIC_SUBSTRATE_SEED, NEXT_PUBLIC_REST_URL, NEXT_PUBLIC_CONTRACT_ADDRESS, NEXT_PUBLIC_COLLECTION_ID } =
    process.env;
  console.log(NEXT_PUBLIC_REST_URL);
  console.log(NEXT_PUBLIC_SUBSTRATE_SEED);
  console.log(NEXT_PUBLIC_CONTRACT_ADDRESS);
  console.log(NEXT_PUBLIC_COLLECTION_ID); 

  // if (!NEXT_PUBLIC_REST_URL) {
  //   console.log("NEXT_PUBLIC_REST_URL not found");
  //   process.exit(-1);
  // }

  // if (!NEXT_PUBLIC_SUBSTRATE_SEED) {
  //   console.log("NEXT_PUBLIC_SUBSTRATE_SEED not found");
  //   process.exit(-1);
  // }

  // if (!NEXT_PUBLIC_CONTRACT_ADDRESS) {
  //   console.log("NEXT_PUBLIC_CONTRACT_ADDRESS not found");
  //   process.exit(-1);
  // }

  // if (!NEXT_PUBLIC_COLLECTION_ID) {
  //   console.log("NEXT_PUBLIC_COLLECTION_ID not found");
  //   process.exit(-1);
  // }
  // const { KeyringProvider } = await import('@unique-nft/accounts/keyring');
  // const keyringProvider = new KeyringProvider();
  // await keyringProvider.init();
  // const account = (await keyringProvider.getAccounts())[0];

  const sdk = new Sdk({
    baseUrl: "https://rest.unique.network/unique/v1",
  })

  return {
    sdk,
    // address: userAddress.address,
  };
}
