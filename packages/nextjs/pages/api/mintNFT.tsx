// pages/api/executeTransaction.js
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

const surveyTokenAbi = [
  // ... other contract methods,
  "function submitSurvey(address respondent, string surveyMetadataURI) public returns (uint256)",
];

const surveyTokenAddress = "0x5d55066aBCFaccAB00899a76D3281390Be10CD87";

const safeAddress = "0x3595c48501FC819ee506907ffd912BC2936e36e5";

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Extract parameters from the request body
    const { respondentAddress, surveyMetadataURI } = req.body;

    try {
      // Add your server-side logic here...
      const RPC_URL = "https://rpc.gnosischain.com/";
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      //@ts-ignore
      const signer = new ethers.Wallet(privateKey, provider);
      // ... rest of your existing function logic

      // Create an instance of the contract
      const surveyTokenContract = new ethers.Contract(surveyTokenAddress, surveyTokenAbi, signer);

      // Encode the function call
      const data = surveyTokenContract.interface.encodeFunctionData("submitSurvey", [
        respondentAddress,
        surveyMetadataURI,
      ]);

      // Prepare the transaction object
      const transactions: MetaTransactionData[] = [
        {
          to: surveyTokenAddress,
          data: data,
          value: "0",
        },
      ];

      // Create the Protocol Kit and Relay Kit instances
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });

      const safeSDK = await Safe.create({
        ethAdapter,
        safeAddress,
      });

      const relayKit = new GelatoRelayPack();

      // Prepare the transaction
      const safeTransaction = await relayKit.createRelayedTransaction({ safe: safeSDK, transactions });
      const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);

      // Send the transaction to the relay
      const response = await relayKit.executeRelayTransaction(signedSafeTransaction, safeSDK);
      console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`);

      // Respond with the result
      res.status(200).json(response);
    } catch (error) {
      console.error("Failed to execute transaction:", error);
      res.status(500).json({ error: "Failed to execute transaction" });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// The rest of your executeGelatoSyncFeeTransaction function logic goes here
