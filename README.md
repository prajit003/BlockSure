# BlockSure (Assurance): Electronic Warranty & Ownership Management using Blockchain

> **VIT Blockchain Project**  
> **Authors:**  
> 1. R ALWIN EBENEZER (25BCE5056)  
> 2. R PRAJIT (25BCE5022)  
> **Guide / Faculty:** Prof. NOEL JEYGAR ROBERT  

---

## 📌 Abstract & Overview

**BlockSure** is a blockchain-based platform designed to solve traditional paper-based warranty fraud, missing proof-of-purchase documents, unverified second-hand electronics sales, and tampered repair logs.

By leveraging **Solidity Smart Contracts** on Ethereum/EVM architecture, every lifecycle event of an electronic product (Registration, Warranty Activation, Repair/Maintenance, and Second-Hand Ownership Transfer) is immutably recorded on-chain.

---

## ⚡ Core Blockchain Concepts Implemented

1. **Smart Contracts & EVM State Machine**:
   - Manages state transitions: `Registered` ➔ `Active` ➔ `InRepair` ➔ `Expired` / `Transferred`.
2. **Role-Based Access Control (RBAC)**:
   - **Manufacturer**: Mints digital warranties & authorizes service centers.
   - **Customer / Owner**: Activates coverage & transfers second-hand ownership.
   - **Authorized Service Center**: Logs repair notes, parts replaced, and costs.
   - **Public Verifier**: Anyone can query authenticity & scan QR codes.
3. **Custom Non-SHA256 Cryptographic Hashing**:
   - Uses Ethereum native `Keccak-256` combined with a **31-bit Polynomial Shift Checksum** (`calculateCustomHash`), fulfilling the project requirement for a non-SHA256 fingerprint.
4. **Immutable Audit Trail & Event Logs**:
   - Emits on-chain events (`ProductRegistered`, `WarrantyActivated`, `RepairLogged`, `OwnershipTransferred`).

---

## 📁 Project Structure

```
BlockSure/
├── contracts/
│   └── BlockSureWarranty.sol   # Solidity Smart Contract (^0.8.20)
├── scripts/
│   └── deploy.js               # Hardhat / Node Deployment script
├── frontend/
│   ├── index.html              # Multi-Portal Web Dashboard UI
│   ├── app.js                  # Web3, Mock EVM Sim & QR Code Engine
│   └── styles.css              # Modern Dark Glassmorphism Styling
└── README.md                   # Project Documentation & Guide
```

---

## 🚀 How to Run & Demo

### Option 1: Instant Browser Demo (Zero Setup)
1. Navigate to the `frontend/` folder.
2. Open `index.html` directly in any web browser (Chrome, Edge, Firefox).
3. The app opens with a built-in **Live EVM In-Memory Simulator** pre-loaded with sample electronic products (MacBook Pro, Sony TV, Dell XPS).
4. Click through the 4 portals:
   - 🏭 **Manufacturer**: Register new products, authorize service centers.
   - 👤 **Customer**: Activate warranty coverage, initiate second-hand ownership transfers.
   - 🛠️ **Service Center**: Log repairs and maintenance.
   - 🔍 **Public Verifier**: Scan QR codes & inspect custom non-SHA256 tamper-evident fingerprint hashes.

### Option 2: MetaMask & Hardhat Local Blockchain Node
1. Install Hardhat or Foundry:
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```
2. Compile contract:
   ```bash
   npx hardhat compile
   ```
3. Deploy contract locally:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
4. Click the **🦊 MetaMask** toggle button in the top right of `index.html` to connect your browser wallet!

---

## 🛡️ Verification & Hash Calculation Algorithm

The custom non-SHA256 hash is generated as follows:

```javascript
function calculateCustomHash(serialNumber, modelName, mfrAddr, regTime) {
    const raw = `${serialNumber}_${modelName}_${mfrAddr}_${regTime}`;
    let polyChecksum = 0;
    for (let i = 0; i < raw.length; i++) {
        polyChecksum = (polyChecksum * 31 + raw.charCodeAt(i)) >>> 0;
    }
    const keccakHash = ethers.keccak256(ethers.toUtf8Bytes(raw));
    const polyHex = polyChecksum.toString(16).padStart(8, '0');
    return keccakHash.slice(0, 58) + polyHex;
}
```
