import Link from "next/link";
import { useRouter } from "next/router";
import ProposalsList from "~~/components/ProposalsList";

function ProposalsPage() {
  const router = useRouter();
  const { dao } = router.query;
  //   const [proposals, setProposals] = useState([]);

  // Create an array of proposals
  const allProposals = [
    { id: 1, title: "Proposal 1", description: "This is the first proposal", daoId: 1 },
    { id: 2, title: "Proposal 2", description: "This is the second proposal", daoId: 2 },
    { id: 3, title: "Proposal 3", description: "This is the third proposal", daoId: 3 },
  ];
  // fetch proposals (smart contracts) based on the DAO id from the smart contract

  //   useEffect(() => {
  //     async function fetchProposals() {
  //       const res = await fetch(`/api/daos/${dao}/proposals`);
  //       const data = await res.json();
  //       setProposals(data.proposals);
  //     }

  //     fetchProposals();
  //   }, [dao]);

  const proposals = dao ? allProposals.filter(proposal => proposal.daoId === +dao) : [];

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 lg-mx-12 justify-center items-center">
      <h1>Proposals for DAO {dao}</h1>
      {/* Access the proposals array */}

      {/*add a link button to go back to the /dao page */}
      <div className="flex border rounded-full border-y-cyan-700 py-2 px-4">
        <Link href="/daos">Back to DAOs</Link>
      </div>
      <ProposalsList proposals={proposals} />
    </div>
  );
}

export default ProposalsPage;
