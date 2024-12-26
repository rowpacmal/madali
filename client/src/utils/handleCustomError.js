import { ethers } from 'ethers';

// Function to handle custom errors thrown by the contract.
function handleCustomError(abi, error) {
  // Parse the error data using the contract ABI.
  const iface = new ethers.Interface(abi);

  if (error.data) {
    try {
      // Try to decode the custom error.
      const decodedError = iface.parseError(error.data);

      console.error('Custom Error Name:', decodedError.name);
      console.error('Arguments:', decodedError.args);

      return decodedError;
    } catch (decodeError) {
      // If decoding fails, return the original error.
      console.error('Failed to decode custom error:', decodeError);

      return decodeError;
    }
  } else {
    // If no error data, return the original error.
    console.error('Standard error message:', error.message);

    return error;
  }
}

export default handleCustomError;
