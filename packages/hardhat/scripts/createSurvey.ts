import { ethers } from 'ethers';
import * as fs from "fs/promises";
import * as dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: "./.env" });

const CONTRACT_ADDRESS_PATH = './contractAddress.txt';

type EnvConfig = { [key: string]: string };

const CONTRACT_ABI = process.env.CONTRACT_ABI || require('./contractAbi.json');
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || (await fs.readFile(CONTRACT_ADDRESS_PATH, 'utf8')).trim();

const validateEnvVariables = (): void => {
    const schema = Joi.object({
        INFURA_URL: Joi.string().uri().required(),
        DEPLOYER_PRIVATE_KEY: Joi.string().required(),
    });

    const { error } = schema.validate(process.env, { allowUnknown: true });

    if (error) {
        throw new Error(`Missing or invalid environment variables: ${error.message}`);
    }
};

const setNewEnvConfig = async (existingEnvConfig: EnvConfig = {}): Promise<void> => {
    console.log("👛 Generating new Wallet");
    const randomWallet = ethers.Wallet.createRandom();

    const newEnvConfig: EnvConfig = {
        ...existingEnvConfig,
        DEPLOYER_PRIVATE_KEY: randomWallet.privateKey,
    };

    // Store in .env
    await fs.writeFile("./.env", stringify(newEnvConfig));
    console.log("📄 Private Key saved to packages/hardhat/.env file");
    console.log("🪄 Generated wallet address:", randomWallet.address);
};

const getContract = async (wallet: ethers.Wallet): Promise<ethers.Contract> => {
    console.log('Connecting to contract at', CONTRACT_ADDRESS);
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
};

const sendCreateSurveyTransaction = async (
    contract: ethers.Contract,
    name: string,
    symbol: string,
    url: string
): Promise<ethers.ContractTransaction> => {
    console.log('Sending createSurvey transaction');
    return contract.createSurvey(name, symbol, url);
};

const createSurvey = async (
    name: string,
    symbol: string,
    url: string
): Promise<void> => {
    validateEnvVariables();

    const { INFURA_URL, DEPLOYER_PRIVATE_KEY } = process.env;
    const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
    const wallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    try {
        const contract = await getContract(wallet);
        const transactionResponse = await sendCreateSurveyTransaction(contract, name, symbol, url);

        console.log('Waiting for transaction to be mined');
        const receipt = await transactionResponse.wait();

        if (receipt.status === 1) {
            console.log('Transaction was successful');
            console.log('Transaction mined:', receipt.transactionHash);
            console.log('Survey created with address:', receipt.events?.find(event => event.event === 'SurveyDeployed')?.args?.surveyAddress);
        } else {
            console.error('Transaction failed');
        }
    } catch (error) {
        console.error('Error:', error.message, '\n', error.stack);
    }
};

// Call the function with your desired arguments
createSurvey('Survey Name', 'SYMBOL', 'https://example.com/survey')
    .catch(error => console.error('Failed to create survey:', error.message));
