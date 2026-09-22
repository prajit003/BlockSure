# 📊 BlockSure Project - Updated Presentation Slides & Script
**Project:** Electronic Warranty and Ownership Management using Blockchain (BlockSure)  
**Authors:** R ALWIN EBENEZER (25BCE5056) & R PRAJIT (25BCE5022)  
**Guide / Faculty:** Prof. NOEL JEYGAR ROBERT  
**Institution:** VIT  

---

## ⚠️ Important Slide Updates (Review 1 Correction)

### Slide 9: Technologies Used (UPDATED)

| ❌ Previous Slide (Traditional Stack) | ✅ Updated Slide (Actual Smart Contract Stack) |
| :--- | :--- |
| • Java | • **Solidity** (Smart Contract Development) |
| • Spring Boot | • **Ethereum / EVM** (Blockchain Environment) |
| • MySQL | • **JavaScript** (Frontend & Web3 Logic) |
| • HTML / CSS | • **HTML5 & CSS3** (Responsive Web UI) |
| • JavaScript | • **Ethers.js** (Blockchain Library) |
| • SHA-256 Hashing | • **MetaMask** (Wallet Connectivity) |
| • Blockchain | • **Hardhat** (Deployment & Testing Framework) |
| | • **Keccak-256 + Polynomial Checksum** (Non-SHA256 Fingerprinting) |

---

## 🎯 Complete Presentation Slide Deck Breakdown

### Slide 1: Title
- **Title:** BlockSure: Electronic Warranty & Ownership Management using Blockchain
- **Team Members:**
  1. R ALWIN EBENEZER (25BCE5056)
  2. R PRAJIT (25BCE5022)
- **Institution:** VIT

### Slide 2: Review Overview
- **Review Stage:** Review 1
- **Faculty Guide:** Prof. NOEL JEYGAR ROBERT

### Slide 3: Abstract
- Paper-based electronic product warranties are easily lost, damaged, or forged.
- Buyers in second-hand markets lack reliable tools to verify authenticity, ownership, or repair histories.
- **BlockSure** provides a decentralized platform for Manufacturers, Customers, and Service Centers to track product lifecycles on an immutable blockchain ledger.

### Slide 4: Problem Statement
1. Paper warranty cards are vulnerable to physical damage and loss.
2. Fraudulent warranty claims are difficult to detect in legacy databases.
3. Second-hand buyers cannot verify device repair history or original ownership.
4. Traditional centralized databases allow unauthorized record modifications.

### Slide 5: Project Objectives
1. Develop a smart-contract-powered digital warranty system.
2. Securely handle second-hand ownership transfers on-chain.
3. Maintain transparent maintenance & repair audit logs.
4. Eliminate warranty fraud via cryptographic product fingerprinting.
5. Build trust between manufacturers, buyers, and service centers.

### Slide 6: Proposed System Architecture & Lifecycle
```
Manufacturer (Minting)
      ↓
Product Registration (On-Chain Hash)
      ↓
Customer Purchase & Warranty Activation
      ↓
Service Center Maintenance Logs
      ↓
Second-Hand Ownership Transfer
```

### Slide 7: Why Blockchain?
1. **Tamper-Evident Records:** No unauthorized data modification.
2. **Transparency:** Public verification for second-hand buyers.
3. **Product Traceability:** Every repair & transfer event logged with timestamps.
4. **Decentralized Trust:** Replaces reliance on single corporate databases.

### Slide 8: Updated Technology Stack
- **Solidity (^0.8.20):** Smart contract business logic.
- **EVM (Ethereum Virtual Machine):** Decentralized execution layer.
- **Ethers.js v6 & Web3:** Frontend blockchain integration.
- **MetaMask & EVM Simulator:** Dual-mode transaction testing.
- **Keccak-256 + Polynomial Checksum:** Custom non-SHA256 cryptographic fingerprint algorithm.

### Slide 9: Expected Outcomes & Impact
- Digital tokenized warranty records.
- Tamper-proof second-hand ownership management.
- Transparent repair logs for service centers.
- Drastic reduction in warranty fraud.

### Slide 10: Live Demonstration & Future Scope
- **Live Demo:** Multi-portal Web App (Manufacturer, Customer, Service Center, Public Verifier).
- **Future Scope:** On-chain QR verification scanning app, IoT sensor integration for auto-diagnostics.

---

## 🎤 Presentation Speaker Script & Talking Points

### Speaker 1 (R ALWIN EBENEZER):
> "Good morning / afternoon Professor. Today we present **BlockSure**, a blockchain-based Electronic Warranty and Ownership Management system.
> In traditional retail and second-hand electronics markets, paper warranty cards can be lost or forged, and centralized databases can be modified behind closed doors.
> Our system records every critical product event—from manufacturing to customer activation, repairs, and ownership transfers—as an immutable blockchain transaction."

### Speaker 2 (R PRAJIT):
> "Instead of standard SHA-256, our project implements Ethereum native **Keccak-256 combined with a 31-bit polynomial shift checksum** (`calculateCustomHash`) directly inside our Solidity smart contract.
> We built a full Web frontend featuring 4 separate portals for Manufacturers, Customers, Service Centers, and Public QR Verifiers, supported by both an instant EVM Browser Simulator and MetaMask Web3 connectivity."
