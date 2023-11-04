import React from "react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  daoId: number;
}

interface ProposalsListProps {
  proposals: Proposal[];
}

const ProposalsList: React.FC<ProposalsListProps> = ({ proposals }) => {
  return (
    <div>
      {proposals.map(proposal => (
        <div className="mb-2" key={proposal.id}>
          <a
            href={`/daos/${proposal.daoId}/${proposal.id}`}
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <div>{proposal.title}</div>
            </div>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              <div>{proposal.description}</div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default ProposalsList;
