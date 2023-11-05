import { useRouter } from "next/router";
import contractAbi from "/Users/oisinlyons/GitHub/ETHLisbon23/packages/nextjs/SurveyAbi.json";
import { NextPage } from "next";
import { useContractRead } from "wagmi";

interface ProposalPageProps {
  proposals: Array<{ id: string; title: string; description: string }>;
  nfts: any; // Add type definition for the NFTs data structure
  metadata: any; // Add type definition for the metadata data structure
}

const ProposalPage: NextPage<ProposalPageProps> = () => {
  const router = useRouter();
  const { proposal } = router.query;
  console.log(proposal);
  const proposalId = proposal as string;

  const ABI = contractAbi;

  const contractRead = useContractRead({
    address: proposalId,
    abi: ABI,
    functionName: "name",
    suspense: true,
  });

  // If there's no data yet, show a loading state

  // Type assertion to tell TypeScript that contractRead.data is of type string
  console.log("Contract Data:", contractRead);
  const contractName = contractRead.data as string;

  // Render the proposal page
  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 lg-mx-12 justify-center items-center">
      <div>{contractName}</div>
    </div>
  );
};

export default ProposalPage;
