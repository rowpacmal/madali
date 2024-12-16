import { ethers } from 'ethers';

async function initializeContract({ name, abi, address }) {
  let readContract,
    writeContract = null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    try {
      readContract = new ethers.Contract(address, abi, provider);
    } catch (error) {
      console.error(
        `Error initializing read for the ${name} contract : ${error}`
      );
    }

    try {
      const signer = await provider.getSigner();
      writeContract = new ethers.Contract(address, abi, signer);
    } catch (error) {
      console.error(
        `Error initializing write for the ${name} contract : ${error}`
      );
    }
  } catch (error) {
    console.error(`Error initializing the ${name} contract : ${error}`);
  }

  return { readContract, writeContract };
}

export default initializeContract;
