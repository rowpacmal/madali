import { ethers } from 'ethers';

// Function to initialize the contract.
// This function is used to initialize the contract,
// by creating a read and write instance from the address and abi.
async function initializeContract(contract, setState, provider, signer) {
  // Initialize the contract.
  let read,
    write = null;

  try {
    // Create the read and write instances.
    read = new ethers.Contract(contract.address, contract.abi, await provider);
    write = new ethers.Contract(contract.address, contract.abi, await signer);
  } catch (error) {
    // Handle the error.
    console.error(
      `Error initializing the ${contract.name} contract : ${error}`
    );
  }

  // Set the state.
  console.info(`Successfully initialized the ${contract.name} contract.`);
  setState({ read, write });
}

export default initializeContract;
