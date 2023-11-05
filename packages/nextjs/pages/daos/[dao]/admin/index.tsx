import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

const DaoAdminPage = () => {
  const router = useRouter();
  const { dao } = router.query;
  const [safes, setSafes] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const { address } = useAccount();

  console.log(address);

  useEffect(() => {
    const fetchSafes = async () => {
      try {
        const response = await fetch(
          `https://safe-transaction-gnosis-chain.safe.global/api/v1/owners/${address}/safes/`,
        );
        const data = await response.json();
        setSafes(data.safes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSafes();
  }, [address]);

  console.log("SAFES", safes);

  useEffect(() => {
    if (dao && safes.includes(dao as string)) {
      setIsAdmin(true);
    }
  }, [dao, safes]);

  if (isAdmin) {
    return (
      <div className="flex flex-col m-10">
        <h1>Admin Panel for {dao}</h1>
        <ul>
          {safes.map(safe => (
            <li key={safe}>{safe}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Error: You are not an admin of {dao}</h1>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }
};

export default DaoAdminPage;
