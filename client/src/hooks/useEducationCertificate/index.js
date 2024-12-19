import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import educationCertificate from '../../utils/educationCertificate.config';
import initializeContract from '../../utils/initializeContract';
import handleCustomError from '../../utils/handleCustomError';

function useEducationCertificate() {
  const { ethereum, account, provider, signer } = useContext(AppContext);
  const [certificateContract, setCertificateContract] = useState(null);

  // Initialize the contract.
  useEffect(() => {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!provider) {
      console.warn('Web3 provider not detected.');
      return;
    }

    if (!signer) {
      console.warn('Web3 signer not detected.');
      return;
    }

    // Initialize the contract.
    console.info('Initializing Certificate contract...');
    initializeContract(
      educationCertificate,
      setCertificateContract,
      provider,
      signer
    );
  }, [ethereum, provider, signer]); // Depend on ethereum, provider and signer.

  /** Setup event listeners during initialization. */
  useEffect(
    () => {
      if (!ethereum) {
        console.warn('MetaMask or Ethereum provider not detected.');
        return;
      }

      if (!certificateContract) {
        console.warn('Certificate contract instance is not initialized.');
        return;
      }

      console.info('Setting up event listeners for Certificate contract...');

      setupCertificateEventListeners();

      return () => {
        console.info('Cleaned up Certificate contract event listeners.');

        cleanupCertificateEventListeners();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ethereum, certificateContract]
  );

  /** Utility functions. */
  function dependenciesNullCheck() {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!certificateContract) {
      console.warn('Certificate contract instance is not initialized.');
      return;
    }

    if (!account) {
      console.warn('Account not detected.');
      return;
    }
  }

  function contractError(error) {
    return handleCustomError(educationCertificate.abi, error);
  }

  /** Certificate functions. */
  // Listeners.
  function setupCertificateEventListeners() {
    // Mint certificate.
    certificateContract.read.on('CertificateCreated', (id) => {
      console.info(`Success: Certificate with ID ${id} has been minted.`);
    });

    // Update certificate.
    certificateContract.read.on('CertificateUpdated', (id) => {
      console.info(`Success: Certificate with ID ${id} has been updated.`);
    });
  }
  function cleanupCertificateEventListeners() {
    // Mint certificate.
    certificateContract.read.removeAllListeners('CertificateCreated');

    // Update certificate.
    certificateContract.read.removeAllListeners('CertificateUpdated');
  }

  // Getters.
  async function getCertificate(certificateID) {
    dependenciesNullCheck();

    try {
      const certificate = await certificateContract.read.getCertificate(
        certificateID,
        {
          from: account,
        }
      );
      const certificateObj = {
        owner: certificate[0],
        imageURL: certificate[1],
        grade: Number(certificate[2]),
        id: Number(certificate[3]),
        exists: certificate[4],
      };

      console.info('Certificate:', certificateObj);

      return certificateObj;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getTotalCertificates() {
    dependenciesNullCheck();

    try {
      const totalCertificates =
        await certificateContract.read.getTotalCertificates({
          from: account,
        });
      const totalCertificatesNumber = Number(totalCertificates);

      console.info('Total number of Certificates:', totalCertificatesNumber);

      return totalCertificatesNumber;
    } catch (error) {
      return contractError(error);
    }
  }

  // Setters.
  async function mintCertificate(recipient, gradeID, courseID, imageURL) {
    dependenciesNullCheck();

    try {
      await certificateContract.write.mintCertificate(
        recipient,
        gradeID,
        courseID,
        imageURL,
        {
          from: account,
        }
      );

      console.info('Grade to be minted as a Certificate:', gradeID);
    } catch (error) {
      return contractError(error);
    }
  }
  async function updateCertificate(certificate, newOwner, newImageURL) {
    dependenciesNullCheck();

    try {
      await certificateContract.write.updateCertificate(
        certificate,
        newOwner,
        newImageURL,
        {
          from: account,
        }
      );

      console.info('Certificate to be updated:', certificate);
      console.info('New owner to be assigned:', newOwner);
      console.info('New image URL to be assigned:', newImageURL);
    } catch (error) {
      return contractError(error);
    }
  }

  /** Exports */
  return {
    // Contract.
    certificateContract,

    // Getters.
    getCertificate,
    getTotalCertificates,

    // Setters.
    mintCertificate,
    updateCertificate,
  };
}

export default useEducationCertificate;
