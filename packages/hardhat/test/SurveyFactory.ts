import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

describe("SurveyTokenFactory", function () {
    let surveyTokenFactory: Contract;
    let deployer: Signer;
    let owner: Signer;
    let addr1: Signer;
  
    beforeEach(async function () {
        // Get the deployer's address
        [deployer, owner, addr1] = await ethers.getSigners();
  
        // Deploy the SurveyTokenFactory contract
        const SurveyTokenFactoryContract = await ethers.getContractFactory("SurveyTokenFactory");
        surveyTokenFactory = await SurveyTokenFactoryContract.deploy();
        await surveyTokenFactory.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await surveyTokenFactory.hasRole(surveyTokenFactory.SURVEY_CREATOR_ROLE(), deployer.address)).to.equal(true);
          });
    });

    describe("createSurvey", function () {
        it("Should create a new survey token", async function () {
            const result = await surveyTokenFactory.createSurvey("SurveyName", "SYMBOL");
            const [surveyAddress, surveyId] = result;
            expect(surveyAddress).to.properAddress;
            expect(surveyId).to.equal(0);
          });

          it("Should emit a SurveyDeployed event", async function () {
            await expect(surveyTokenFactory.createSurvey("NewSurvey", "NSY"))
              .to.emit(surveyTokenFactory, "SurveyDeployed")
              .withArgs(/* Correct args */);
          });
    });

    describe("submitSurvey", function () {
        let surveyToken: Contract;
    
        beforeEach(async function () {
            const SurveyTokenContract = await ethers.getContractFactory("SurveyToken");
            surveyToken = await SurveyTokenContract.deploy(/* constructor arguments */);
            await surveyToken.deployed();
        });
    
        it("Should submit a survey", async function () {
            await expect(surveyTokenFactory.connect(addr1).submitSurvey(surveyToken.address, "uri"))
                .to.emit(surveyTokenFactory, "SurveySubmitted")
                .withArgs(surveyToken.address, addr1.address, 0);
        });
    
        it("Should revert on submitting a survey to an invalid address", async function () {
            await expect(surveyTokenFactory.connect(addr1).submitSurvey(ethers.constants.AddressZero, "uri"))
                .to.be.revertedWith("SurveyTokenFactory: Invalid address");
        });
    });

    describe("Access Control", function () {
        it("Should revert if an unauthorized account tries to create a survey", async function () {
            const surveyFactoryFromAddr1 = surveyTokenFactory.connect(addr1);
            await expect(surveyFactoryFromAddr1.createSurvey("UnauthorizedSurvey", "USY"))
            .to.be.revertedWith(`AccessControl: account ${addr1.address} is missing role ${await surveyTokenFactory.SURVEY_CREATOR_ROLE()}`);
          });
    });

    describe("Edge Cases", function () {
        it("Should revert if the name or symbol is empty", async function () {
            await expect(surveyTokenFactory.createSurvey("", "SVY")).to.be.revertedWith("SurveyTokenFactory: Name cannot be empty");
            await expect(surveyTokenFactory.createSurvey("SurveyToken", "")).to.be.revertedWith("SurveyTokenFactory: Symbol cannot be empty");
        });
    });

    describe("Contract Interactions", function () {
        it("Should interact with the SurveyToken contract correctly", async function () {
            const [surveyAddress, surveyId] = await surveyTokenFactory.createSurvey("SurveyName", "SYMBOL");
            const newSurveyToken = new ethers.Contract(newSurveyAddress, surveyToken.interface, owner);
            expect(await newSurveyToken.name()).to.equal("NewSurvey");
            expect(await newSurveyToken.symbol()).to.equal("NSY");
        });
    });

    describe("Event Emissions", function () {
        it("Should emit events with correct values", async function () {
            await expect(surveyTokenFactory.createSurvey("NewSurvey", "NSY"))
                .to.emit(surveyTokenFactory, "SurveyDeployed");
            // ...
        });
    });

    describe("State Changes", function () {
        it("Should update the deployedSurveys array correctly", async function () {
            await surveyTokenFactory.createSurvey("NewSurvey", "NSY");
            expect(await surveyTokenFactory.getDeployedSurveys()).to.have.length(1);  // Assuming no surveys are deployed in beforeEach
        });
    });

    describe("getDeployedSurveys", function () {
        it("Should return the list of deployed surveys", async function () {
            expect(await surveyTokenFactory.getDeployedSurveys()).to.eql([]);
        });
    });
});
