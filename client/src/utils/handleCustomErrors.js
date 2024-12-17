import { ethers } from 'ethers';

function handleCustomErrors(abi, error) {
  const iface = new ethers.Interface(abi);

  if (error.data) {
    try {
      const decodedError = iface.parseError(error.data);

      console.error('Custom Error Name:', decodedError.name);
      console.error('Arguments:', decodedError.args);

      return decodedError;
    } catch (decodeError) {
      console.error('Failed to decode custom error:', decodeError);

      return decodeError;
    }
  } else {
    console.error('Standard error message:', error.message);
  }

  return error;
}

export default handleCustomErrors;
