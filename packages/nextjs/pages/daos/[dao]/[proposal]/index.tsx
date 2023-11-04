import { useRouter } from "next/router";
import { NextPage } from "next";
import { getContractNFTs, getNFTMetadata } from "~~/services/web3/moralis";

interface ProposalPageProps {
  proposals: Array<{ id: string; title: string; description: string }>;
  nfts: any; // Add type definition for the NFTs data structure
  metadata: any; // Add type definition for the metadata data structure
}

const ProposalPage: NextPage<ProposalPageProps> = ({ proposals }) => {
  const router = useRouter();
  const { proposal } = router.query;
  console.log(proposal);

  // Ensure proposals is defined before trying to find the selected proposal
  const selectedProposal = proposals?.find(p => p.id === proposal);

  // Render the proposal page
  return (
    <div>
      {selectedProposal ? (
        <>
          <h1>{selectedProposal.title}</h1>
          <p>{selectedProposal.description}</p>

          {/* Render other proposal content here */}
        </>
      ) : (
        <p>Proposal not found</p>
      )}
    </div>
  );
};

// Fetch data on server-side
export async function getServerSideProps() {
  const contract = "0x22C1f6050E56d2876009903609a2cC3fEf83B415";
  const chain = "gnosis";

  // Fetch data from Moralis API
  const nfts = await getContractNFTs(chain, contract);
  const metadata = await getNFTMetadata(chain, contract, "1"); // You might want to change the tokenId based on your use case

  // Return as props
  return {
    props: {
      nfts,
      metadata,
      proposals: [], // Add your logic to fetch proposals or pass them as static data
    },
  };
}

export default ProposalPage;
