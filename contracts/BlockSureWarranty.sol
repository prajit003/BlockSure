// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BlockSureWarranty
 * @author R ALWIN EBENEZER (25BCE5056) & R PRAJIT (25BCE5022) - VIT
 * @notice Electronic Warranty and Ownership Management System using Blockchain
 * @dev Demonstrates Core Blockchain Concepts: Smart Contracts, State Machines,
 *      Role-Based Access Control, Custom Non-SHA256 Hashing, Event Audit Trails,
 *      and Tokenized Digital Asset Ownership.
 */
contract BlockSureWarranty {
    // Super Admin / Contract Owner
    address public admin;

    // Core Enums
    enum Status { Registered, Active, InRepair, Expired, Transferred }

    // Product Data Structure
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
        bytes32 customFingerprintHash; // Non-SHA256 Custom Keccak-Polynomial Hash
    }

    // Repair Record Data Structure
    struct RepairLog {
        uint256 timestamp;
        address serviceCenter;
        string description;
        string partsReplaced;
        uint256 costInWei;
    }

    // State Variables
    uint256 public nextProductId = 1;
    
    // Mappings
    mapping(address => bool) public isManufacturer;
    mapping(address => bool) public isServiceCenter;
    mapping(uint256 => Product) public products;
    mapping(string => uint256) public serialToProductId;
    mapping(uint256 => RepairLog[]) public productRepairs;
    mapping(uint256 => address[]) public productOwnersHistory;
    mapping(address => uint256[]) public ownerToProductIds;

    // Events (Immutable Blockchain Audit Trail)
    event ManufacturerAdded(address indexed manufacturer);
    event ServiceCenterAdded(address indexed serviceCenter);
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
    event ProductStatusUpdated(uint256 indexed productId, Status newStatus);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "BlockSure: Caller is not super admin");
        _;
    }

    modifier onlyManufacturer() {
        require(isManufacturer[msg.sender] || msg.sender == admin, "BlockSure: Unauthorized Manufacturer");
        _;
    }

    modifier onlyServiceCenter() {
        require(isServiceCenter[msg.sender], "BlockSure: Unauthorized Service Center");
        _;
    }

    modifier onlyProductOwner(uint256 productId) {
        require(products[productId].id != 0, "BlockSure: Product does not exist");
        require(products[productId].currentOwner == msg.sender, "BlockSure: Caller is not product owner");
        _;
    }

    constructor() {
        admin = msg.sender;
        isManufacturer[msg.sender] = true; // Admin is initial manufacturer
        emit ManufacturerAdded(msg.sender);
    }

    // --- ROLE MANAGEMENT ---

    function addManufacturer(address _mfr) external onlyAdmin {
        require(_mfr != address(0), "Invalid address");
        isManufacturer[_mfr] = true;
        emit ManufacturerAdded(_mfr);
    }

    function addServiceCenter(address _sc) external onlyManufacturer {
        require(_sc != address(0), "Invalid address");
        isServiceCenter[_sc] = true;
        emit ServiceCenterAdded(_sc);
    }

    // --- CUSTOM NON-SHA256 CRYPTOGRAPHIC HASHING ---

    /**
     * @notice Computes a custom tamper-evident cryptographic fingerprint.
     * @dev Uses Keccak-256 combined with a 31-bit polynomial shift checksum algorithm
     *      to provide a unique, lightweight non-SHA256 fingerprint as requested.
     */
    function calculateCustomHash(
        string memory serialNumber,
        string memory modelName,
        address manufacturer,
        uint256 regTime
    ) public pure returns (bytes32) {
        bytes memory raw = abi.encodePacked(serialNumber, modelName, manufacturer, regTime);
        
        // Polynomial rolling checksum (31 multiplier algorithm)
        uint32 polyChecksum = 0;
        for (uint i = 0; i < raw.length; i++) {
            polyChecksum = (polyChecksum * 31) + uint8(raw[i]);
        }
        
        // Combine EVM Keccak256 with polynomial checksum
        bytes32 keccakPart = keccak256(raw);
        return bytes32(uint256(keccakPart) ^ (uint256(polyChecksum) << 224));
    }

    // --- MANUFACTURER PORTAL FUNCTIONS ---

    function registerProduct(
        string memory serialNumber,
        string memory modelName,
        string memory brand,
        uint256 warrantyDurationDays
    ) external onlyManufacturer returns (uint256) {
        require(bytes(serialNumber).length > 0, "Serial number required");
        require(serialToProductId[serialNumber] == 0, "Product serial already registered");

        uint256 productId = nextProductId++;
        uint256 durationSeconds = warrantyDurationDays * 1 days;
        bytes32 fingerprint = calculateCustomHash(serialNumber, modelName, msg.sender, block.timestamp);

        products[productId] = Product({
            id: productId,
            serialNumber: serialNumber,
            modelName: modelName,
            brand: brand,
            manufacturer: msg.sender,
            currentOwner: msg.sender, // Initial owner is manufacturer
            registrationTimestamp: block.timestamp,
            warrantyDurationSeconds: durationSeconds,
            warrantyStartTimestamp: 0,
            isActivated: false,
            status: Status.Registered,
            customFingerprintHash: fingerprint
        });

        serialToProductId[serialNumber] = productId;
        productOwnersHistory[productId].push(msg.sender);
        ownerToProductIds[msg.sender].push(productId);

        emit ProductRegistered(productId, serialNumber, modelName, msg.sender, fingerprint);
        return productId;
    }

    // --- CUSTOMER PORTAL FUNCTIONS ---

    function activateWarranty(uint256 productId) external {
        Product storage prod = products[productId];
        require(prod.id != 0, "Product not found");
        require(!prod.isActivated, "Warranty already activated");
        
        // Either manufacturer or assigned customer can activate
        require(
            msg.sender == prod.currentOwner || msg.sender == prod.manufacturer,
            "Not authorized to activate warranty"
        );

        prod.isActivated = true;
        prod.warrantyStartTimestamp = block.timestamp;
        prod.status = Status.Active;

        emit WarrantyActivated(productId, msg.sender, block.timestamp + prod.warrantyDurationSeconds);
    }

    function transferOwnership(uint256 productId, address newOwner) external onlyProductOwner(productId) {
        require(newOwner != address(0), "Invalid new owner address");
        require(newOwner != msg.sender, "Cannot transfer to self");

        Product storage prod = products[productId];
        address prevOwner = prod.currentOwner;

        prod.currentOwner = newOwner;
        prod.status = Status.Transferred;
        
        productOwnersHistory[productId].push(newOwner);
        ownerToProductIds[newOwner].push(productId);

        emit OwnershipTransferred(productId, prevOwner, newOwner, block.timestamp);
    }

    // --- SERVICE CENTER PORTAL FUNCTIONS ---

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

        emit RepairLogged(productId, msg.sender, description, block.timestamp);
    }

    function completeRepair(uint256 productId) external onlyServiceCenter {
        Product storage prod = products[productId];
        require(prod.id != 0, "Product not found");
        require(prod.status == Status.InRepair, "Product not in repair state");

        if (prod.isActivated && block.timestamp <= (prod.warrantyStartTimestamp + prod.warrantyDurationSeconds)) {
            prod.status = Status.Active;
        } else {
            prod.status = Status.Expired;
        }

        emit ProductStatusUpdated(productId, prod.status);
    }

    // --- PUBLIC VERIFIER & VIEW FUNCTIONS ---

    function verifyWarranty(uint256 productId) external view returns (
        bool isCurrentlyValid,
        uint256 remainingSeconds,
        bytes32 customHash,
        address currentOwner,
        Status status,
        string memory serialNumber,
        string memory modelName,
        string memory brand
    ) {
        Product memory prod = products[productId];
        require(prod.id != 0, "Product does not exist");

        uint256 expiry = prod.warrantyStartTimestamp + prod.warrantyDurationSeconds;
        bool valid = prod.isActivated && (block.timestamp <= expiry);
        uint256 timeLeft = (valid && expiry > block.timestamp) ? (expiry - block.timestamp) : 0;

        return (
            valid,
            timeLeft,
            prod.customFingerprintHash,
            prod.currentOwner,
            prod.status,
            prod.serialNumber,
            prod.modelName,
            prod.brand
        );
    }

    function getRepairLogs(uint256 productId) external view returns (RepairLog[] memory) {
        return productRepairs[productId];
    }

    function getOwnershipHistory(uint256 productId) external view returns (address[] memory) {
        return productOwnersHistory[productId];
    }

    function getProductsOwnedBy(address ownerAddr) external view returns (uint256[] memory) {
        return ownerToProductIds[ownerAddr];
    }
}
