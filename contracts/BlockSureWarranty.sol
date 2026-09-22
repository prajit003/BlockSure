// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BlockSureWarranty (Advanced Enterprise Version)
 * @author R ALWIN EBENEZER (25BCE5056) & R PRAJIT (25BCE5022) - VIT
 * @notice Decentralized Electronic Warranty & Ownership System
 * @dev Demonstrates Core Blockchain Concepts:
 *      1. Smart Contracts & EVM State Machine
 *      2. Tokenized Digital Asset Ownership (ERC-721 NFT Compatible)
 *      3. Cryptographic Merkle Tree Batch Proof Verification
 *      4. ECDSA Off-Chain Cryptographic Signature Verification (EIP-712)
 *      5. Multi-Sig Service Center Governance & Collateral Escrow
 *      6. Custom Non-SHA256 Keccak-Polynomial Checksum Hashing
 */
contract BlockSureWarranty {
    // Contract Owner / Admin
    address public admin;

    // Tokenized Asset Metadata (ERC-721 standard details)
    string public constant name = "BlockSure Warranty NFT";
    string public constant symbol = "BSW";

    // Enums
    enum Status { Registered, Active, ClaimPending, InRepair, Expired, Transferred }

    // Structs
    struct Product {
        uint256 id;
        string serialNumber;
        string modelName;
        string brand;
        address manufacturer;
        address currentOwner;
        uint256 registrationTimestamp;
        uint256 warrantyDurationSeconds;
        uint256 warrantyStartTimestamp;
        bool isActivated;
        Status status;
        bytes32 customFingerprintHash;
        bytes32 batchMerkleRoot;
    }

    struct ClaimTicket {
        uint256 ticketId;
        uint256 productId;
        address claimant;
        string issueDescription;
        uint256 timestamp;
        bool isResolved;
        uint256 escrowDepositWei;
    }

    struct RepairLog {
        uint256 timestamp;
        address serviceCenter;
        string description;
        string partsReplaced;
        uint256 costInWei;
    }

    // State Counters
    uint256 public nextProductId = 1;
    uint256 public nextClaimId = 1;

    // Merkle Roots
    mapping(bytes32 => bool) public validBatchMerkleRoots;

    // Multi-Sig Service Center Approval Trackers
    mapping(address => uint256) public serviceCenterApprovalsCount;
    mapping(address => mapping(address => bool)) public serviceCenterApprovedByMfr;
    mapping(address => bool) public isAuthorizedServiceCenter;
    uint256 public requiredMfrApprovals = 1;

    // Standard Mappings
    mapping(address => bool) public isManufacturer;
    mapping(uint256 => Product) public products;
    mapping(string => uint256) public serialToProductId;
    mapping(uint256 => RepairLog[]) public productRepairs;
    mapping(uint256 => address[]) public productOwnersHistory;
    mapping(uint256 => ClaimTicket[]) public productClaims;
    mapping(address => uint256[]) public ownerToProductIds;

    // ERC-721 Balance Mappings
    mapping(address => uint256) private _balances;

    // Events
    event ManufacturerAdded(address indexed manufacturer);
    event ServiceCenterProposed(address indexed serviceCenter, address indexed proposedBy);
    event ServiceCenterAuthorized(address indexed serviceCenter);
    event BatchMerkleRootSet(bytes32 indexed merkleRoot, uint256 timestamp);
    event ProductRegistered(
        uint256 indexed productId,
        string serialNumber,
        string modelName,
        address indexed manufacturer,
        bytes32 customHash
    );
    event WarrantyActivated(
        uint256 indexed productId,
        address indexed owner,
        uint256 expiryTimestamp
    );
    event ClaimFiled(
        uint256 indexed claimId,
        uint256 indexed productId,
        address indexed claimant,
        uint256 escrowDeposit
    );
    event RepairLogged(
        uint256 indexed productId,
        address indexed serviceCenter,
        string description,
        uint256 timestamp
    );
    event OwnershipTransferred(
        uint256 indexed productId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "BlockSure: Admin access required");
        _;
    }

    modifier onlyManufacturer() {
        require(isManufacturer[msg.sender] || msg.sender == admin, "BlockSure: Manufacturer access required");
        _;
    }

    modifier onlyServiceCenter() {
        require(isAuthorizedServiceCenter[msg.sender], "BlockSure: Authorized Service Center access required");
        _;
    }

    modifier onlyProductOwner(uint256 productId) {
        require(products[productId].id != 0, "BlockSure: Product does not exist");
        require(products[productId].currentOwner == msg.sender, "BlockSure: Product owner access required");
        _;
    }

    constructor() {
        admin = msg.sender;
        isManufacturer[msg.sender] = true;
        emit ManufacturerAdded(msg.sender);
    }

    // --- 1. GOVERNANCE & MULTI-SIG ROLE MANAGEMENT ---

    function addManufacturer(address _mfr) external onlyAdmin {
        require(_mfr != address(0), "Invalid address");
        isManufacturer[_mfr] = true;
        emit ManufacturerAdded(_mfr);
    }

    function approveServiceCenter(address _sc) external onlyManufacturer {
        require(_sc != address(0), "Invalid address");
        if (!serviceCenterApprovedByMfr[_sc][msg.sender]) {
            serviceCenterApprovedByMfr[_sc][msg.sender] = true;
            serviceCenterApprovalsCount[_sc]++;
            emit ServiceCenterProposed(_sc, msg.sender);
        }

        if (serviceCenterApprovalsCount[_sc] >= requiredMfrApprovals) {
            isAuthorizedServiceCenter[_sc] = true;
            emit ServiceCenterAuthorized(_sc);
        }
    }

    // --- 2. MERKLE TREE BATCH REGISTRATION & PROOF VERIFICATION ---

    function registerBatchMerkleRoot(bytes32 merkleRoot) external onlyManufacturer {
        validBatchMerkleRoots[merkleRoot] = true;
        emit BatchMerkleRootSet(merkleRoot, block.timestamp);
    }

    function verifyMerkleProof(
        bytes32 leaf,
        bytes32[] memory proof,
        bytes32 root
    ) public pure returns (bool) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == root;
    }

    // --- 3. CUSTOM NON-SHA256 FINGERPRINT & ECDSA SIGNATURE VERIFICATION ---

    function calculateCustomHash(
        string memory serialNumber,
        string memory modelName,
        address manufacturer,
        uint256 regTime
    ) public pure returns (bytes32) {
        bytes memory raw = abi.encodePacked(serialNumber, modelName, manufacturer, regTime);
        uint32 polyChecksum = 0;
        for (uint i = 0; i < raw.length; i++) {
            polyChecksum = (polyChecksum * 31) + uint8(raw[i]);
        }
        bytes32 keccakPart = keccak256(raw);
        return bytes32(uint256(keccakPart) ^ (uint256(polyChecksum) << 224));
    }

    function verifyManufacturerSignature(
        bytes32 hashMessage,
        bytes memory signature,
        address expectedSigner
    ) public pure returns (bool) {
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashMessage));
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s) == expectedSigner;
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    // --- 4. MANUFACTURER PRODUCT REGISTRATION ---

    function registerProduct(
        string memory serialNumber,
        string memory modelName,
        string memory brand,
        uint256 warrantyDurationDays,
        bytes32 batchMerkleRoot
    ) external onlyManufacturer returns (uint256) {
        require(bytes(serialNumber).length > 0, "Serial number required");
        require(serialToProductId[serialNumber] == 0, "Product already registered");

        uint256 productId = nextProductId++;
        uint256 durationSeconds = warrantyDurationDays * 1 days;
        bytes32 fingerprint = calculateCustomHash(serialNumber, modelName, msg.sender, block.timestamp);

        products[productId] = Product({
            id: productId,
            serialNumber: serialNumber,
            modelName: modelName,
            brand: brand,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            registrationTimestamp: block.timestamp,
            warrantyDurationSeconds: durationSeconds,
            warrantyStartTimestamp: 0,
            isActivated: false,
            status: Status.Registered,
            customFingerprintHash: fingerprint,
            batchMerkleRoot: batchMerkleRoot
        });

        serialToProductId[serialNumber] = productId;
        productOwnersHistory[productId].push(msg.sender);
        ownerToProductIds[msg.sender].push(productId);
        _balances[msg.sender]++;

        emit ProductRegistered(productId, serialNumber, modelName, msg.sender, fingerprint);
        return productId;
    }

    // --- 5. CUSTOMER WARRANTY ACTIVATION & EXTENSION ---

    function activateWarranty(uint256 productId) external {
        Product storage prod = products[productId];
        require(prod.id != 0, "Product not found");
        require(!prod.isActivated, "Already activated");

        prod.isActivated = true;
        prod.warrantyStartTimestamp = block.timestamp;
        prod.status = Status.Active;

        emit WarrantyActivated(productId, msg.sender, block.timestamp + prod.warrantyDurationSeconds);
    }

    function extendWarranty(uint256 productId, uint256 extraDays) external payable onlyProductOwner(productId) {
        Product storage prod = products[productId];
        require(prod.isActivated, "Must activate warranty first");

        prod.warrantyDurationSeconds += (extraDays * 1 days);
        if (prod.status == Status.Expired) {
            prod.status = Status.Active;
        }
    }

    // --- 6. WARRANTY CLAIMS & ESCROW DEPOSIT WORKFLOW ---

    function fileWarrantyClaim(uint256 productId, string memory issueDescription) external payable returns (uint256) {
        Product storage prod = products[productId];
        require(prod.id != 0, "Product not found");

        uint256 claimId = nextClaimId++;
        prod.status = Status.ClaimPending;

        productClaims[productId].push(ClaimTicket({
            ticketId: claimId,
            productId: productId,
            claimant: msg.sender,
            issueDescription: issueDescription,
            timestamp: block.timestamp,
            isResolved: false,
            escrowDepositWei: msg.value
        }));

        emit ClaimFiled(claimId, productId, msg.sender, msg.value);
        return claimId;
    }

    // --- 7. SERVICE CENTER REPAIR LOGS & CLAIM RESOLUTION ---

    function logRepair(
        uint256 productId,
        string memory description,
        string memory partsReplaced,
        uint256 costInWei
    ) external onlyServiceCenter {
        Product storage prod = products[productId];
        require(prod.id != 0, "Product not found");

        prod.status = Status.InRepair;

        productRepairs[productId].push(RepairLog({
            timestamp: block.timestamp,
            serviceCenter: msg.sender,
            description: description,
            partsReplaced: partsReplaced,
            costInWei: costInWei
        }));

        // Resolve open claims
        ClaimTicket[] storage claims = productClaims[productId];
        for (uint i = 0; i < claims.length; i++) {
            if (!claims[i].isResolved) {
                claims[i].isResolved = true;
                if (claims[i].escrowDepositWei > 0) {
                    payable(claims[i].claimant).transfer(claims[i].escrowDepositWei);
                }
            }
        }

        emit RepairLogged(productId, msg.sender, description, block.timestamp);
    }

    function completeRepair(uint256 productId) external onlyServiceCenter {
        Product storage prod = products[productId];
        require(prod.id != 0, "Product not found");

        uint256 expiry = prod.warrantyStartTimestamp + prod.warrantyDurationSeconds;
        if (prod.isActivated && block.timestamp <= expiry) {
            prod.status = Status.Active;
        } else {
            prod.status = Status.Expired;
        }
    }

    // --- 8. TOKENIZED NFT OWNERSHIP TRANSFER ---

    function transferOwnership(uint256 productId, address newOwner) external onlyProductOwner(productId) {
        require(newOwner != address(0) && newOwner != msg.sender, "Invalid recipient");

        Product storage prod = products[productId];
        address prevOwner = prod.currentOwner;

        _balances[prevOwner]--;
        _balances[newOwner]++;

        prod.currentOwner = newOwner;
        prod.status = Status.Transferred;

        productOwnersHistory[productId].push(newOwner);
        ownerToProductIds[newOwner].push(productId);

        emit OwnershipTransferred(productId, prevOwner, newOwner, block.timestamp);
    }

    // --- 9. ERC-721 VIEW COMPATIBILITY ---

    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = products[tokenId].currentOwner;
        require(owner != address(0), "Nonexistent token");
        return owner;
    }

    function balanceOf(address ownerAddr) external view returns (uint256) {
        require(ownerAddr != address(0), "Zero address query");
        return _balances[ownerAddr];
    }

    function getClaims(uint256 productId) external view returns (ClaimTicket[] memory) {
        return productClaims[productId];
    }

    function getRepairLogs(uint256 productId) external view returns (RepairLog[] memory) {
        return productRepairs[productId];
    }

    function getOwnershipHistory(uint256 productId) external view returns (address[] memory) {
        return productOwnersHistory[productId];
    }
}
