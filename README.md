# Madali Project

Project repository for [@rowpacmal](https://github.com/rowpacmal)'s graduation assignment at [Medieinstitutet](https://medieinstitutet.se).

---

## Introduction

Madali is an educational platform designed to help teachers, parents, and students learn and utilize Web3 technology in a practical way. The platform offers an alternative approach to grading and distributing milestones and achievements, making them ownable and verifiable on the blockchain.

This project is built using **React**, **Hardhat**, and **Ethers.js**, and operates on the EVM.

---

## Features

- **Admin Dashboard**: Manage classes, teachers, and students.
- **Teacher Dashboard**: Add courses, assign grades, and mint certificates as NFTs.
- **Student Dashboard**: View grades, achievements, and NFT certificates.
- **Blockchain Integration**: Grades and certificates are tokenized as NFTs for ownership and transparency.

---

## How to Use and Test This Project

Follow the steps below to set up and test the project locally:

### Prerequisites

- Node.js and npm installed.
- MetaMask or another Web3-compatible browser extension.
- Basic understanding of Ethereum and blockchain concepts.

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/rowpacmal/madali.git
   ```

2. **Install Dependencies**:
   Navigate into each folder (`client`, `hardhat`, `server`) and run:

   ```bash
   npm install
   ```

   Use separate terminals for each folder.

3. **Start Development Environments**:

   - **Client**: Navigate to the `client` folder and run:
     ```bash
     npm run dev
     ```
   - **Server**: Navigate to the `server` folder and run:
     ```bash
     npm start
     ```
   - **Hardhat Testnet**:
     Navigate to the `hardhat` folder and run:
     ```bash
     npm start
     ```
     In another terminal, deploy the smart contracts:
     ```bash
     npm run deploy
     ```

4. **Set Up MetaMask**:

   - Connect MetaMask to the local Hardhat testnet.
   - Add the first testnet address as the 'Admin' account.

5. **Add Users and Classes**:

   - As the 'Admin', add classes, teachers, and students.
   - Use the class ID format `YYNN`, where `YY` represents the last two digits of the current year (e.g., `24` for 2024), and `NN` is the class indicator (e.g., `01`, `02`, etc.).

6. **Teacher and Student Accounts**:

   - Teachers and students should connect their wallets to access their respective dashboards.
   - Teachers can add courses and grades. Use the course ID format `ClassIDNN`, where `ClassID` is the class ID, and `NN` is the course number (e.g., `240102` for the second course in class `2401`).

7. **Manage Grades and Certificates**:

   - Teachers can assign, update, and mint grades as NFT certificates via the grade management page.
   - Students can view their grades and badges (NFT certificates).

8. **Import Certificates into Wallets**:
   - Students can add certificates to their wallets by importing the NFT, entering the token ID and the contract address.
   - **Note**: Currently, NFT metadata URI support is limited due to a known issue with MetaMask and Hardhat.

---

## Known Issues

- Validation bug in class creation: Ensure the correct class ID is entered to avoid errors.
- Metadata for NFTs is not yet implemented due to display issues with MetaMask.

---

## Contact

If you encounter issues or have questions, feel free to reach out via [@rowpacmal](https://github.com/rowpacmal).

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
