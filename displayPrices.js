// displayPrices.js

//apad
async function displayApadcoin() {
    const alphUsd = await getAlphUsd();
    const apadcoinElement = document.getElementById("apadcoinBox");
    
    // Temukan token APAD di tokenList
    const token = tokenList.find(t => t.apadcoin === "APAD");
    if (token) {
        try {
            // Ambil harga token dari API
            const priceapad = await getPrice(token.contractid, token.tokenid, token.decimals);
            const apadPerAlph = priceapad[0] / priceapad[1];
            const apadInAlph = apadPerAlph.toFixed(18); // Harga dalam ALPH
            
            apadcoinElement.innerHTML = `
                <strong>Coin:</strong> ${token.apadcoin}<br>
                <strong>Price in ALPH:</strong> ${apadInAlph}
            `;
        } catch (err) {
            apadcoinElement.innerHTML = "Error fetching APAD price.";
            console.error(err);
        }
    } else {
        apadcoinElement.innerHTML = "APAD coin not found.";
    }
}
//ayin
async function displayAyincoin() {
    const alphUsd = await getAlphUsd();
    const ayincoinElement = document.getElementById("ayincoinBox");
    
    // Temukan token AYIN di tokenList
    const token = tokenList.find(t => t.ayincoin === "AYIN");
    if (token) {
        try {
            // Ambil harga token dari API
            const price = await getPrice(token.contractid, token.tokenid, token.decimals);
            const AYINPerAlph = price[1] / price[0];
            const AYINInAlph = AYINPerAlph.toFixed(18); // Harga dalam ALPH
            
            ayincoinElement.innerHTML = `
                <strong>Coin:</strong> ${token.ayincoin}<br>
                <strong>Price in ALPH:</strong> ${AYINInAlph}
            `;
        } catch (err) {
            ayincoinElement.innerHTML = "Error fetching AYIN price.";
            console.error(err);
        }
    } else {
        ayincoinElement.innerHTML = "AYIN coin not found.";
    }
}
//usdt
async function displayUsdtcoin() {
    const alphUsd = await getAlphUsd();
    const ayincoinElement = document.getElementById("UsdtcoinBox");
    
    // Temukan token AYIN di tokenList
    const token = tokenList.find(t => t.usdtcoin === "USDT");
    if (token) {
        try {
            // Ambil harga token dari API
            const price = await getPrice(token.contractid, token.tokenid, token.decimals);
            const pricePerAlph = price[1] / price[0];
            const priceInAlph = pricePerAlph.toFixed(18); // Harga dalam ALPH
            
            ayincoinElement.innerHTML = `
                <strong>Coin:</strong> ${token.usdtcoin}<br>
                <strong>Price in ALPH:</strong> ${priceInAlph}
            `;
        } catch (err) {
            ayincoinElement.innerHTML = "Error fetching AYIN price.";
            console.error(err);
        }
    } else {
        ayincoinElement.innerHTML = "AYIN coin not found.";
    }
}
//usdc
async function displayUsdccoin() {
   const alphUsd = await getAlphUsd();
   const ayincoinElement = document.getElementById("usdccoinBox");
   
   // Temukan token AYIN di tokenList
   const token = tokenList.find(t => t.usdccoin === "USDC");
   if (token) {
       try {
           // Ambil harga token dari API
           const usdcprice = await getPrice(token.contractid, token.tokenid, token.decimals);
           const usdcPerAlph = usdcprice[0] / usdcprice[1];
           const usdcInAlph = usdcPerAlph.toFixed(18); // Harga dalam ALPH
           
           ayincoinElement.innerHTML = `
               <strong>Coin:</strong> ${token.usdccoin}<br>
               <strong>Price in ALPH:</strong> ${usdcInAlph}
           `;
       } catch (err) {
           ayincoinElement.innerHTML = "Error fetching AYIN price.";
           console.error(err);
       }
   } else {
       ayincoinElement.innerHTML = "AYIN coin not found.";
   }
}
//wbtc
async function displaywbtccoin() {
   const alphUsd = await getAlphUsd();
   const ayincoinElement = document.getElementById("wbtccoinBox");
   
   // Temukan token AYIN di tokenList
   const token = tokenList.find(t => t.wbtccoin === "WBTC");
   if (token) {
       try {
           // Ambil harga token dari API
           const wbtcprice = await getPrice(token.contractid, token.tokenid, token.decimals);
           const wbtcPerAlph = wbtcprice[1] / wbtcprice[0];
           const wbtcInAlph = wbtcPerAlph.toFixed(18); // Harga dalam ALPH
           
           ayincoinElement.innerHTML = `
               <strong>Coin:</strong> ${token.wbtccoin}<br>
               <strong>Price in ALPH:</strong> ${wbtcInAlph}
           `;
       } catch (err) {
           ayincoinElement.innerHTML = "Error fetching AYIN price.";
           console.error(err);
       }
   } else {
       ayincoinElement.innerHTML = "AYIN coin not found.";
   }
}



async function displayalphayin() 
{
    const alphUsd = await getAlphUsd();
    const ayincoinElement = document.getElementById("alph-ayin");
    
    // Temukan token AYIN di tokenList
    const token = tokenList.find(t => t.ayincoin === "AYIN");
    if (token) 
        {
        try {
            // Ambil harga token dari API
            const ayinprice = await getPrice(token.contractid, token.tokenid, token.decimals);
            const ayinPerAlph = ayinprice[1] / ayinprice[0];
            const ayinInAlph = ayinPerAlph.toFixed(18); // Harga dalam ALPH
                        
            ayincoinElement.innerHTML = `
                <strong>Coin:</strong> alph-ayin<br>
                <strong>ALPH to ayin:</strong> ${ayinInAlph}<br>
                <strong>ALPH to USDT:</strong> ${usdtInAlph}<br>
            `;
        } catch (err) {
            ayincoinElement.innerHTML = "Error fetching ayin/usdt price.";
            console.error(err);
        }
    } else {
        ayincoinElement.innerHTML = "USDT coin not found.";
    }
}



// Panggil fungsi untuk menampilkan informasi token saat halaman dimuat
displayApadcoin();
displayAyincoin();
displayUsdtcoin();
displayalphayin();
displayUsdccoin();
displaywbtccoin();
// Fungsi lain untuk token yang berbeda