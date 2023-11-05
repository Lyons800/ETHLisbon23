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
      id: "0xE35dbC55480d5a15805dbEC0e2109e34d5568799",
      title: "[SEP #7] Governance Framework",
      description: "https://forum.safe.global/t/sep-7-governance-framework/3711",
      daoId: "0x3595c48501FC819ee506907ffd912BC2936e36e5",
    },
    {
      id: "0x3bb247ca67B5a23D25F7FAAdC4c28E1332Aa1489",
      title: "[SEP #6] Safe Grants Program (SGP)",
      description: "https://forum.safe.global/t/sep-6-safe-grants-program-sgp/3213",
      daoId: "0x3595c48501FC819ee506907ffd912BC2936e36e5",
    },
    {
      id: "0x5d55066aBCFaccAB00899a76D3281390Be10CD87",
      title: "[SEP #5] Redistributing Unredeemed Tokens From User Airdrop Allocation",
      description:
        "https://forum.safe.global/t/sep-5-redistributing-unredeemed-tokens-from-user-airdrop-allocation/2172",
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
