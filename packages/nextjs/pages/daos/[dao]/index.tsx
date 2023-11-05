import Link from "next/link";
import { useRouter } from "next/router";
import ProposalsList from "~~/components/ProposalsList";

function ProposalsPage() {
  const router = useRouter();
  const { dao } = router.query;
  //   const [proposals, setProposals] = useState([]);

  // Create an array of proposals
  const allProposals = [
    {
      id: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
      title: "Proposal 1",
      description: "This is the first proposal",
      daoId: "0x3595c48501FC819ee506907ffd912BC2936e36e5",
    },
    {
      id: "0x3bb247ca67B5a23D25F7FAAdC4c28E1332Aa1489",
      title: "Proposal 2",
      description: "This is the second proposal",
      daoId: "0x3595c48501FC819ee506907ffd912BC2936e36e5",
    },
    {
      id: "0x5d55066aBCFaccAB00899a76D3281390Be10CD87",
      title: "Survey Token Checker",
      description: "This is the third proposal",
      daoId: "0x3595c48501FC819ee506907ffd912BC2936e36e5",
    },
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

  const proposals = dao ? allProposals.filter(proposal => proposal.daoId === dao) : [];

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
