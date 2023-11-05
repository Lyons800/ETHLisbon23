import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { prepareSendTransaction, sendTransaction } from "@wagmi/core";
import { ethers } from "ethers";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useAccount } from "wagmi";
import { CheckIcon } from "@heroicons/react/24/solid";

const queryClient = new QueryClient()



const pollTaskStatus = ({ taskId }) => {
  return fetch(`https://relay.gelato.digital/tasks/status/${taskId}`).then(res => res.json());
};

const surveyTokenAbi = [
  // ... other contract methods,
  "function submitSurvey(address respondent, string surveyMetadataURI) public returns (uint256)",
];

const surveyTokenAddress = "0x5d55066aBCFaccAB00899a76D3281390Be10CD87";

const safeAddress = "0x3595c48501FC819ee506907ffd912BC2936e36e5";

const privateKey = "<ADD PRIVATE KEY>";

// Function to execute a transaction with gas fees paid by Gelato SyncFee
async function executeGelatoSyncFeeTransaction(respondentAddress: string, surveyMetadataURI: string) {
  // RPC URL of the Gnisis Chain
  const RPC_URL = "https://rpc.gnosischain.com/";
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  console.log("privateKey",privateKey )
  const signer = new ethers.Wallet(privateKey, provider);

  // Create an instance of the contract
  const surveyTokenContract = new ethers.Contract(surveyTokenAddress, surveyTokenAbi, signer);

  // Encode the function call
  const data = surveyTokenContract.interface.encodeFunctionData("submitSurvey", [respondentAddress, surveyMetadataURI]);

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
  // Return the response which presumably contains the Task ID
  return response;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function StepperWraper() {

  return (
    <QueryClientProvider client={queryClient}>
      <Stepper />
    </QueryClientProvider>
  );
}

function Stepper() {
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState(address ? 1 : 0);
  const [taskId, setTaskId] = useState<any>(null);

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
  queryKey: ['taskStatus', taskId], 
  queryFn: () => { 
    console.log("Polling")
    pollTaskStatus({ taskId })
   },
  enabled: !!taskId
})
  

  

  useEffect(() => {
    if (address && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [address, currentStep]);

  const steps = [
    {
      id: "01",
      name: "Connect Wallet",
      description: "Ensure your wallet is connected.",
      status: currentStep === 0 ? "current" : "complete",
    },
    {
      id: "02",
      name: "Proceed",
      description: "Move to the next step.",
      status: currentStep === 1 ? "current" : "upcoming",
    },
    {
      id: "03",
      name: "Mint Your Credential",
      description: "Get your unique credential.",
      status: currentStep === 2 ? "current" : "upcoming",
    },
  ];

  const handleVerificationNext = () => {
    // Add verification logic here if needed
    setCurrentStep(2);
  };

  const handleMint = async () => {
    // Add minting logic here
    console.log("Credential minted!");
    try {
      const response = await executeGelatoSyncFeeTransaction(
        "0x342822C90cE6Cb1414811D503357a732ae5EfF0F",
        "HELLO WORLD",
      );
      console.log(response);
      if (response.taskId) {
        // Start polling for the transaction status
        setTaskId(response.taskId);
      }
    } catch (error) {
      console.error("Failed to execute transaction:", error);
      setTaskId(null);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal }) => {
              if (!account || !chain) {
                return (
                  <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }
              setCurrentStep(1); // Automatically advance to next step upon successful connection
              return null;
            }}
          </ConnectButton.Custom>
        );
      case 1:
        return (
          <div>
            <p>Verification process content here...</p>
            <button className="btn btn-secondary btn-sm" onClick={handleVerificationNext}>
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center">
            {isLoading ? (
              <button className="btn btn-sm" disabled>
                <span className="spinner-border spinner-border-sm me-2" />
                Loading...
              </button>
            ) : (
              <button className="btn btn-success btn-sm" onClick={handleMint}>
                Mint
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
        <ol
          role="list"
          className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
        >
          {steps.map((step, stepIdx) => {
            // Determine status of the current step for rendering
            let status = "upcoming";
            if (stepIdx < currentStep) {
              status = "complete";
            } else if (stepIdx === currentStep) {
              status = "current";
            }

            return (
              <li key={step.id} className="relative overflow-hidden lg:flex-1">
                <div
                  className={classNames(
                    stepIdx === 1 ? "rounded-t-md border-b-0" : "",
                    stepIdx === steps.length - 1 ? "rounded-b-md border-t-0" : "",
                    "overflow-hidden border border-gray-200 lg:border-0",
                  )}
                >
                  {status === "complete" ? (
                    <div className="group">
                      <span className="flex items-start px-6 py-5 text-sm font-medium">
                        <span className="flex-shrink-0">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                            <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                          </span>
                        </span>
                        <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                          <span className="text-sm font-medium">{step.name}</span>
                          <span className="text-sm font-medium text-gray-500">{step.description}</span>
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="group">
                      <span className="flex items-start px-6 py-5 text-sm font-medium">
                        <span className="flex-shrink-0">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                            <span className="text-gray-500">{step.id}</span>
                          </span>
                        </span>
                        <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                          <span className="text-sm font-medium text-gray-500">{step.name}</span>
                          <span className="text-sm font-medium text-gray-500">{step.description}</span>
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="p-4 bg-white rounded shadow-md mt-4">{renderStepContent()}</div>
    </div>
  );
}
