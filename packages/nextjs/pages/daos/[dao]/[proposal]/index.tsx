import { useRouter } from "next/router";
import contractAbi from "/Users/oisinlyons/GitHub/ETHLisbon23/packages/nextjs/SurveyAbi.json";
import { NextPage } from "next";
import { useContractRead } from "wagmi";

interface ProposalPageProps {
  proposals: Array<{ id: string; title: string; description: string }>;
  nfts: any; // Add type definition for the NFTs data structure
  metadata: any; // Add type definition for the metadata data structure
}
function NftComment({ address, tokenURI }: { address: any; tokenURI: any }) {
  const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <div className="relative flex gap-x-4 w-[500px]">
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        {/* You can use an appropriate icon or avatar for the address here */}
        <span className="font-bold text-sm">X</span>
      </div>
      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
        <div className="flex justify-between gap-x-4">
          <div className="py-0.5 text-xs leading-5 text-gray-500">
            <span className="font-medium text-gray-900">{truncatedAddress}</span> submitted a survey
          </div>
          {/* Add a placeholder date/time or fetch the minting time if available */}
          <time className="flex-none py-0.5 text-xs leading-5 text-gray-500">Date here</time>
        </div>
        <p className="text-sm leading-6 text-gray-500">{tokenURI}</p>
      </div>
    </div>
  );
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
  });

  const contractName = contractRead.data as string;

  type NftDataResponse = {
    data?: [string[], string[]]; // an array with two arrays inside, one for addresses and one for tokenURIs
    // You can add other properties if the useContractRead hook returns more fields.
  };
  const nftData = useContractRead({
    address: proposalId,
    abi: ABI,
    functionName: "getAllTokenHolders",
  }) as NftDataResponse;

  const [addresses, tokenURIs] = nftData.data || [[], []];

  console.log("NFT Data:", nftData);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 lg-mx-12 justify-center items-center">
      <div>{contractName}</div>

      <ul role="list" className="space-y-6">
        {addresses && tokenURIs
          ? addresses.map((address, index) => (
              <NftComment key={address} address={address} tokenURI={tokenURIs[index]} />
            ))
          : null}
      </ul>
    </div>
  );
};

export default ProposalPage;
