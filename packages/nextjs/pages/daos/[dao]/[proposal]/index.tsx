import { useRouter } from "next/router";
import { NextPage } from "next";

interface ProposalPageProps {
  proposals: Array<{ id: string; title: string; description: string }>;
}

const ProposalPage: NextPage<ProposalPageProps> = ({ proposals }) => {
  const router = useRouter();
  const { proposal } = router.query;
  console.log(proposal);

  // Ensure proposals is defined before trying to find the selected proposal
  const selectedProposal = proposals?.find(p => p.id === proposal);

  //fetch proposal smart contract from the dao smart contract and fetch all related nfts in this smart contract

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

export default ProposalPage;
