import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import Stepper from "~~/components/mint-poap/stepper-form";

const Mint: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <Stepper />
      </div>
    </>
  );
};

export default Mint;
