# 📊 BlockSure Project - Updated Presentation Slides & Script (Sepolia Enterprise Edition)
**Project:** Electronic Warranty and Ownership Management using Blockchain (BlockSure)  
**Authors:** R ALWIN EBENEZER (25BCE5056) & R PRAJIT (25BCE5022)  
**Guide / Faculty:** Prof. NOEL JEYGAR ROBERT  
**Institution:** VIT  

---

## ⚡ Core Blockchain Features & Architecture Implemented

1. **Ethereum Sepolia Testnet Settlement**:
   - All transactions settle on Ethereum Sepolia Testnet (**Chain ID: 11155111**).
   - Real-time balances, escrow deposits, and repair service settlements are denominated in **Sepolia ETH**.
2. **Smart Contracts & EVM State Machine**:
   - Manages state transitions: `Registered` ➔ `Active` ➔ `ClaimPending` ➔ `InRepair` ➔ `Expired` / `Transferred`.
3. **Cryptographic Merkle Tree Batch Proof Verification (`verifyBatchProof`)**:
   - Manufacturers batch-register products using Merkle Tree Roots stored on Sepolia to verify factory batch authenticity.
4. **Tokenized Warranty NFT Assets (ERC-721 Standard Architecture)**:
   - Each digital warranty functions as a transferrable NFT asset (`ownerOf`, `balanceOf`, `transferOwnership`).
5. **ECDSA Off-Chain Cryptographic Signature Verification (EIP-712)**:
   - Manufacturers digitally sign warranty certificates off-chain (`ecrecover`).
6. **Multi-Sig Service Center Governance & Collateral Escrow**:
   - Requires multi-signature manufacturer approval before a repair center can log maintenance records.
7. **Custom Non-SHA256 Cryptographic Checksum Hash**:
   - Combines Ethereum `Keccak-256` with a **31-bit Polynomial Shift Checksum** (`calculateCustomHash`) directly on-chain.
8. **Dedicated Role Credentials Authentication**:
   - Individual login screens & credentials for **Manufacturer** (`MFR-SEC-2026-KEY`), **Service Center** (`SC-AUTH-9988-SEC`), and **Customer / Owner**.
9. **Sepolia Etherscan Audit Trail & 1-Click Printable Certificate Generator**:
   - Direct transaction explorer links to `https://sepolia.etherscan.io/tx/...` and official printable PDF certificates.

---

## 🎯 Updated Technologies Used Table (Slide 9)

| Technology | Purpose in BlockSure |
| :--- | :--- |
| **Solidity (^0.8.20)** | Smart Contract Logic, State Machine & Role Security |
| **Ethereum Sepolia Testnet** | Decentralized Execution & Public Ledger (Chain ID 11155111) |
| **Sepolia ETH** | Native Settlement Currency for Gas, Claims & Repair Escrow |
| **Sepolia Etherscan** | Public On-Chain Transaction & Audit Explorer |
| **Merkle Tree Proofs** | Batch Product Authenticity Verification |
| **ERC-721 NFT Model** | Tokenized Warranty Ownership & Transfers |
| **Ethers.js v6 & Web3** | Frontend Sepolia Network Synchronization & MetaMask Provider |
| **Keccak-256 + Polynomial** | Custom Non-SHA256 Product Fingerprinting |
| **HTML5 & CSS3** | Spacious Glassmorphism Web Dashboard |
| **Hardhat** | Smart Contract Testing & Sepolia Deployment Framework |

---

## 🎤 Presentation Speaker Script & Key Talking Points

### Speaker 1 (R ALWIN EBENEZER):
> "Good morning / afternoon Professor. Today we present **BlockSure**, a decentralized Electronic Warranty and Ownership Management system deployed for the **Ethereum Sepolia Testnet**.
> In traditional retail and second-hand electronics markets, paper warranty cards can be lost or forged, and centralized databases can be modified behind closed doors.
> With BlockSure, every product is minted on Sepolia as a tamper-evident digital warranty NFT, with all operations verifiable on Sepolia Etherscan."

### Speaker 2 (R PRAJIT):
> "Instead of standard SHA-256, our smart contract uses an Ethereum native **Keccak-256 combined with a 31-bit polynomial shift checksum** (`calculateCustomHash`).
> All transactions use **Sepolia ETH**—from manufacturer minting to refundable escrow deposits for customer claim tickets and service center billing.
> Users can connect with MetaMask or explore via our interactive simulator, verify batch proofs with Merkle trees, and generate official printable warranty certificates with live QR codes."
