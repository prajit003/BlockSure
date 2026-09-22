/**
 * BlockSure Enterprise - Decentralized Electronic Warranty & Ownership System
 */

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
                timestamp: Date.now() - 3 * 86400 * 1000,
                isResolved: false
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
                costInWei: "0.02 ETH"
            }
        ],
        3: [
            {
                timestamp: Date.now() - 2 * 86400 * 1000,
                serviceCenter: "0x4444444444444444444444444444444444444444",
                description: "Screen flickering diagnostic",
                partsReplaced: "4K OLED Display Ribbon Cable",
                costInWei: "0.05 ETH"
            }
        ]
    },
    ownershipHistory: {
        1: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"],
        2: ["0x1111111111111111111111111111111111111111"],
        3: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222", "0x3333333333333333333333333333333333333333"],
        4: ["0x1111111111111111111111111111111111111111"]
    }
};

let selectedProductForInspect = null;

document.addEventListener("DOMContentLoaded", () => {
    // Calculate custom non-SHA256 hashes
    state.products.forEach(p => {
        p.customHash = calculateCustomHash(p.serialNumber, p.modelName, p.manufacturer, p.registrationTimestamp);
    });

    lucide.createIcons();
});

// Non-SHA256 Cryptographic Fingerprint Algorithm (Keccak256 + Polynomial Checksum)
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

// ------------------------------------------------------------------
// LOGIN MODAL & INSTANT AUTHENTICATION
// ------------------------------------------------------------------
function openLoginModal(role) {
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
    userInput.value = role === 'verifier' ? 'guest' : (creds ? creds.user : role);

    if (role === 'verifier') {
        passGroup.classList.add('hidden');
        passInput.value = '';
    } else {
        passGroup.classList.remove('hidden');
        passInput.value = creds ? creds.pass : '';
    }

    modal.classList.remove('hidden');
    lucide.createIcons();
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
        customer: 'Customer & Owner',
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

    renderAll();
    switchTab(role);
    showToast(`Authenticated! Welcome to ${label}.`, "success");
}

function handleLogout() {
    state.auth.targetRole = null;
    state.auth.currentRole = null;
    state.auth.isAuthenticated = false;

    document.getElementById('mainDashboard').classList.add('hidden');
    document.getElementById('headerUserSession').classList.add('hidden');
    document.getElementById('headerUserSession').classList.remove('flex');
    document.getElementById('portalSelectorScreen').classList.remove('hidden');
}

// ------------------------------------------------------------------
// GLOBAL RENDER & TAB SWITCHER
// ------------------------------------------------------------------
function renderAll() {
    renderManufacturerPortal();
    renderCustomerPortal();
    renderServiceCenterPortal();
    if (state.products.length > 0) {
        renderVerifierPortal(selectedProductForInspect || state.products[0]);
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.portal-view').forEach(v => v.classList.add('hidden'));

    const tabBtn = document.getElementById(`tab-${tabName}`);
    const portalView = document.getElementById(`portal-${tabName}`);

    if (tabBtn) tabBtn.classList.add('active');
    if (portalView) portalView.classList.remove('hidden');

    if (tabName === 'verifier' && state.products.length > 0) {
        renderVerifierPortal(selectedProductForInspect || state.products[0]);
    }

    lucide.createIcons();
}

// ------------------------------------------------------------------
// MANUFACTURER PORTAL
// ------------------------------------------------------------------
function renderManufacturerPortal() {
    const grid = document.getElementById('mfrProductsGrid');
    if (!grid) return;
    document.getElementById('mfrProductCount').innerText = `Total Minted: ${state.products.length}`;

    grid.innerHTML = state.products.map(p => `
        <div class="glass-panel p-5 space-y-3 relative border-slate-700/60">
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded-md">ID #${p.id}</span>
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
                <div class="flex justify-between text-slate-400">
                    <span>Fingerprint:</span>
                    <span class="text-sky-300">${p.customHash.substring(0, 10)}...</span>
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
        showToast("Serial Number already exists on-chain!", "error");
        return;
    }

    const newId = state.products.length + 1;
    const now = Date.now();
    const mfrAddr = state.accounts.manufacturer;
    const customHash = calculateCustomHash(serial, model, mfrAddr, now);

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
        merkleRoot: Array.from(state.merkleRoots)[0]
    };

    state.products.push(newProd);
    state.ownershipHistory[newId] = [mfrAddr];
    state.repairs[newId] = [];

    document.getElementById('mfrRegisterForm').reset();
    renderAll();
    showToast(`Product NFT #${newId} registered & minted!`, "success");
}

function handlePublishMerkleRoot(e) {
    e.preventDefault();
    const root = document.getElementById('merkleRootInput').value.trim();
    state.merkleRoots.add(root);
    document.getElementById('merkleRootInput').value = '';
    showToast("Merkle Tree Batch Root published on-chain!", "success");
}

// ------------------------------------------------------------------
// CUSTOMER PORTAL
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
                        <span>Serial Number:</span>
                        <span class="font-mono text-white">${p.serialNumber}</span>
                    </div>
                    <div class="flex justify-between text-slate-400">
                        <span>Warranty Coverage:</span>
                        <span class="${p.isActivated ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}">
                            ${p.isActivated ? `${p.warrantyDurationDays} Days Active` : 'Not Activated'}
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex gap-2 pt-2 border-t border-slate-800/80">
                ${!p.isActivated ? `
                    <button onclick="quickActivate(${p.id})" class="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 rounded-xl text-xs transition">
                        Activate
                    </button>
                ` : ''}
                <button onclick="quickInspect(${p.id})" class="flex-1 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 font-semibold">
                    <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> Inspect / QR
                </button>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function handleActivateWarranty(e) {
    e.preventDefault();
    const query = document.getElementById('custActivateProdId').value.trim();
    const prod = findProduct(query);
    if (!prod) return showToast("Product not found!", "error");
    
    prod.isActivated = true;
    prod.warrantyStartTimestamp = Date.now();
    prod.status = "Active";

    document.getElementById('custActivateProdId').value = '';
    renderAll();
    showToast(`Warranty coverage activated for Product #${prod.id}!`, "success");
}

function quickActivate(id) {
    const prod = state.products.find(p => p.id === id);
    if (prod) {
        prod.isActivated = true;
        prod.warrantyStartTimestamp = Date.now();
        prod.status = "Active";
        renderAll();
        showToast(`Warranty activated for Product #${id}`, "success");
    }
}

function handleFileClaim(e) {
    e.preventDefault();
    const prodId = parseInt(document.getElementById('claimProdId').value);
    const issue = document.getElementById('claimIssue').value.trim();

    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return showToast("Product ID not found!", "error");

    prod.status = "ClaimPending";
    if (!state.claims[prodId]) state.claims[prodId] = [];

    state.claims[prodId].push({
        claimId: 100 + state.claims[prodId].length + 1,
        productId: prodId,
        claimant: prod.currentOwner,
        issue: issue,
        timestamp: Date.now(),
        isResolved: false
    });

    document.getElementById('claimProdId').value = '';
    document.getElementById('claimIssue').value = '';
    renderAll();
    showToast(`Warranty Repair Claim Ticket filed on-chain for Product #${prodId}!`, "success");
}

function handleTransferOwnership(e) {
    e.preventDefault();
    const prodId = parseInt(document.getElementById('transferProdId').value);
    const newOwner = document.getElementById('transferNewOwnerAddr').value.trim();

    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return showToast("Product ID not found", "error");

    prod.currentOwner = newOwner;
    prod.status = "Transferred";
    state.ownershipHistory[prodId].push(newOwner);

    document.getElementById('transferProdId').value = '';
    document.getElementById('transferNewOwnerAddr').value = '';
    renderAll();
    showToast(`Ownership transferred on-chain to ${newOwner.substring(0, 8)}...`, "success");
}

// ------------------------------------------------------------------
// SERVICE CENTER PORTAL
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
        list.innerHTML = `<p class="text-xs text-slate-500 italic">No maintenance records logged.</p>`;
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

    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return showToast("Product not found!", "error");

    prod.status = "InRepair";
    if (!state.repairs[prodId]) state.repairs[prodId] = [];

    state.repairs[prodId].push({
        timestamp: Date.now(),
        serviceCenter: state.accounts.serviceCenter,
        description: desc,
        partsReplaced: parts,
        costInWei: cost
    });

    document.getElementById('scProdId').value = '';
    document.getElementById('scDescription').value = '';
    document.getElementById('scParts').value = '';
    document.getElementById('scCost').value = '';

    renderAll();
    showToast(`Maintenance log recorded on-chain for Product #${prodId}!`, "success");
}

// ------------------------------------------------------------------
// PUBLIC VERIFIER PORTAL & CERTIFICATE GENERATOR
// ------------------------------------------------------------------
function handlePublicLookup(e) {
    e.preventDefault();
    const query = document.getElementById('verifierQuery').value.trim();
    const prod = findProduct(query);
    if (!prod) return showToast("Product not found!", "error");

    renderVerifierPortal(prod);
    showToast(`Loaded details for Product #${prod.id}`, "info");
}

function quickInspect(id) {
    const prod = state.products.find(p => p.id === id);
    if (prod) {
        selectedProductForInspect = prod;
        switchTab('verifier');
        renderVerifierPortal(prod);
    }
}

function renderVerifierPortal(prod) {
    selectedProductForInspect = prod;
    document.getElementById('vProdTitle').innerText = `${prod.brand} - ${prod.modelName}`;
    document.getElementById('vProdSub').innerText = `Serial: ${prod.serialNumber} | Product NFT ID: #${prod.id}`;
    document.getElementById('vCustomHash').innerText = prod.customHash;

    // QR Code
    const container = document.getElementById('qrcodeContainer');
    if (container) {
        container.innerHTML = '';
        if (typeof QRCode !== 'undefined') {
            new QRCode(container, {
                text: JSON.stringify({ id: prod.id, sn: prod.serialNumber, hash: prod.customHash }),
                width: 140,
                height: 140,
                colorDark: "#090d16",
                colorLight: "#ffffff"
            });
        }
    }

    // Render Timeline
    const timeline = document.getElementById('vTimeline');
    if (!timeline) return;

    const items = [
        { title: "Minted & Registered by Manufacturer", desc: `Registered on-chain by ${prod.manufacturer.substring(0, 8)}...`, time: prod.registrationTimestamp, icon: "factory", color: "text-sky-400" }
    ];

    if (prod.isActivated) {
        items.push({ title: "Warranty Coverage Activated", desc: `Duration: ${prod.warrantyDurationDays} days`, time: prod.warrantyStartTimestamp, icon: "zap", color: "text-amber-400" });
    }

    if (state.repairs[prod.id]) {
        state.repairs[prod.id].forEach(r => {
            items.push({ title: "Maintenance & Repair Logged", desc: `${r.description} (Parts: ${r.partsReplaced})`, time: r.timestamp, icon: "wrench", color: "text-orange-400" });
        });
    }

    const owners = state.ownershipHistory[prod.id] || [];
    for (let i = 1; i < owners.length; i++) {
        items.push({ title: "NFT Ownership Transferred", desc: `Transferred to buyer ${owners[i].substring(0, 8)}...`, time: prod.registrationTimestamp + (i * 86400 * 1000 * 2), icon: "arrow-right-left", color: "text-purple-400" });
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
        </div>
    `).join('');

    lucide.createIcons();
}

function openPrintableCertificate() {
    const prod = selectedProductForInspect || state.products[0];
    document.getElementById('certModelTitle').innerText = prod.modelName;
    document.getElementById('certBrand').innerText = `${prod.brand} | Official Blockchain Certificate`;
    document.getElementById('certSerial').innerText = prod.serialNumber;
    document.getElementById('certOwner').innerText = `${prod.currentOwner.substring(0, 10)}...`;
    document.getElementById('certStatus').innerText = prod.isActivated ? "Active Coverage" : "Registered";
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
        case 'ClaimPending': return `<span class="badge-status badge-claim">Claim Pending</span>`;
        case 'InRepair': return `<span class="badge-status badge-inrepair">In Repair</span>`;
        case 'Transferred': return `<span class="badge-status badge-transferred font-mono">NFT Transferred</span>`;
        default: return `<span class="badge-status badge-registered">${status}</span>`;
    }
}

function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toastMsg').innerText = msg;
    toast.className = `p-4 rounded-2xl border text-sm flex items-center justify-between transition-all flex ${
        type === 'success' ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200' :
        type === 'error' ? 'bg-rose-950/90 border-rose-700 text-rose-200' : 'bg-slate-900 border-slate-700 text-slate-200'
    }`;
    setTimeout(hideToast, 5000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.classList.add('hidden');
}
