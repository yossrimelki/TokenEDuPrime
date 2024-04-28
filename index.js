const { ethers } = require('ethers');
require('dotenv').config();
const { abi } = require('./artifacts/contracts/EduToken.sol/EduToken.json');

const API_URL = process.env.PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

async function isInitialized() {
  try {
    const initialized = await contract.isInitialized();
    return initialized;
  } catch (error) {
    console.error("Error checking contract initialization:", error);
    throw error; // It's usually a good idea to rethrow the error after logging it.
  }
}

async function tryInitialize() {
  try {
    const initialized = await isInitialized();
    if (!initialized) {
      // Assuming initialize() doesn't require arguments for simplicity; adjust as needed.
      const initializeTx = await contract.initialize("EduToken", "EduT", 18);
      const receipt = await initializeTx.wait();

      // Log the entire receipt to inspect events and status
      console.log("Transaction receipt:", receipt);

      // Check if transaction was successful based on receipt; adjust condition as necessary
      if (receipt.status === 1) {
        console.log("Contract initialized successfully.");
      } else {
        console.log("Initialization failed.");
      }
    } else {
      console.log("Contract is already initialized.");
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}async function getBalance(address) {
  try {
    const balance = await contract.balanceOf(address);
    console.log(`Balance of address ${address}: ${balance.toString()}`);
  } catch (error) {
    console.error(`Error getting balance for address ${address}:`, error);
  }
}


async function main() {
  try {
    await tryInitialize();
    console.log("Attempting to query contract information...");

    const contractName = await contract.name();
    console.log("name: ", contractName);

    const contractSymbol = await contract.symbol();
    console.log("symbol: ", contractSymbol);

    const decimals = await contract.decimals();
    console.log("decimals: ", decimals);

    const contractTotalSupply = await contract.totalSupply();
    console.log("totalSupply: ", contractTotalSupply.toString());
    const address = "0x435Bc71727b10315A47F574F86B173261493C35f";
    

    const otheraddress = "0x42791C2Ec3Ff1277899b9c3D5bD4dBd194cFF43F";
    //////////////////////////testing part ==============>"0x62BccC37eBF73A77C0A3a42846023E2585204430"
    await getBalance(otheraddress);

    


/*
    const privatekey = "2c579053960b08413d38a6c0a4f9bc99d08835b6abf69eaf3b218fd1d85dce97";
    const amount = ethers.utils.parseUnits("100",decimals);
    const newSinger = new ethers.Wallet(privatekey,provider);
    const newcontract = new ethers.Contract(CONTRACT_ADDRESS,abi,newSinger);
    const owner = await contract.owner();

    const approveTx = await newcontract.approve(owner, amount);
    await approveTx.wait();
    console.log("owner can now spend on the behalf of new Signer");
    
    const transferFromTx = await contract.transferFrom(otheraddress, address, amount);
    await transferFromTx.wait();

    const spendAmount = await newcontract.allowance(otheraddress,owner);
    console.log("owner can spend tokens on behalf of newSigner: " +ethers.utils.formatUnits(spendAmount,decimals));
*/






    //=============>ending part ///////////////////////////
    //const address = "0x11e2ab2Df333cFac672BFbB08A7240473603F685";
    
    //const amount = ethers.utils.parseUnits("10",decimals);
    const tx = await contract.transfer(otheraddress, 10);
    const receipt = await tx.wait();
    await getBalance(address);
    await getBalance(otheraddress);
    
   

    if (receipt.status === 1) {
      console.log("Transfer successful.");
    } else {
      console.log("Transfer failed.");
    }

    console.log("Contract information and balance successfully queried!");
  } catch (error) {
    console.error("Error in main function:", error);
    console.log("Error details:", JSON.stringify(error, null, 2));
  }
}


main().catch((err) => console.error(err));

