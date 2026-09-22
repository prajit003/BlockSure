# BlockSure (Assurance): Electronic Warranty & Ownership Management using Blockchain

> **Enterprise Blockchain Project (Ethereum Sepolia Testnet)**  
> **Authors:**  
> 1. R ALWIN EBENEZER (25BCE5056)  
> 2. R PRAJIT (25BCE5022)  
> **Guide / Faculty:** Prof. NOEL JEYGAR ROBERT  
> **Institution:** VIT  

---

## 📌 Abstract & Overview

**BlockSure** is a decentralized electronic warranty and product ownership platform built on the **Ethereum Sepolia Testnet** (Chain ID: `11155111`). It eliminates traditional paper-based warranty fraud, missing receipts, counterfeit second-hand sales, and unauthorized repair modifications.

All transactions—from minting digital warranty NFTs to locking claim escrow deposits and settling service center repairs—are denominated in **Sepolia ETH** and verifiable on **Sepolia Etherscan**.

---

## ⚡ Core Blockchain Concepts Implemented

1. **Ethereum Sepolia Testnet Settlement**:
   - Deployed on Ethereum Sepolia Testnet (Chain ID: `11155111`).
   - Settle gas, claim escrow deposits, and repair invoices in **Sepolia ETH**.
2. **Smart Contracts & EVM State Machine**:
   - Manages state transitions: `Registered` ➔ `Active` ➔ `ClaimPending` ➔ `InRepair` ➔ `Expired` / `Transferred`.
3. **Cryptographic Merkle Tree Batch Proofs (`verifyBatchProof`)**:
   - Manufacturers batch-register products using Merkle Tree Roots stored on Sepolia to verify factory authenticity.
4. **Tokenized Warranty NFT Assets (ERC-721 Model)**:
   - Digital warranties function as transferrable NFT assets (`ownerOf`, `balanceOf`, `transferOwnership`).
5. **EIP-712 ECDSA Off-Chain Signature Verification**:
   - Validates manufacturer cryptographic signatures on-chain.
6. **Custom Non-SHA256 Cryptographic Checksum Hash**:
   - Uses Ethereum native `Keccak-256` combined with a **31-bit Polynomial Shift Checksum** (`calculateCustomHash`) directly inside the Solidity smart contract.
7. **Role-Based Access Control (RBAC) & Dedicated Login Gate**:
   - Separate credentials for **Manufacturer** (`MFR-SEC-2026-KEY`), **Service Center** (`SC-AUTH-9988-SEC`), and **Customer / Owner** (`1234`).
8. **Sepolia Etherscan Audit Trail & 1-Click Printable Certificate Generator**:
   - Real-time clickable links to `https://sepolia.etherscan.io/tx/...` and official printable PDF certificates.

---

## 📁 Project Structure

```
BlockSure/
├── contracts/
│   └── BlockSureWarranty.sol   # Solidity Smart Contract (^0.8.20)
├── scripts/
│   └── deploy.js               # Hardhat Sepolia Deployment script
├── frontend/
│   ├── index.html              # Multi-Portal Web Dashboard UI
│   ├── app.js                  # Web3, Sepolia ETH Integration & QR Engine
│   └── styles.css              # Modern Dark Glassmorphism Styling
├── SLIDES.md                   # Updated Presentation Slides & Script
└── README.md                   # Project Documentation & Guide
```

---

## 🚀 How to Run & Demo

### Option 1: Live Hosted Website (GitHub Pages)
👉 **[https://prajit003.github.io/BlockSure/](https://prajit003.github.io/BlockSure/)**

1. Select any portal (Manufacturer, Service Center, Customer, or Public Inspector).
2. Click **"Authenticate & Launch Dashboard"** (credentials are pre-filled).
3. Connect your **MetaMask wallet** configured for **Ethereum Sepolia** or use the built-in Sepolia In-Memory Ledger Simulator.

### Option 2: Deploying to Ethereum Sepolia via Hardhat
1. Install Hardhat dependencies:
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
   ```
2. Configure your Sepolia private key & RPC in `hardhat.config.js`:
   ```javascript
   module.exports = {
     solidity: "0.8.20",
     networks: {
       sepolia: {
         url: "https://ethereum-sepolia-rpc.publicnode.com",
         accounts: [process.env.PRIVATE_KEY]
       }
     }
   };
   ```
3. Deploy to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
4. Verify on Sepolia Etherscan:
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

---

## 🚰 Faucets for Free Sepolia ETH
- [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com)
