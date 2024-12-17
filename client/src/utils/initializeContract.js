import { ethers } from 'ethers';

async function initializeContract(contract, setState, provider, signer) {
  if (!window.ethereum || !provider || !signer) {
    return;
  }

  let read,
    write = null;

  try {
    read = new ethers.Contract(contract.address, contract.abi, await provider);
    write = new ethers.Contract(contract.address, contract.abi, await signer);
  } catch (error) {
    console.error(
      `Error initializing the ${contract.name} contract : ${error}`
    );
  }

  setState({ read, write });
}

export default initializeContract;
