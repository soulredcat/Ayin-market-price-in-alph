let localTokenList = [];

// Mengambil token list dari GitHub
async function fetchTokenList() {
    const url = 'https://raw.githubusercontent.com/alephium/token-list/master/tokens/mainnet.json';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.tokens; // Ambil bagian `tokens` dari JSON
    } catch (error) {
        console.error('Error fetching token list:', error);
        return [];
    }
}

// Menggabungkan token list dari GitHub dengan token list lokal
async function updateTokenList() {
    const githubTokenList = await fetchTokenList(); // Ambil data dari GitHub
    githubTokenList.forEach(tokenFromGithub => {
        const existsInLocal = localTokenList.find(token => token.symbol === tokenFromGithub.symbol);
        if (!existsInLocal) {
            localTokenList.push(tokenFromGithub); // Tambahkan token baru dari GitHub
        }
    });

    console.log('Updated Token List:', localTokenList);
    displayAllPrices(); // Tampilkan semua token di halaman
}

// Menampilkan token di halaman HTML
function displayTokenPrice(token) {
    const tokenContainer = document.getElementById('tokenContainer');
    const tokenBox = document.createElement('div');
    tokenBox.className = 'token-box';
    tokenBox.id = `${token.symbol.toLowerCase()}coinBox`;

    const price = (Math.random() * 1000).toFixed(6); // Contoh harga random (bisa diganti dengan API)
    
    // Elemen untuk menampilkan logo, simbol, dan harga
    tokenBox.innerHTML = `
        <div class="token-logo">
            <img src="${token.logoURI}" alt="${token.symbol} logo" width="50">
        </div>
        <div class="token-info">
            <strong>${token.symbol}</strong><br>
            <span class="token-price">${price} ALPH</span><br>
            <span class="token-description">${token.description || ''}</span>
        </div>
    `;

    tokenContainer.appendChild(tokenBox);
}

// Menampilkan semua token di halaman
function displayAllPrices() {
    const tokenContainer = document.getElementById('tokenContainer');
    tokenContainer.innerHTML = ''; // Bersihkan kontainer sebelum menambahkan token baru

    localTokenList.forEach(token => {
        displayTokenPrice(token);
    });
}

// Update token list dari GitHub setiap 5 menit
setInterval(updateTokenList, 300000); // Setiap 5 menit
updateTokenList(); // Panggil saat halaman dimuat
