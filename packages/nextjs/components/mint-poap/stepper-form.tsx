import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SurveyToken from "../../SoulBoundToken.json";
import proposals from "./proposals.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { GlobeAltIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";

// Import your proposals.json

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Stepper() {
  const router = useRouter();
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState(address ? 1 : 0);
  const [selectedOption, setSelectedOption] = useState<"public" | "private" | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>(""); // State to hold the contract address

  const surveyMetaQueryParam = router.query.surveyMeta;
  const proposalURLQueryParam = router.query.proposalURL;

  //   const { data, isLoading } = useQuery({
  //   queryKey: ['taskStatus', taskId],
  //   queryFn: () => {
  //     console.log("Polling")
  //     pollTaskStatus({ taskId })
  //    },
  //   enabled: !!taskId
  // })

  useEffect(() => {
    if (address && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [address, currentStep]);

  useEffect(() => {
    if (proposalURLQueryParam) {
      const matchingProposal = proposals.proposals.find(
        (proposal: { url: string | string[] }) => proposal.url === proposalURLQueryParam,
      );
      if (matchingProposal) {
        setContractAddress(matchingProposal.contractAddress);
      }
    }
  }, [proposalURLQueryParam]);

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

  // const surveyString = "This is a survey string";

  const handleVerificationNext = () => {
    // Add verification logic here if needed
    setCurrentStep(2);
  };

  // const CONTRACT_ADDRESS = "0xE35dbC55480d5a15805dbEC0e2109e34d5568799"; // Replace with your contract's address

  const CONTRACT_ADDRESS = contractAddress; // Replace with your contract's address
  console.log("CONTRACT_ADDRESS123", CONTRACT_ADDRESS);
  console.log("SurveyToken", SurveyToken);
  // const { write } = useContractWrite({
  //   address: CONTRACT_ADDRESS,
  //   abi: SurveyToken,
  //   functionName: "submitSurvey", // Replace with your mint function's name
  // });

  const handleMint = async () => {
    // Access the selectedOption state here to determine the user's choice
    if (selectedOption === "public") {
      console.log("Public option selected");

      console.log("Credential minted!");
      console.log("Address type:", typeof address);
      const respondentAddress = `${address}`;
      const surveyMetadataURI = surveyMetaQueryParam || "HELLO WORLD"; // Use the query parameter value or default to "HELLO WORLD"

      console.log("respondentAddress", respondentAddress);
      console.log("surveyMetadataURI", surveyMetadataURI);

      try {
        setIsLoading(true);
        const response = await fetch("/api/mintNFT", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            respondentAddress,
            surveyMetadataURI,
          }),
        });

        setIsLoading(false);

        console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${(response as any).taskId}`);
      } catch (error) {
        console.error("Failed to execute transaction:", error);
      }
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
          <div className="flex flex-col items-center w-full gap-2">
            Would you like your survey result to be public or private?
            <div className="flex flex-row gap-2">
              {/*Make data public option */}
              <div
                className={`border border-gray-200 rounded-md p-4 mr-4 hover:cursor-pointer hover:bg-slate-100 items-center justify-center ${
                  selectedOption === "public" ? "bg-indigo-100" : ""
                }`}
                onClick={() => setSelectedOption("public")}
              >
                <GlobeAltIcon className="h-12 w-12 text-gray-500" aria-hidden="true" />
                Public
              </div>

              <div
                className={`border border-gray-200 rounded-md p-4 mr-4 hover:cursor-pointer hover:bg-slate-100 items-center justify-center ${
                  selectedOption === "private" ? "bg-indigo-100" : ""
                }`}
                onClick={() => setSelectedOption("private")}
              >
                <LockClosedIcon className="h-12 w-12 text-gray-500" aria-hidden="true" />
                Private
              </div>
            </div>
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
