/**
 * BlockSure - Blockchain Electronic Warranty & Ownership System
 * Author: R ALWIN EBENEZER (25BCE5056) & R PRAJIT (25BCE5022) - VIT
 */

// Simulated In-Memory Blockchain Ledger State
const mockState = {
    accounts: {
        manufacturer: "0x1111111111111111111111111111111111111111",
        customer1: "0x2222222222222222222222222222222222222222",
        customer2: "0x3333333333333333333333333333333333333333",
        serviceCenter: "0x4444444444444444444444444444444444444444"
    },
    authorizedServiceCenters: new Set([
        "0x4444444444444444444444444444444444444444"
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
            warrantyDurationDays: 730, // 2 years
            warrantyStartTimestamp: Date.now() - 14 * 86400 * 1000,
            isActivated: true,
            status: "Active", // Registered, Active, InRepair, Expired, Transferred
            customHash: ""
        },
        {
            id: 2,
            serialNumber: "SN-SONY-9921-TV",
            modelName: "Bravia XR 65 OLED TV",
            brand: "Sony",
            manufacturer: "0x1111111111111111111111111111111111111111",
            currentOwner: "0x1111111111111111111111111111111111111111",
            registrationTimestamp: Date.now() - 5 * 86400 * 1000,
            warrantyDurationDays: 365,
            warrantyStartTimestamp: 0,
            isActivated: false,
            status: "Registered",
            customHash: ""
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
            customHash: ""
        }
    ],
    repairs: {
        1: [
            {
                timestamp: Date.now() - 7 * 86400 * 1000,
                serviceCenter: "0x4444444444444444444444444444444444444444",
                description: "Keyboard key cap replacement & fan cleaning",
                partsReplaced: "MagSafe 3 Port & Space Black Keycaps",
                costInWei: "0.02 ETH"
            }
        ],
        3: [
            {
                timestamp: Date.now() - 2 * 86400 * 1000,
                serviceCenter: "0x4444444444444444444444444444444444444444",
                description: "Screen flickering diagnostic",
                partsReplaced: "4K Display Flex Cable",
                costInWei: "0.05 ETH"
            }
        ]
    },
    ownershipHistory: {
        1: [
            "0x1111111111111111111111111111111111111111", // Mfr
            "0x2222222222222222222222222222222222222222"  // Customer 1
        ],
        2: [
            "0x1111111111111111111111111111111111111111"
        ],
        3: [
            "0x1111111111111111111111111111111111111111",
            "0x2222222222222222222222222222222222222222",
            "0x3333333333333333333333333333333333333333"  // Transferred second hand
        ]
    }
};

let currentTab = 'manufacturer';
let providerMode = 'sim'; // 'sim' or 'metamask'
let qrCodeObj = null;

// Initialize app on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    // Calculate custom non-SHA256 hashes for demo products
    mockState.products.forEach(p => {
        p.customHash = calculateCustomHash(p.serialNumber, p.modelName, p.manufacturer, p.registrationTimestamp);
    });

    renderAllViews();
    lucide.createIcons();
});

// Custom Non-SHA256 Cryptographic Hash Implementation
function calculateCustomHash(serialNumber, modelName, mfrAddr, regTime) {
    const raw = `${serialNumber}_${modelName}_${mfrAddr}_${regTime}`;
    // 31-multiplier polynomial rolling checksum
    let polyChecksum = 0;
    for (let i = 0; i < raw.length; i++) {
        polyChecksum = (polyChecksum * 31 + raw.charCodeAt(i)) >>> 0;
    }
    // Combine EVM Keccak-256 hash with polynomial checksum suffix
    const keccakHash = ethers.keccak256(ethers.toUtf8Bytes(raw));
    const polyHex = polyChecksum.toString(16).padStart(8, '0');
    return keccakHash.slice(0, 58) + polyHex;
}

// Tab Switching Handler
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.portal-view').forEach(view => view.classList.add('hidden'));

    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.getElementById(`portal-${tabName}`).classList.remove('hidden');

    if (tabName === 'verifier' && mockState.products.length > 0) {
        renderVerifierView(mockState.products[0]);
    }

    lucide.createIcons();
}

// Set Provider Mode (EVM Simulator vs MetaMask)
async function setProviderMode(mode) {
    providerMode = mode;
    const simBtn = document.getElementById('modeSimBtn');
    const mmBtn = document.getElementById('modeMetaMaskBtn');
    const walletAddr = document.getElementById('activeAccountAddr');

    if (mode === 'metamask') {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                walletAddr.innerText = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
                simBtn.className = "px-3 py-1 rounded-md transition font-medium text-slate-400 hover:text-white";
                mmBtn.className = "px-3 py-1 rounded-md transition font-medium bg-amber-600 text-white";
                showToast("Connected to MetaMask wallet!", "success");
            } catch (err) {
                showToast("MetaMask connection denied or failed", "error");
                setProviderMode('sim');
            }
        } else {
            showToast("MetaMask not detected! Reverting to EVM Simulator mode.", "info");
            setProviderMode('sim');
        }
    } else {
        walletAddr.innerText = "0x1111...1111 (Mfr Sim)";
        simBtn.className = "px-3 py-1 rounded-md transition font-medium bg-blue-600 text-white";
        mmBtn.className = "px-3 py-1 rounded-md transition font-medium text-slate-400 hover:text-white";
        showToast("Switched to Live EVM In-Memory Simulator Mode", "info");
    }
}

// Global View Renderer
function renderAllViews() {
    renderManufacturerView();
    renderCustomerView();
    renderServiceCenterView();
}

// ------------------------------------------------------------------
// 1. MANUFACTURER PORTAL RENDERING & HANDLERS
// ------------------------------------------------------------------
function renderManufacturerView() {
    const tbody = document.getElementById('mfrProductsTableBody');
    const countEl = document.getElementById('mfrProductCount');
    countEl.innerText = `Total Registered: ${mockState.products.length}`;

    tbody.innerHTML = mockState.products.map(p => `
        <tr class="hover:bg-slate-900/40">
            <td class="p-3 font-mono text-cyan-400">#${p.id}</td>
            <td class="p-3">
                <div class="font-medium text-white">${p.modelName}</div>
                <div class="text-[11px] text-slate-400 font-mono">${p.serialNumber}</div>
            </td>
            <td class="p-3 text-slate-300">${p.brand}</td>
            <td class="p-3">${getStatusBadge(p.status)}</td>
            <td class="p-3 font-mono text-[10px] text-slate-400 max-w-[150px] truncate" title="${p.customHash}">
                ${p.customHash.substring(0, 16)}...
            </td>
        </tr>
    `).join('');
}

function handleRegisterProduct(e) {
    e.preventDefault();
    const serial = document.getElementById('mfrSerial').value.trim();
    const model = document.getElementById('mfrModel').value.trim();
    const brand = document.getElementById('mfrBrand').value.trim();
    const duration = parseInt(document.getElementById('mfrDuration').value);

    // Duplicate Serial Check
    if (mockState.products.some(p => p.serialNumber.toLowerCase() === serial.toLowerCase())) {
        showToast("Error: Serial number already registered on-chain!", "error");
        return;
    }

    const newId = mockState.products.length + 1;
    const now = Date.now();
    const mfrAddr = mockState.accounts.manufacturer;
    const customHash = calculateCustomHash(serial, model, mfrAddr, now);

    const newProduct = {
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
        customHash: customHash
    };

    mockState.products.push(newProduct);
    mockState.ownershipHistory[newId] = [mfrAddr];
    mockState.repairs[newId] = [];

    document.getElementById('mfrRegisterForm').reset();
    renderAllViews();
    showToast(`Product #${newId} (${model}) registered & minted on-chain!`, "success");
}

function handleAuthorizeServiceCenter(e) {
    e.preventDefault();
    const addr = document.getElementById('scAddressInput').value.trim();
    if (!ethers.isAddress(addr)) {
        showToast("Invalid Ethereum address format", "error");
        return;
    }
    mockState.authorizedServiceCenters.add(addr.toLowerCase());
    document.getElementById('scAddressInput').value = '';
    showToast(`Service center ${addr.substring(0, 8)}... authorized on-chain!`, "success");
}

// ------------------------------------------------------------------
// 2. CUSTOMER / OWNER PORTAL RENDERING & HANDLERS
// ------------------------------------------------------------------
function renderCustomerView() {
    const grid = document.getElementById('custWarrantiesGrid');
    const countEl = document.getElementById('custWarrantyCount');
    countEl.innerText = `Total Items: ${mockState.products.length}`;

    grid.innerHTML = mockState.products.map(p => {
        const isExp = p.isActivated && (Date.now() > (p.warrantyStartTimestamp + p.warrantyDurationDays * 86400 * 1000));
        const activeStatus = isExp ? "Expired" : p.status;

        return `
            <div class="glass-card p-4 space-y-3 border border-slate-700/60 relative">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">ID #${p.id}</span>
                        <h4 class="font-semibold text-white text-sm mt-1">${p.modelName}</h4>
                        <p class="text-xs text-slate-400">${p.brand}</p>
                    </div>
                    ${getStatusBadge(activeStatus)}
                </div>

                <div class="text-xs space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <div class="flex justify-between text-slate-400">
                        <span>Serial Number:</span>
                        <span class="font-mono text-white">${p.serialNumber}</span>
                    </div>
                    <div class="flex justify-between text-slate-400">
                        <span>Warranty Status:</span>
                        <span class="${p.isActivated ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}">
                            ${p.isActivated ? 'Activated Coverage' : 'Pending Activation'}
                        </span>
                    </div>
                    <div class="flex justify-between text-slate-400">
                        <span>Current Owner:</span>
                        <span class="font-mono text-slate-300">${p.currentOwner.substring(0, 8)}...</span>
                    </div>
                </div>

                <div class="flex gap-2">
                    ${!p.isActivated ? `
                        <button onclick="quickActivate(${p.id})" class="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-medium py-1.5 rounded-lg text-xs transition">
                            Activate Warranty
                        </button>
                    ` : ''}
                    <button onclick="quickSelectForVerifier(${p.id})" class="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 py-1.5 rounded-lg text-xs transition flex items-center justify-center gap-1">
                        <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> QR / History
                    </button>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function handleActivateWarranty(e) {
    e.preventDefault();
    const query = document.getElementById('custActivateProdId').value.trim();
    const product = findProduct(query);

    if (!product) {
        showToast("Product not found by ID or Serial", "error");
        return;
    }
    if (product.isActivated) {
        showToast("Warranty is already activated!", "info");
        return;
    }

    product.isActivated = true;
    product.warrantyStartTimestamp = Date.now();
    product.status = "Active";

    document.getElementById('custActivateProdId').value = '';
    renderAllViews();
    showToast(`Warranty activated for Product #${product.id} (${product.modelName})!`, "success");
}

function quickActivate(prodId) {
    const product = mockState.products.find(p => p.id === prodId);
    if (product) {
        product.isActivated = true;
        product.warrantyStartTimestamp = Date.now();
        product.status = "Active";
        renderAllViews();
        showToast(`Warranty activated for Product #${product.id}!`, "success");
    }
}

function handleTransferOwnership(e) {
    e.preventDefault();
    const prodId = parseInt(document.getElementById('transferProdId').value);
    const newOwner = document.getElementById('transferNewOwnerAddr').value.trim();

    const product = mockState.products.find(p => p.id === prodId);
    if (!product) {
        showToast("Product ID not found", "error");
        return;
    }

    const prevOwner = product.currentOwner;
    product.currentOwner = newOwner;
    product.status = "Transferred";

    if (!mockState.ownershipHistory[prodId]) {
        mockState.ownershipHistory[prodId] = [];
    }
    mockState.ownershipHistory[prodId].push(newOwner);

    document.getElementById('transferProdId').value = '';
    document.getElementById('transferNewOwnerAddr').value = '';
    renderAllViews();
    showToast(`Ownership of Product #${prodId} transferred to ${newOwner.substring(0, 8)}...!`, "success");
}

// ------------------------------------------------------------------
// 3. SERVICE CENTER PORTAL RENDERING & HANDLERS
// ------------------------------------------------------------------
function renderServiceCenterView() {
    const listEl = document.getElementById('scRepairRecordsList');
    const allRepairs = [];

    Object.keys(mockState.repairs).forEach(prodId => {
        const prod = mockState.products.find(p => p.id == prodId);
        mockState.repairs[prodId].forEach(r => {
            allRepairs.push({ ...r, prodId, modelName: prod ? prod.modelName : `Product #${prodId}` });
        });
    });

    document.getElementById('scRepairRecordCount').innerText = `Total Logs: ${allRepairs.length}`;

    if (allRepairs.length === 0) {
        listEl.innerHTML = `<p class="text-xs text-slate-500 italic">No repair logs recorded yet.</p>`;
        return;
    }

    listEl.innerHTML = allRepairs.map(r => `
        <div class="bg-slate-900/70 border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs">
            <div class="flex justify-between items-center text-slate-300">
                <span class="font-semibold text-amber-400">Prod #${r.prodId} - ${r.modelName}</span>
                <span class="text-[11px] text-slate-500 font-mono">${new Date(r.timestamp).toLocaleDateString()}</span>
            </div>
            <p class="text-slate-300"><strong>Service Note:</strong> ${r.description}</p>
            <div class="flex justify-between items-center text-slate-400 border-t border-slate-800/80 pt-2 text-[11px]">
                <span>Parts: <strong class="text-slate-200">${r.partsReplaced}</strong></span>
                <span>Cost: <strong class="text-emerald-400">${r.costInWei}</strong></span>
            </div>
        </div>
    `).join('');
}

function handleLogRepair(e) {
    e.preventDefault();
    const prodId = parseInt(document.getElementById('scProdId').value);
    const desc = document.getElementById('scDescription').value.trim();
    const parts = document.getElementById('scParts').value.trim();
    const cost = document.getElementById('scCost').value.trim() + " ETH";

    const product = mockState.products.find(p => p.id === prodId);
    if (!product) {
        showToast("Product not found!", "error");
        return;
    }

    product.status = "InRepair";

    if (!mockState.repairs[prodId]) {
        mockState.repairs[prodId] = [];
    }

    mockState.repairs[prodId].push({
        timestamp: Date.now(),
        serviceCenter: mockState.accounts.serviceCenter,
        description: desc,
        partsReplaced: parts,
        costInWei: cost
    });

    document.getElementById('scProdId').value = '';
    document.getElementById('scDescription').value = '';
    document.getElementById('scParts').value = '';
    document.getElementById('scCost').value = '';

    renderAllViews();
    showToast(`Maintenance record added on-chain for Product #${prodId}`, "success");
}

function handleCompleteRepair(e) {
    e.preventDefault();
    const prodId = parseInt(document.getElementById('scCompleteProdId').value);
    const product = mockState.products.find(p => p.id === prodId);
    if (!product) {
        showToast("Product not found", "error");
        return;
    }

    product.status = product.isActivated ? "Active" : "Registered";
    document.getElementById('scCompleteProdId').value = '';
    renderAllViews();
    showToast(`Service completed! Product #${prodId} status set to ${product.status}`, "success");
}

// ------------------------------------------------------------------
// 4. PUBLIC VERIFIER & QR CODE PORTAL HANDLERS
// ------------------------------------------------------------------
function handlePublicLookup(e) {
    e.preventDefault();
    const query = document.getElementById('verifierQuery').value.trim();
    const prod = findProduct(query);

    if (!prod) {
        showToast("No product matching ID or Serial Number found.", "error");
        return;
    }

    renderVerifierView(prod);
    showToast(`Loaded details for Product #${prod.id} (${prod.serialNumber})`, "info");
}

function quickSelectForVerifier(prodId) {
    const prod = mockState.products.find(p => p.id === prodId);
    if (prod) {
        switchTab('verifier');
        renderVerifierView(prod);
    }
}

function renderVerifierView(product) {
    document.getElementById('vProdTitle').innerText = `${product.brand} - ${product.modelName}`;
    document.getElementById('vProdSub').innerText = `Serial: ${product.serialNumber} | Product ID: #${product.id}`;
    document.getElementById('vCustomHash').innerText = product.customHash;

    const isExp = product.isActivated && (Date.now() > (product.warrantyStartTimestamp + product.warrantyDurationDays * 86400 * 1000));
    const activeStatus = isExp ? "Expired" : product.status;
    document.getElementById('vStatusBadge').outerHTML = getStatusBadge(activeStatus, 'vStatusBadge');

    // Generate QR Code
    const qrContainer = document.getElementById('qrcodeContainer');
    qrContainer.innerHTML = '';
    
    if (typeof QRCode !== 'undefined') {
        const qrPayload = JSON.stringify({
            id: product.id,
            sn: product.serialNumber,
            model: product.modelName,
            customHash: product.customHash,
            owner: product.currentOwner
        });
        new QRCode(qrContainer, {
            text: qrPayload,
            width: 140,
            height: 140,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        qrContainer.innerHTML = `<p class="text-xs text-slate-700 font-mono font-bold">QR CODE GENERATED<br>[ID #${product.id}]</p>`;
    }

    // Render Timeline
    const timelineEl = document.getElementById('vTimeline');
    const history = [];

    // Registration Event
    history.push({
        title: "Minted & Registered by Manufacturer",
        desc: `Registered by ${product.manufacturer.substring(0, 8)}...`,
        time: product.registrationTimestamp,
        icon: "factory",
        color: "text-blue-400"
    });

    // Activation Event
    if (product.isActivated) {
        history.push({
            title: "Digital Warranty Activated",
            desc: `Coverage duration: ${product.warrantyDurationDays} days`,
            time: product.warrantyStartTimestamp,
            icon: "zap",
            color: "text-amber-400"
        });
    }

    // Repair Events
    if (mockState.repairs[product.id]) {
        mockState.repairs[product.id].forEach(r => {
            history.push({
                title: "Maintenance / Repair Logged",
                desc: `${r.description} (Parts: ${r.partsReplaced})`,
                time: r.timestamp,
                icon: "wrench",
                color: "text-orange-400"
            });
        });
    }

    // Ownership Transfers
    const owners = mockState.ownershipHistory[product.id] || [];
    for (let i = 1; i < owners.length; i++) {
        history.push({
            title: "Ownership Transferred On-Chain",
            desc: `Transferred to new buyer: ${owners[i].substring(0, 8)}...`,
            time: product.registrationTimestamp + (i * 86400 * 1000 * 2), // Demo timestamp offset
            icon: "arrow-right-left",
            color: "text-purple-400"
        });
    }

    // Sort by timestamp
    history.sort((a, b) => a.time - b.time);

    timelineEl.innerHTML = history.map(h => `
        <div class="timeline-item space-y-1">
            <div class="timeline-dot"></div>
            <div class="flex justify-between items-center text-xs">
                <span class="font-bold ${h.color} flex items-center gap-1.5">
                    <i data-lucide="${h.icon}" class="w-3.5 h-3.5"></i> ${h.title}
                </span>
                <span class="text-[11px] text-slate-500 font-mono">${new Date(h.time).toLocaleDateString()}</span>
            </div>
            <p class="text-xs text-slate-300 pl-5">${h.desc}</p>
        </div>
    `).join('');

    lucide.createIcons();
}

// ------------------------------------------------------------------
// HELPER UTILITIES
// ------------------------------------------------------------------
function findProduct(query) {
    return mockState.products.find(p => 
        p.id.toString() === query || 
        p.serialNumber.toLowerCase() === query.toLowerCase()
    );
}

function getStatusBadge(status, idAttr = '') {
    const idStr = idAttr ? `id="${idAttr}"` : '';
    switch (status) {
        case 'Registered':
            return `<span ${idStr} class="badge-registered px-2.5 py-0.5 rounded-full text-xs font-medium">Registered</span>`;
        case 'Active':
            return `<span ${idStr} class="badge-active px-2.5 py-0.5 rounded-full text-xs font-medium">Warranty Active</span>`;
        case 'InRepair':
            return `<span ${idStr} class="badge-inrepair px-2.5 py-0.5 rounded-full text-xs font-medium">In Repair</span>`;
        case 'Transferred':
            return `<span ${idStr} class="badge-transferred px-2.5 py-0.5 rounded-full text-xs font-medium">Transferred</span>`;
        case 'Expired':
            return `<span ${idStr} class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950/60 text-red-400 border border-red-800/40">Warranty Expired</span>`;
        default:
            return `<span ${idStr} class="badge-registered px-2.5 py-0.5 rounded-full text-xs font-medium">${status}</span>`;
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.innerText = message;
    toast.className = "p-4 rounded-xl border text-sm flex items-center justify-between transition-all flex";

    if (type === 'success') {
        toast.classList.add('bg-emerald-950/80', 'border-emerald-700', 'text-emerald-200');
        toastIcon.setAttribute('data-lucide', 'check-circle-2');
    } else if (type === 'error') {
        toast.classList.add('bg-rose-950/80', 'border-rose-700', 'text-rose-200');
        toastIcon.setAttribute('data-lucide', 'alert-triangle');
    } else {
        toast.classList.add('bg-slate-900', 'border-slate-700', 'text-slate-200');
        toastIcon.setAttribute('data-lucide', 'info');
    }

    lucide.createIcons();
    setTimeout(() => hideToast(), 5000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('hidden');
}
