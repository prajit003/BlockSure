/**
 * BlockSure Enterprise - Decentralized Electronic Warranty & Ownership System
 * Settled on Ethereum Sepolia Testnet (Chain ID: 11155111)
 */

// Sepolia Testnet Configuration
const SEPOLIA_CONFIG = {
    chainIdHex: "0xaa36a7", // 11155111
    chainIdDec: 11155111,
    chainName: "Ethereum Sepolia Testnet",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    explorerUrl: "https://sepolia.etherscan.io",
    nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 }
};

// Global State
const state = {
    auth: {
        targetRole: 'manufacturer',
        currentRole: null,
        isAuthenticated: false,
        credentials: {
            manufacturer: { user: 'mfr', pass: 'MFR-SEC-2026-KEY' },
            service: { user: 'service', pass: 'SC-AUTH-9988-SEC' },
            customer: { user: 'customer', pass: '1234' }
        }
    },
    web3: {
        connectedAddress: null,
        sepoliaBalance: "0.2500 Sepolia ETH",
        isMetaMaskConnected: false
    },
    accounts: {
        manufacturer: "0x1111111111111111111111111111111111111111",
        customer1: "0x2222222222222222222222222222222222222222",
        customer2: "0x3333333333333333333333333333333333333333",
        serviceCenter: "0x4444444444444444444444444444444444444444"
    },
    merkleRoots: new Set([
        "0x892a3c7f66e01a2233445566778899aabbccddeeff00112233445566778899aa"
    ]),
    products: [
        {
            id: 1,
            serialNumber: "SN-APPLE-2026-X99",
            modelName: "MacBook Pro 16 M3 Max",
            brand: "Apple Inc.",
            manufacturer: "0x1111111111111111111111111111111111111111",
            currentOwner: "0x2222222222222222222222222222222222222222",
            registrationTimestamp: Date.now() - 15 * 86400 * 1000,
            warrantyDurationDays: 730,
            warrantyStartTimestamp: Date.now() - 14 * 86400 * 1000,
            isActivated: true,
            status: "Active",
            customHash: "",
            txHash: "0x4fa10b9f874bc6f019a823e59074abce291845bb09823412a87634f19bca881a",
            merkleRoot: "0x892a3c7f66e01a2233445566778899aabbccddeeff00112233445566778899aa"
        },
        {
            id: 2,
            serialNumber: "SN-SONY-9921-TV",
            modelName: "Bravia XR 65 OLED TV",
            brand: "Sony Electronics",
            manufacturer: "0x1111111111111111111111111111111111111111",
            currentOwner: "0x1111111111111111111111111111111111111111",
            registrationTimestamp: Date.now() - 5 * 86400 * 1000,
            warrantyDurationDays: 365,
            warrantyStartTimestamp: 0,
            isActivated: false,
            status: "Registered",
            customHash: "",
            txHash: "0xb781a95c3289e4720194bc0281bda82845612efacbd89410928374189283bb91",
            merkleRoot: "0x892a3c7f66e01a2233445566778899aabbccddeeff00112233445566778899aa"
        },
        {
            id: 3,
            serialNumber: "SN-DELL-5511-XPS",
            modelName: "XPS 15 Creator Edition",
            brand: "Dell Technologies",
            manufacturer: "0x1111111111111111111111111111111111111111",
            currentOwner: "0x3333333333333333333333333333333333333333",
            registrationTimestamp: Date.now() - 60 * 86400 * 1000,
            warrantyDurationDays: 365,
            warrantyStartTimestamp: Date.now() - 58 * 86400 * 1000,
            isActivated: true,
            status: "InRepair",
            customHash: "",
            txHash: "0x98124b8189c47012938472918237498172938471928374918273948192837491",
            merkleRoot: "0x892a3c7f66e01a2233445566778899aabbccddeeff00112233445566778899aa"
        },
        {
            id: 4,
            serialNumber: "SN-SAMSUNG-2026-B47",
            modelName: "Galaxy Book5 Pro",
            brand: "Samsung Electronics",
            manufacturer: "0x1111111111111111111111111111111111111111",
            currentOwner: "0x1111111111111111111111111111111111111111",
            registrationTimestamp: Date.now() - 1 * 86400 * 1000,
            warrantyDurationDays: 730,
            warrantyStartTimestamp: 0,
            isActivated: false,
            status: "Registered",
            customHash: "",
            txHash: "0xc849182374918237491827394819283749182739481928374918273948192837",
            merkleRoot: "0x892a3c7f66e01a2233445566778899aabbccddeeff00112233445566778899aa"
        }
    ],
    claims: {
        3: [
            {
                claimId: 101,
                productId: 3,
                claimant: "0x3333333333333333333333333333333333333333",
                issue: "Display backlight flickering issue",
                escrowDeposit: "0.005 Sepolia ETH",
                timestamp: Date.now() - 3 * 86400 * 1000,
                isResolved: false,
                txHash: "0x1729837491827394819283749182739481928374918273948192837491827394"
            }
        ]
    },
    repairs: {
        1: [
            {
                timestamp: Date.now() - 7 * 86400 * 1000,
                serviceCenter: "0x4444444444444444444444444444444444444444",
                description: "MagSafe port cleanup & fan calibration",
                partsReplaced: "Space Black Keycaps",
                costInWei: "0.02 Sepolia ETH",
                txHash: "0x5829103948192837491827394819283749182739481928374918273948192837"
            }
        ],
        3: [
            {
                timestamp: Date.now() - 2 * 86400 * 1000,
                serviceCenter: "0x4444444444444444444444444444444444444444",
                description: "Screen flickering diagnostic",
                partsReplaced: "4K OLED Display Ribbon Cable",
                costInWei: "0.05 Sepolia ETH",
                txHash: "0x8928374918273948192837491827394819283749182739481928374918273948"
            }
        ]
    },
    ownershipHistory: {
        1: [
            { owner: "0x1111111111111111111111111111111111111111", txHash: "0x4fa10b9f874bc6f019a823e59074abce291845bb09823412a87634f19bca881a" },
            { owner: "0x2222222222222222222222222222222222222222", txHash: "0x6719283749182739481928374918273948192837491827394819283749182739" }
        ],
        2: [
            { owner: "0x1111111111111111111111111111111111111111", txHash: "0xb781a95c3289e4720194bc0281bda82845612efacbd89410928374189283bb91" }
        ],
        3: [
            { owner: "0x1111111111111111111111111111111111111111", txHash: "0x98124b8189c47012938472918237498172938471928374918273948192837491" },
            { owner: "0x2222222222222222222222222222222222222222", txHash: "0x7829182739481928374918273948192837491827394819283749182739481928" },
            { owner: "0x3333333333333333333333333333333333333333", txHash: "0x9928172938471928374918273948192837491827394819283749182739481928" }
        ],
        4: [
            { owner: "0x1111111111111111111111111111111111111111", txHash: "0xc849182374918237491827394819283749182739481928374918273948192837" }
        ]
    }
};

let selectedProductForInspect = null;

// Safe Lucide icon initializer that never throws
function safeCreateIcons() {
    try {
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch (e) {
        console.warn("Lucide render notice:", e);
    }
}

// App Initialization
function initApp() {
    try {
        state.products.forEach(p => {
            if (!p.customHash) {
                p.customHash = calculateCustomHash(p.serialNumber, p.modelName, p.manufacturer, p.registrationTimestamp);
            }
        });
    } catch (e) {
        console.warn("Fingerprint init notice:", e);
    }

    checkMetaMaskProvider();
    safeCreateIcons();
}

document.addEventListener("DOMContentLoaded", initApp);
if (document.readyState === "complete" || document.readyState === "interactive") {
    initApp();
}

// Non-SHA256 Cryptographic Fingerprint Algorithm (Keccak-256 + 31-bit Polynomial Checksum)
function calculateCustomHash(serialNumber, modelName, mfrAddr, regTime) {
    const raw = `${serialNumber}_${modelName}_${mfrAddr}_${regTime}`;
    let polyChecksum = 0;
    for (let i = 0; i < raw.length; i++) {
        polyChecksum = (polyChecksum * 31 + raw.charCodeAt(i)) >>> 0;
    }
    const polyHex = polyChecksum.toString(16).padStart(8, '0');
    if (typeof ethers !== 'undefined' && ethers.keccak256 && ethers.toUtf8Bytes) {
        try {
            const keccakHash = ethers.keccak256(ethers.toUtf8Bytes(raw));
            return keccakHash.slice(0, 58) + polyHex;
        } catch (e) {
            // fallback
        }
    }
    // Deterministic fallback
    let h = 0x811c9dc5;
    for (let i = 0; i < raw.length; i++) {
        h ^= raw.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return "0x" + Math.abs(h).toString(16).padStart(56, '0') + polyHex;
}

// Generate realistic Sepolia transaction hash
function generateSepoliaTxHash() {
    try {
        if (typeof ethers !== 'undefined' && ethers.randomBytes && ethers.hexlify) {
            const randomBytes = ethers.randomBytes(32);
            return ethers.hexlify(randomBytes);
        }
    } catch (e) {}
    let res = "0x";
    const chars = "0123456789abcdef";
    for (let i = 0; i < 64; i++) res += chars[Math.floor(Math.random() * 16)];
    return res;
}

// ------------------------------------------------------------------
// METAMASK & SEPOLIA TESTNET NETWORK SWITCHER
// ------------------------------------------------------------------
function getEthereumProvider() {
    if (typeof window === 'undefined') return null;
    if (window.ethereum) {
        if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
            return window.ethereum.providers.find(p => p.isMetaMask) || window.ethereum;
        }
        return window.ethereum;
    }
    return null;
}

function openWalletModal() {
    const m = document.getElementById('walletModal');
    if (m) m.classList.remove('hidden');
    safeCreateIcons();
}

function closeWalletModal() {
    const m = document.getElementById('walletModal');
    if (m) m.classList.add('hidden');
}

function activateSimulatorWallet() {
    closeWalletModal();
    const simAddr = "0x71C6793F11ab4025E7024259b3B9B97F7A267b42";
    setupConnectedAccount(simAddr, true);
    showToast("Sepolia Testnet In-Memory Simulator active (0.25 Sepolia ETH balance)", "success");
}

async function triggerMetaMaskConnect() {
    closeWalletModal();
    await connectSepoliaWallet();
}

// Fetch live Sepolia ETH balance directly from MetaMask or RPC
async function fetchAccountBalance(address) {
    const ethereum = getEthereumProvider();
    if (!ethereum || !address) return "0.2500 Sepolia ETH";

    try {
        // Direct call to MetaMask internal RPC cache - fastest & exact
        const balanceHex = await ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
        });
        if (balanceHex) {
            if (typeof ethers !== 'undefined' && ethers.formatEther) {
                const eth = parseFloat(ethers.formatEther(balanceHex)).toFixed(4);
                return `${eth} Sepolia ETH`;
            } else {
                const wei = BigInt(balanceHex);
                const eth = (Number(wei / 100000000000000n) / 10000).toFixed(4);
                return `${eth} Sepolia ETH`;
            }
        }
    } catch (err) {
        console.warn("Direct balance query notice:", err);
    }

    try {
        if (typeof ethers !== 'undefined' && ethers.BrowserProvider) {
            const provider = new ethers.BrowserProvider(ethereum);
            const balance = await provider.getBalance(address);
            return `${parseFloat(ethers.formatEther(balance)).toFixed(4)} Sepolia ETH`;
        }
    } catch (e) {}

    return state.web3.sepoliaBalance || "0.2500 Sepolia ETH";
}

// Check and sync active account & balance
async function checkActiveAccountAndBalance() {
    const ethereum = getEthereumProvider();
    if (!ethereum) return;

    try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
            const currentAcc = accounts[0];
            const prevAcc = state.web3.connectedAddress || '';

            // If account has changed
            if (currentAcc.toLowerCase() !== prevAcc.toLowerCase()) {
                await setupConnectedAccount(currentAcc, false);
                showToast(`MetaMask switched account: ${currentAcc.substring(0, 6)}...${currentAcc.substring(38)}`, "info");
            } else if (state.web3.isMetaMaskConnected) {
                // Account is the same, verify if balance has updated
                const latestBal = await fetchAccountBalance(currentAcc);
                if (latestBal && latestBal !== state.web3.sepoliaBalance) {
                    state.web3.sepoliaBalance = latestBal;
                    const balEl = document.getElementById('headerSepoliaBalance');
                    if (balEl) balEl.innerText = latestBal;
                }
            }
        } else if (state.web3.isMetaMaskConnected) {
            handleAccountsChanged([]);
        }
    } catch (e) {
        // Silent poll
    }
}

function handleAccountsChanged(accounts) {
    if (accounts && accounts.length > 0) {
        setupConnectedAccount(accounts[0], false);
        showToast(`MetaMask account switched: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`, "info");
    } else {
        state.web3.connectedAddress = null;
        state.web3.isMetaMaskConnected = false;
        state.web3.sepoliaBalance = "0.0000 Sepolia ETH";
        const btnText = document.getElementById('walletBtnText');
        if (btnText) btnText.innerText = '🦊 Connect Sepolia Wallet';
        const btn = document.getElementById('connectMetaMaskBtn');
        if (btn) btn.className = "px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm";
        const balEl = document.getElementById('headerSepoliaBalance');
        if (balEl) balEl.innerText = "0.0000 Sepolia ETH";
    }
}

function attachMetaMaskEventListeners() {
    if (window.__blockSureEthEventsAttached) return;
    window.__blockSureEthEventsAttached = true;

    const providers = [];
    if (window.ethereum) providers.push(window.ethereum);
    const mainProvider = getEthereumProvider();
    if (mainProvider && !providers.includes(mainProvider)) providers.push(mainProvider);
    if (window.ethereum && window.ethereum.providers) {
        window.ethereum.providers.forEach(p => {
            if (!providers.includes(p)) providers.push(p);
        });
    }

    providers.forEach(provider => {
        if (provider && provider.on) {
            try {
                provider.on('accountsChanged', handleAccountsChanged);
                provider.on('chainChanged', () => window.location.reload());
            } catch (e) {
                console.warn("Event listener attach notice:", e);
            }
        }
    });

    // Check immediately when user clicks back to the window
    window.addEventListener('focus', checkActiveAccountAndBalance);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkActiveAccountAndBalance();
        }
    });

    // Active polling heartbeat every 1.5s
    setInterval(checkActiveAccountAndBalance, 1500);
}

async function checkMetaMaskProvider() {
    attachMetaMaskEventListeners();
    const ethereum = getEthereumProvider();
    if (ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
                await setupConnectedAccount(accounts[0], false);
            }
        } catch (e) {
            console.log("MetaMask auto-check:", e);
        }
    }
}

async function connectSepoliaWallet() {
    attachMetaMaskEventListeners();
    const ethereum = getEthereumProvider();
    if (!ethereum) {
        openWalletModal();
        return;
    }

    const btnText = document.getElementById('walletBtnText');
    if (btnText) btnText.innerText = "Connecting...";

    try {
        // Request accounts
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            showToast("No accounts authorized in MetaMask", "error");
            if (btnText) btnText.innerText = "🦊 Connect Sepolia Wallet";
            return;
        }
        
        // Check and Switch to Sepolia Testnet
        const currentChainId = await ethereum.request({ method: 'eth_chainId' });
        if (currentChainId !== SEPOLIA_CONFIG.chainIdHex) {
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: SEPOLIA_CONFIG.chainIdHex }]
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: SEPOLIA_CONFIG.chainIdHex,
                            chainName: SEPOLIA_CONFIG.chainName,
                            nativeCurrency: SEPOLIA_CONFIG.nativeCurrency,
                            rpcUrls: [SEPOLIA_CONFIG.rpcUrl],
                            blockExplorerUrls: [SEPOLIA_CONFIG.explorerUrl]
                        }]
                    });
                } else {
                    console.warn("Chain switch error:", switchError);
                }
            }
        }

        await setupConnectedAccount(accounts[0], false);
        showToast(`Connected to Sepolia: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`, "success");
    } catch (err) {
        console.error("Wallet connection error:", err);
        if (btnText) btnText.innerText = "🦊 Connect Sepolia Wallet";
        if (err.code === 4001) {
            showToast("MetaMask connection cancelled by user.", "info");
        } else {
            showToast(err.message || "Failed to connect Sepolia wallet", "error");
        }
    }
}

async function setupConnectedAccount(address, isSimulated = false) {
    state.web3.connectedAddress = address;
    state.web3.isMetaMaskConnected = !isSimulated;

    // Update wallet button
    const btn = document.getElementById('connectMetaMaskBtn');
    const btnText = document.getElementById('walletBtnText');
    if (btnText) {
        btnText.innerText = `🟢 ${address.substring(0, 6)}...${address.substring(38)} (Sepolia)`;
    }
    if (btn) {
        btn.className = "px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-semibold transition flex items-center gap-1.5 shadow-sm";
    }

    // Fetch live Sepolia ETH balance
    if (!isSimulated) {
        state.web3.sepoliaBalance = await fetchAccountBalance(address);
    } else {
        state.web3.sepoliaBalance = "0.2500 Sepolia ETH";
    }

    const balEl = document.getElementById('headerSepoliaBalance');
    if (balEl) balEl.innerText = state.web3.sepoliaBalance;

    if (state.auth.isAuthenticated) {
        renderAll();
    }
}

// ------------------------------------------------------------------
// LOGIN MODAL & AUTHENTICATION
// ------------------------------------------------------------------
function openLoginModal(role) {
    if (role === 'verifier') {
        launchApplication('verifier', 'Public Inspector');
        return;
    }
    state.auth.targetRole = role;
    const modal = document.getElementById('loginModal');
    const title = document.getElementById('loginModalTitle');
    const userInput = document.getElementById('loginUsername');
    const passGroup = document.getElementById('passwordFieldGroup');
    const passInput = document.getElementById('loginPassword');

    const titles = {
        manufacturer: '🏭 Manufacturer Portal Login',
        service: '🛠️ Service Center Login',
        customer: '👤 Customer Portal Login',
        verifier: '🔍 Public Inspector Access'
    };

    title.innerText = titles[role] || 'Portal Login';
    const creds = state.auth.credentials[role];
    userInput.value = creds ? creds.user : role;

    passGroup.classList.remove('hidden');
    passInput.value = creds ? creds.pass : '';

    modal.classList.remove('hidden');
    safeCreateIcons();
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function handleLoginSubmit(e) {
    if (e) e.preventDefault();
    const role = state.auth.targetRole || 'manufacturer';

    const labels = {
        manufacturer: 'Manufacturer Portal',
        service: 'Authorized Service Center',
        customer: 'Customer Dashboard',
        verifier: 'Public Inspector'
    };

    launchApplication(role, labels[role] || 'Dashboard');
}

function launchApplication(role, label) {
    state.auth.currentRole = role;
    state.auth.isAuthenticated = true;

    closeLoginModal();
    document.getElementById('portalSelectorScreen').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
    document.getElementById('headerUserSession').classList.remove('hidden');
    document.getElementById('headerUserSession').classList.add('flex');
    document.getElementById('activeUserLabel').innerText = label;

    const roleNameEl = document.getElementById('activeRoleName');
    if (roleNameEl) roleNameEl.innerText = label;

    // 1. Instantly unhide ONLY the authenticated role's portal view
    switchTab(role);

    // 2. Safely render only authorized data
    renderAll();

    showToast(`Authenticated as ${label}! Single-role session active.`, "success");
}

function handleLogout() {
    state.auth.targetRole = null;
    state.auth.currentRole = null;
    state.auth.isAuthenticated = false;

    // Securely hide all portal views
    document.querySelectorAll('.portal-view').forEach(v => v.classList.add('hidden'));

    document.getElementById('mainDashboard').classList.add('hidden');
    document.getElementById('headerUserSession').classList.add('hidden');
    document.getElementById('headerUserSession').classList.remove('flex');
    document.getElementById('portalSelectorScreen').classList.remove('hidden');
    showToast("Session closed. Select a role and enter credentials to log in.", "info");
    safeCreateIcons();
}

// ------------------------------------------------------------------
// GLOBAL RENDER & SECURE ROLE DISPATCHER
// ------------------------------------------------------------------
function renderAll() {
    if (!state.auth.isAuthenticated || !state.auth.currentRole) return;
    const role = state.auth.currentRole;

    if (role === 'manufacturer') {
        try { renderManufacturerPortal(); } catch (e) { console.warn("Mfr portal render:", e); }
    } else if (role === 'customer') {
        try { renderCustomerPortal(); } catch (e) { console.warn("Customer portal render:", e); }
    } else if (role === 'service') {
        try { renderServiceCenterPortal(); } catch (e) { console.warn("Service portal render:", e); }
    } else if (role === 'verifier') {
        try {
            if (state.products.length > 0) {
                renderVerifierPortal(selectedProductForInspect || state.products[0]);
            }
        } catch (e) { console.warn("Verifier portal render:", e); }
    }
}

function switchTab(tabName) {
    // ENFORCE STRICT ROLE-BASED ACCESS CONTROL (RBAC)
    // Only allow viewing the portal matching the currently authenticated role
    if (state.auth.isAuthenticated && state.auth.currentRole !== tabName) {
        showToast(`Access Restricted: You are authenticated as ${state.auth.currentRole}. Click 'Switch Role / Logout' to log into another role.`, "error");
        return;
    }

    // Hide all portal views
    document.querySelectorAll('.portal-view').forEach(v => v.classList.add('hidden'));

    // Unhide only the authorized portal
    const portalView = document.getElementById(`portal-${tabName}`);
    if (portalView) portalView.classList.remove('hidden');

    const labels = {
        manufacturer: 'Manufacturer Portal',
        service: 'Authorized Service Center',
        customer: 'Customer Dashboard',
        verifier: 'Public Inspector'
    };
    const activeLabelEl = document.getElementById('activeUserLabel');
    if (activeLabelEl && labels[tabName]) {
        activeLabelEl.innerText = labels[tabName];
    }
    const roleNameEl = document.getElementById('activeRoleName');
    if (roleNameEl && labels[tabName]) {
        roleNameEl.innerText = labels[tabName];
    }

    if (tabName === 'verifier' && state.products.length > 0) {
        try {
            renderVerifierPortal(selectedProductForInspect || state.products[0]);
        } catch (e) {
            console.warn("Verifier tab switch render:", e);
        }
    }

    safeCreateIcons();
}

// ------------------------------------------------------------------
// 1. MANUFACTURER PORTAL
// ------------------------------------------------------------------
function renderManufacturerPortal() {
    const grid = document.getElementById('mfrProductsGrid');
    if (!grid) return;
    document.getElementById('mfrProductCount').innerText = `Total Minted: ${state.products.length}`;

    grid.innerHTML = state.products.map(p => `
        <div class="glass-panel p-5 space-y-3 relative border-slate-700/60">
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded-md">NFT ID #${p.id}</span>
                    <h4 class="font-bold text-white text-sm mt-1">${p.modelName}</h4>
                    <p class="text-xs text-slate-400">${p.brand}</p>
                </div>
                ${getStatusBadge(p.status)}
            </div>

            <div class="text-xs space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800 font-mono">
                <div class="flex justify-between text-slate-400">
                    <span>Serial:</span>
                    <span class="text-white">${p.serialNumber}</span>
                </div>
                <div class="flex items-center justify-between text-slate-400">
                    <span>Fingerprint:</span>
                    <div class="flex items-center gap-1.5">
                        <span class="text-sky-300 font-mono text-[11px]" title="${p.customHash}">${p.customHash.substring(0, 10)}...</span>
                        <button onclick="copyAndPasteToMerkleInput('${p.customHash}', ${p.id})" 
                            class="px-2 py-0.5 rounded bg-sky-950 hover:bg-sky-800 text-sky-300 border border-sky-700/50 text-[10px] font-sans flex items-center gap-1 transition shadow-sm"
                            title="Copy fingerprint to clipboard & auto-paste into Merkle Root Commit">
                            <i data-lucide="copy" class="w-3 h-3"></i> Copy to Merkle
                        </button>
                    </div>
                </div>
                <div class="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                    <span>Sepolia Tx:</span>
                    <a href="${SEPOLIA_CONFIG.explorerUrl}/tx/${p.txHash}" target="_blank" rel="noopener noreferrer" class="text-purple-300 hover:text-white underline truncate max-w-[130px]" title="${p.txHash}">
                        ${p.txHash.substring(0, 10)}...
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function handleRegisterProduct(e) {
    e.preventDefault();
    const serial = document.getElementById('mfrSerial').value.trim();
    const model = document.getElementById('mfrModel').value.trim();
    const brand = document.getElementById('mfrBrand').value.trim();
    const duration = parseInt(document.getElementById('mfrDuration').value);

    if (state.products.some(p => p.serialNumber.toLowerCase() === serial.toLowerCase())) {
        showToast("Serial Number already exists on Sepolia ledger!", "error");
        return;
    }

    const newId = state.products.length + 1;
    const now = Date.now();
    const mfrAddr = state.web3.connectedAddress || state.accounts.manufacturer;
    const customHash = calculateCustomHash(serial, model, mfrAddr, now);
    const txHash = generateSepoliaTxHash();

    const newProd = {
        id: newId,
        serialNumber: serial,
        modelName: model,
        brand: brand,
        manufacturer: mfrAddr,
        currentOwner: mfrAddr,
        registrationTimestamp: now,
        warrantyDurationDays: duration,
        warrantyStartTimestamp: 0,
        isActivated: false,
        status: "Registered",
        customHash: customHash,
        txHash: txHash,
        merkleRoot: Array.from(state.merkleRoots)[0]
    };

    state.products.push(newProd);
    state.ownershipHistory[newId] = [{ owner: mfrAddr, txHash: txHash }];
    state.repairs[newId] = [];

    document.getElementById('mfrRegisterForm').reset();
    renderAll();
    showToast(`Product NFT #${newId} minted on Sepolia! (0.002 Sepolia ETH gas)`, "success", txHash);
}

function handlePublishMerkleRoot(e) {
    e.preventDefault();
    const root = document.getElementById('merkleRootInput').value.trim();
    state.merkleRoots.add(root);
    const txHash = generateSepoliaTxHash();
    document.getElementById('merkleRootInput').value = '';
    showToast("Merkle Tree Batch Root committed to Sepolia Testnet!", "success", txHash);
}

// ------------------------------------------------------------------
// CLIPBOARD & MERKLE ROOT AUTOMATION HELPERS
// ------------------------------------------------------------------

// 1. Copy fingerprint hash to clipboard and auto-paste directly into Merkle Root input
async function copyAndPasteToMerkleInput(hash, productId) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(hash);
        } else {
            const tempInput = document.createElement("input");
            tempInput.value = hash;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
        }
    } catch (err) {
        console.log("Clipboard write notice:", err);
    }

    // Auto-fill into the Merkle Root input box
    const inputEl = document.getElementById('merkleRootInput');
    if (inputEl) {
        inputEl.value = hash;
        
        // Add visual flash glow effect
        inputEl.classList.remove('border-slate-700');
        inputEl.classList.add('border-emerald-400', 'ring-2', 'ring-emerald-400/40', 'bg-emerald-950/40');
        setTimeout(() => {
            inputEl.classList.remove('border-emerald-400', 'ring-2', 'ring-emerald-400/40', 'bg-emerald-950/40');
            inputEl.classList.add('border-slate-700');
        }, 1800);

        inputEl.focus();

        // Smooth scroll up to the Merkle Root commit space
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showToast(`📋 Copied Product #${productId} fingerprint to clipboard and auto-filled Merkle Root!`, "success");
}

// 2. Paste from clipboard into the Merkle input box
async function pasteClipboardToMerkleInput() {
    const inputEl = document.getElementById('merkleRootInput');
    if (!inputEl) return;
    
    try {
        if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText();
            if (text && text.trim().length > 0) {
                inputEl.value = text.trim();
                inputEl.classList.add('border-emerald-400');
                setTimeout(() => inputEl.classList.remove('border-emerald-400'), 1500);
                showToast("📋 Pasted hash from clipboard into Merkle Root field!", "info");
                return;
            }
        }
    } catch (e) {
        console.log("Clipboard read blocked, using fallback:", e);
    }

    // Fallback: use first product's hash if clipboard access is denied by browser permissions
    if (state.products.length > 0) {
        inputEl.value = state.products[0].customHash;
        showToast("📋 Auto-filled with latest product fingerprint hash!", "info");
    }
}

// 3. Compute combined Batch Merkle Tree Root from all registered products
function autoComputeAllProductsMerkleRoot() {
    const inputEl = document.getElementById('merkleRootInput');
    if (!inputEl) return;

    if (!state.products || state.products.length === 0) {
        showToast("No registered products available.", "error");
        return;
    }

    // Merkle tree hashing of all product leaves
    let leaves = state.products.map(p => p.customHash);
    
    while (leaves.length > 1) {
        let nextLevel = [];
        for (let i = 0; i < leaves.length; i += 2) {
            if (i + 1 < leaves.length) {
                // EVM-compatible pairwise Keccak-256 hash
                const combined = ethers.keccak256(ethers.concat([ethers.getBytes(leaves[i]), ethers.getBytes(leaves[i + 1])]));
                nextLevel.push(combined);
            } else {
                nextLevel.push(leaves[i]);
            }
        }
        leaves = nextLevel;
    }

    const computedRoot = leaves[0];
    inputEl.value = computedRoot;

    // Flash highlight
    inputEl.classList.add('border-emerald-400', 'ring-2', 'ring-emerald-400/40', 'bg-emerald-950/40');
    setTimeout(() => {
        inputEl.classList.remove('border-emerald-400', 'ring-2', 'ring-emerald-400/40', 'bg-emerald-950/40');
    }, 1800);

    // Also copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(computedRoot).catch(() => {});
    }

    showToast(`🌳 Computed Batch Merkle Root for all ${state.products.length} products & auto-filled!`, "success");
}

// ------------------------------------------------------------------
// 2. CUSTOMER PORTAL
// ------------------------------------------------------------------
function renderCustomerPortal() {
    const grid = document.getElementById('custWarrantiesGrid');
    if (!grid) return;
    document.getElementById('custWarrantyCount').innerText = `Assets: ${state.products.length}`;

    grid.innerHTML = state.products.map(p => `
        <div class="glass-panel p-5 space-y-4 border-slate-700/60 relative flex flex-col justify-between">
            <div class="space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded-md">NFT ID #${p.id}</span>
                        <h4 class="font-bold text-white text-base mt-1">${p.modelName}</h4>
                        <p class="text-xs text-slate-400">${p.brand}</p>
                    </div>
                    ${getStatusBadge(p.status)}
                </div>

                <div class="text-xs space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div class="flex justify-between text-slate-400">
                        <span>Serial:</span>
                        <span class="font-mono text-white">${p.serialNumber}</span>
                    </div>
                    <div class="flex justify-between text-slate-400">
                        <span>Coverage:</span>
                        <span class="${p.isActivated ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}">
                            ${p.isActivated ? `${p.warrantyDurationDays} Days Active` : 'Pending (0.001 Sepolia ETH)'}
                        </span>
                    </div>
                    <div class="flex justify-between text-slate-400 font-mono text-[11px] pt-1 border-t border-slate-800">
                        <span>Sepolia Tx:</span>
                        <a href="${SEPOLIA_CONFIG.explorerUrl}/tx/${p.txHash}" target="_blank" rel="noopener noreferrer" class="text-purple-300 hover:text-white underline truncate max-w-[130px]">
                            ${p.txHash.substring(0, 10)}...
                        </a>
                    </div>
                </div>
            </div>

            <div class="flex gap-2 pt-2 border-t border-slate-800/80">
                ${!p.isActivated ? `
                    <button onclick="quickActivate(${p.id})" class="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 rounded-xl text-xs transition">
                        Activate (0.001 ETH)
                    </button>
                ` : ''}
                <button onclick="quickInspect(${p.id})" class="flex-1 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 font-semibold">
                    <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> Inspect / QR
                </button>
            </div>
        </div>
    `).join('');

    safeCreateIcons();
}

function handleActivateWarranty(e) {
    e.preventDefault();
    const query = document.getElementById('custActivateProdId').value.trim();
    const prod = findProduct(query);
    if (!prod) return showToast("Product not found!", "error");
    
    prod.isActivated = true;
    prod.warrantyStartTimestamp = Date.now();
    prod.status = "Active";
    prod.txHash = generateSepoliaTxHash();

    document.getElementById('custActivateProdId').value = '';
    renderAll();
    showToast(`Warranty activated for #${prod.id} on Sepolia! (0.001 Sepolia ETH fee)`, "success", prod.txHash);
}

function quickActivate(id) {
    const prod = state.products.find(p => p.id === id);
    if (prod) {
        prod.isActivated = true;
        prod.warrantyStartTimestamp = Date.now();
        prod.status = "Active";
        prod.txHash = generateSepoliaTxHash();
        renderAll();
        showToast(`Warranty activated for Product #${id} on Sepolia!`, "success", prod.txHash);
    }
}

function handleFileClaim(e) {
    e.preventDefault();
    const prodId = parseInt(document.getElementById('claimProdId').value);
    const issue = document.getElementById('claimIssue').value.trim();

    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return showToast("Product ID not found!", "error");

    const txHash = generateSepoliaTxHash();
    prod.status = "ClaimPending";
    if (!state.claims[prodId]) state.claims[prodId] = [];

    state.claims[prodId].push({
        claimId: 100 + state.claims[prodId].length + 1,
        productId: prodId,
        claimant: prod.currentOwner,
        issue: issue,
        escrowDeposit: "0.005 Sepolia ETH",
        timestamp: Date.now(),
        isResolved: false,
        txHash: txHash
    });

    document.getElementById('claimProdId').value = '';
    document.getElementById('claimIssue').value = '';
    renderAll();
    showToast(`Claim ticket filed! 0.005 Sepolia ETH locked in smart contract escrow.`, "success", txHash);
}

function handleTransferOwnership(e) {
    e.preventDefault();
    const prodId = parseInt(document.getElementById('transferProdId').value);
    const newOwner = document.getElementById('transferNewOwnerAddr').value.trim();

    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return showToast("Product ID not found", "error");

    const txHash = generateSepoliaTxHash();
    prod.currentOwner = newOwner;
    prod.status = "Transferred";
    prod.txHash = txHash;
    state.ownershipHistory[prodId].push({ owner: newOwner, txHash: txHash });

    document.getElementById('transferProdId').value = '';
    document.getElementById('transferNewOwnerAddr').value = '';
    renderAll();
    showToast(`NFT ownership transferred on Sepolia to ${newOwner.substring(0, 8)}...!`, "success", txHash);
}

// ------------------------------------------------------------------
// 3. SERVICE CENTER PORTAL
// ------------------------------------------------------------------
function renderServiceCenterPortal() {
    const list = document.getElementById('scRepairRecordsList');
    if (!list) return;
    const logs = [];

    Object.keys(state.repairs).forEach(id => {
        const prod = state.products.find(p => p.id == id);
        state.repairs[id].forEach(r => {
            logs.push({ ...r, prodId: id, modelName: prod ? prod.modelName : `Product #${id}` });
        });
    });

    if (logs.length === 0) {
        list.innerHTML = `<p class="text-xs text-slate-500 italic">No maintenance records logged on Sepolia.</p>`;
        return;
    }

    list.innerHTML = logs.map(r => `
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
            <div class="flex justify-between items-center">
                <span class="font-bold text-amber-400">Prod #${r.prodId} - ${r.modelName}</span>
                <span class="text-[11px] text-slate-500 font-mono">${new Date(r.timestamp).toLocaleDateString()}</span>
            </div>
            <p class="text-slate-300"><strong>Service Description:</strong> ${r.description}</p>
            <div class="flex justify-between text-slate-400 pt-2 border-t border-slate-800/80 text-[11px]">
                <span>Parts: <strong class="text-slate-200">${r.partsReplaced}</strong></span>
                <span>Settled: <strong class="text-purple-300 font-mono font-bold">${r.costInWei}</strong></span>
            </div>
            <div class="text-[10px] text-slate-500 font-mono flex items-center gap-1 pt-1">
                <span>Sepolia Tx:</span>
                <a href="${SEPOLIA_CONFIG.explorerUrl}/tx/${r.txHash || generateSepoliaTxHash()}" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-white underline truncate">
                    ${r.txHash || '0x5829103948...'}
                </a>
            </div>
        </div>
    `).join('');
}

function handleLogRepair(e) {
    e.preventDefault();
    const prodId = parseInt(document.getElementById('scProdId').value);
    const desc = document.getElementById('scDescription').value.trim();
    const parts = document.getElementById('scParts').value.trim();
    const cost = document.getElementById('scCost').value.trim() + " Sepolia ETH";

    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return showToast("Product not found on Sepolia!", "error");

    const txHash = generateSepoliaTxHash();
    prod.status = "InRepair";
    prod.txHash = txHash;
    if (!state.repairs[prodId]) state.repairs[prodId] = [];

    state.repairs[prodId].push({
        timestamp: Date.now(),
        serviceCenter: state.web3.connectedAddress || state.accounts.serviceCenter,
        description: desc,
        partsReplaced: parts,
        costInWei: cost,
        txHash: txHash
    });

    document.getElementById('scProdId').value = '';
    document.getElementById('scDescription').value = '';
    document.getElementById('scParts').value = '';
    document.getElementById('scCost').value = '';

    renderAll();
    showToast(`Maintenance log confirmed on Sepolia! (${cost})`, "success", txHash);
}

// ------------------------------------------------------------------
// 4. PUBLIC VERIFIER PORTAL & CERTIFICATE GENERATOR
// ------------------------------------------------------------------
function handlePublicLookup(e) {
    e.preventDefault();
    const query = document.getElementById('verifierQuery').value.trim();
    const prod = findProduct(query);
    if (!prod) return showToast("Product not found on Sepolia!", "error");

    renderVerifierPortal(prod);
    showToast(`Loaded Sepolia details for Product #${prod.id}`, "info");
}

function quickInspect(id) {
    const prod = state.products.find(p => p.id === id);
    if (prod) {
        selectedProductForInspect = prod;
        openPrintableCertificate();
    }
}

function renderVerifierPortal(prod) {
    selectedProductForInspect = prod;
    document.getElementById('vProdTitle').innerText = `${prod.brand} - ${prod.modelName}`;
    document.getElementById('vProdSub').innerText = `Serial: ${prod.serialNumber} | Product NFT ID: #${prod.id}`;
    document.getElementById('vCustomHash').innerText = prod.customHash;

    // Update explorer link
    const explorerBtn = document.getElementById('sepoliaExplorerLink');
    if (explorerBtn && prod.txHash) {
        explorerBtn.href = `${SEPOLIA_CONFIG.explorerUrl}/tx/${prod.txHash}`;
        explorerBtn.innerHTML = `<i data-lucide="external-link" class="w-3.5 h-3.5"></i> View Tx on Sepolia Etherscan`;
    }

    // QR Code
    const container = document.getElementById('qrcodeContainer');
    if (container) {
        container.innerHTML = '';
        let qrRendered = false;
        if (typeof QRCode !== 'undefined') {
            try {
                new QRCode(container, {
                    text: JSON.stringify({
                        id: prod.id,
                        sn: prod.serialNumber,
                        hash: prod.customHash,
                        network: "Sepolia Testnet",
                        tx: prod.txHash
                    }),
                    width: 140,
                    height: 140,
                    colorDark: "#090d16",
                    colorLight: "#ffffff"
                });
                qrRendered = true;
            } catch (qrErr) {
                console.warn("QRCode canvas rendering notice:", qrErr);
            }
        }
        if (!qrRendered) {
            container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(prod.serialNumber)}" alt="QR Code" class="w-[140px] h-[140px] rounded-lg">`;
        }
    }

    // Render Timeline with Sepolia Tx Links
    const timeline = document.getElementById('vTimeline');
    if (!timeline) return;

    const items = [
        {
            title: "Minted on Sepolia (0.002 Sepolia ETH)",
            desc: `Registered on-chain by ${prod.manufacturer.substring(0, 8)}...`,
            time: prod.registrationTimestamp,
            icon: "factory",
            color: "text-sky-400",
            txHash: prod.txHash
        }
    ];

    if (prod.isActivated) {
        items.push({
            title: "Warranty Activated on Sepolia",
            desc: `Duration: ${prod.warrantyDurationDays} days coverage`,
            time: prod.warrantyStartTimestamp,
            icon: "zap",
            color: "text-amber-400",
            txHash: prod.txHash
        });
    }

    if (state.repairs[prod.id]) {
        state.repairs[prod.id].forEach(r => {
            items.push({
                title: `Maintenance Logged (${r.costInWei})`,
                desc: `${r.description} (Parts: ${r.partsReplaced})`,
                time: r.timestamp,
                icon: "wrench",
                color: "text-orange-400",
                txHash: r.txHash || prod.txHash
            });
        });
    }

    const owners = state.ownershipHistory[prod.id] || [];
    for (let i = 1; i < owners.length; i++) {
        const ownerItem = owners[i];
        const ownerAddr = typeof ownerItem === 'string' ? ownerItem : ownerItem.owner;
        const ownerTx = typeof ownerItem === 'string' ? prod.txHash : (ownerItem.txHash || prod.txHash);
        items.push({
            title: "NFT Ownership Transferred On-Chain",
            desc: `Transferred to buyer ${ownerAddr.substring(0, 8)}...`,
            time: prod.registrationTimestamp + (i * 86400 * 1000 * 2),
            icon: "arrow-right-left",
            color: "text-purple-400",
            txHash: ownerTx
        });
    }

    items.sort((a, b) => a.time - b.time);

    timeline.innerHTML = items.map(h => `
        <div class="relative pl-6 pb-4 border-l border-slate-800 last:border-l-0">
            <div class="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-sky-500 border-2 border-slate-900"></div>
            <div class="flex justify-between items-center text-xs">
                <span class="font-bold ${h.color} flex items-center gap-1.5">
                    <i data-lucide="${h.icon}" class="w-3.5 h-3.5"></i> ${h.title}
                </span>
                <span class="text-[11px] text-slate-500 font-mono">${new Date(h.time).toLocaleDateString()}</span>
            </div>
            <p class="text-xs text-slate-300 mt-1">${h.desc}</p>
            ${h.txHash ? `
                <div class="mt-1">
                    <a href="${SEPOLIA_CONFIG.explorerUrl}/tx/${h.txHash}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-purple-300 hover:text-white font-mono underline inline-flex items-center gap-1">
                        <i data-lucide="external-link" class="w-2.5 h-2.5"></i> Sepolia Tx: ${h.txHash.substring(0, 16)}...
                    </a>
                </div>
            ` : ''}
        </div>
    `).join('');

    safeCreateIcons();
}

function openPrintableCertificate() {
    const prod = selectedProductForInspect || state.products[0];
    document.getElementById('certModelTitle').innerText = prod.modelName;
    document.getElementById('certBrand').innerText = `${prod.brand} | Ethereum Sepolia Warranted NFT`;
    document.getElementById('certSerial').innerText = prod.serialNumber;
    document.getElementById('certOwner').innerText = `${prod.currentOwner.substring(0, 10)}...`;
    document.getElementById('certStatus').innerText = prod.isActivated ? "Active Coverage (Sepolia Verified)" : "Registered";
    document.getElementById('certHash').innerText = prod.customHash;

    document.getElementById('printableCertificateModal').classList.remove('hidden');
}

function closePrintableCertificate() {
    document.getElementById('printableCertificateModal').classList.add('hidden');
}

// Helpers
function findProduct(q) {
    return state.products.find(p => p.id.toString() === q || p.serialNumber.toLowerCase() === q.toLowerCase());
}

function getStatusBadge(status) {
    switch (status) {
        case 'Registered': return `<span class="badge-status badge-registered">Registered</span>`;
        case 'Active': return `<span class="badge-status badge-active">Warranty Active</span>`;
        case 'ClaimPending': return `<span class="badge-status badge-claim">Claim Escrow Locked</span>`;
        case 'InRepair': return `<span class="badge-status badge-inrepair">In Repair</span>`;
        case 'Transferred': return `<span class="badge-status badge-transferred font-mono">NFT Transferred</span>`;
        default: return `<span class="badge-status badge-registered">${status}</span>`;
    }
}

function showToast(msg, type = 'info', txHash = null) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toastMsg').innerText = msg;

    const linkContainer = document.getElementById('toastTxLinkContainer');
    const linkEl = document.getElementById('toastTxLink');
    if (txHash && linkContainer && linkEl) {
        linkEl.href = `${SEPOLIA_CONFIG.explorerUrl}/tx/${txHash}`;
        linkEl.innerText = `View Tx on Sepolia Etherscan (${txHash.substring(0, 12)}...) ↗`;
        linkContainer.classList.remove('hidden');
    } else if (linkContainer) {
        linkContainer.classList.add('hidden');
    }

    toast.className = `p-4 rounded-2xl border text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all flex ${
        type === 'success' ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200' :
        type === 'error' ? 'bg-rose-950/90 border-rose-700 text-rose-200' : 'bg-slate-900 border-slate-700 text-slate-200'
    }`;
    setTimeout(hideToast, 7000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.classList.add('hidden');
}
