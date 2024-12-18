import { ethers } from 'ethers';

async function initializeContract(contract, setState, provider, signer) {
  let read,
    write = null;

  // Initialize the contract.
  try {
    read = new ethers.Contract(contract.address, contract.abi, await provider);
    write = new ethers.Contract(contract.address, contract.abi, await signer);
  } catch (error) {
    console.error(
      `Error initializing the ${contract.name} contract : ${error}`
    );
  }

  // Set the state.
  console.info(`Successfully initialized the ${contract.name} contract.`);
  setState({ read, write });
}

export default initializeContract;
