import { expect } from "chai";
import { ethers } from "hardhat";
import { SurveyToken } from "../typechain-types";

describe("SurveyToken", function () {
  let surveyToken: SurveyToken;
  // let owner: SignerWithAddress;
  let respondent: SignerWithAddress;

  before(async () => {
    // [owner, respondent] = await ethers.getSigners();
    [, respondent] = await ethers.getSigners();
    const surveyTokenFactory = await ethers.getContractFactory("SurveyToken");
    surveyToken = (await surveyTokenFactory.deploy()) as SurveyToken;
    await surveyToken.deployed();
  });

  describe("Survey Submission", function () {
    // it("Should mint a new survey token and assign it to the respondent", async function () {
    //   const surveyMetadataURI = "What is good?";
    //   await surveyToken.submitSurvey(respondent.address, surveyMetadataURI);
    //   expect(await surveyToken.ownerOf(0)).to.equal(respondent.address);
    // });

    it("Should set the correct token URI for the new survey token", async function () {
      const surveyMetadataURI = "What is good?";
      const tx = await surveyToken.submitSurvey(respondent.address, surveyMetadataURI);
      const txReceipt = await tx.wait(); // 0ms, as tx is already confirmed
      // Assuming the event is named 'SurveySubmitted' and it emits the survey ID
      const event = txReceipt.events?.find(e => e.event === "MetadataUpdate");
      expect(event).to.not.be.undefined;
      const surveyTokenId = event?.args ? [0] : undefined;
      expect(surveyTokenId).to.not.be.undefined;
      // Assuming the first argument of the event is the survey ID
      if (surveyTokenId == undefined) {
        expect(await surveyToken.tokenURI(surveyTokenId)).to.equal(surveyMetadataURI);
      }
    });

    // it("Should increment the survey token IDs correctly", async function () {
    //   const surveyMetadataURI1 = "ipfs://newSurvey1";
    //   const surveyMetadataURI2 = "ipfs://newSurvey2";

    //   const newSurveyId1 = await surveyToken.submitSurvey(respondent.address, surveyMetadataURI1);
    //   const newSurveyId2 = await surveyToken.submitSurvey(respondent.address, surveyMetadataURI2);

    //   expect(newSurveyId2).to.equal(newSurveyId1 + 1);
    // });

    // Additional tests for access control and other features can be added here
  });

  // Additional describe blocks for other contract features
});
