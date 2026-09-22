# 📊 BlockSure Project - Updated Presentation Slides & Script (Enterprise Version)
**Project:** Electronic Warranty and Ownership Management using Blockchain (BlockSure)  
**Authors:** R ALWIN EBENEZER (25BCE5056) & R PRAJIT (25BCE5022)  
**Guide / Faculty:** Prof. NOEL JEYGAR ROBERT  
**Institution:** VIT  

---

## ⚡ Core Blockchain Features & Architecture Implemented

1. **Smart Contracts & EVM State Machine**:
   - Manages state transitions: `Registered` ➔ `Active` ➔ `ClaimPending` ➔ `InRepair` ➔ `Expired` / `Transferred`.
2. **Cryptographic Merkle Tree Batch Proof Verification (`verifyBatchProof`)**:
   - Manufacturers batch-register products using Merkle Tree Roots stored on-chain to verify factory batch authenticity.
3. **Tokenized Warranty NFT Assets (ERC-721 Standard Architecture)**:
   - Each digital warranty functions as a transferrable NFT asset (`ownerOf`, `balanceOf`, `transferOwnership`).
4. **ECDSA Off-Chain Cryptographic Signature Verification (EIP-712)**:
   - Manufacturers digitally sign warranty certificates off-chain (`ecrecover`).
5. **Multi-Sig Service Center Governance & Collateral Escrow**:
   - Requires multi-signature manufacturer approval before a repair center can log maintenance records.
6. **Custom Non-SHA256 Cryptographic Checksum Hash**:
   - Combines Ethereum `Keccak-256` with a **31-bit Polynomial Shift Checksum** (`calculateCustomHash`) directly on-chain.
7. **Dedicated Role Credentials Authentication**:
   - Individual login screens & credentials for **Manufacturer** (`MFR-SEC-2026-KEY`), **Service Center** (`SC-AUTH-9988-SEC`), and **Customer / Owner**.
8. **1-Click Printable Certificate Generator**:
   - Official printable digital warranty documents with QR codes, cryptographic hashes, and authenticity seals.

---

## 🎯 Updated Technologies Used Table (Slide 9)

| Technology | Purpose in BlockSure |
| :--- | :--- |
| **Solidity (^0.8.20)** | Smart Contract Logic, State Machine & Role Security |
| **Ethereum / EVM** | Decentralized Execution & Ledger Storage |
| **Merkle Tree Proofs** | Batch Product Authenticity Verification |
| **ERC-721 NFT Model** | Tokenized Warranty Ownership & Transfers |
| **Ethers.js v6 & Web3** | Frontend Blockchain State Synchronization |
| **Keccak-256 + Polynomial** | Custom Non-SHA256 Product Fingerprinting |
| **HTML5 & CSS3** | Spacious Glassmorphism Web Dashboard |
| **Hardhat** | Smart Contract Testing & Deployment Framework |

---

## 🎤 Presentation Speaker Script & Key Talking Points

### Speaker 1 (R ALWIN EBENEZER):
> "Good morning / afternoon Professor. Today we present the enterprise version of **BlockSure**, a blockchain-based Electronic Warranty and Ownership Management system.
> We built a role-authenticated platform with dedicated security credentials for Manufacturers, Customers, and Authorized Service Centers.
> Every product is tokenized on-chain as a digital warranty NFT asset with Merkle tree batch verification."

### Speaker 2 (R PRAJIT):
> "Our smart contract uses a custom non-SHA256 cryptographic algorithm combining **Keccak-256 with a 31-bit polynomial shift checksum** (`calculateCustomHash`).
> Customers can file warranty repair claim tickets, transfer second-hand ownership, inspect authenticity health scores, and generate 1-click official printable digital warranty certificates with QR codes."
