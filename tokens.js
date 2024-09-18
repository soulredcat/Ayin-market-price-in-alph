const ALPH_DECIMALS = 18;
const BACKEND_BASEURL = "https://backend.mainnet.alephium.org"; 

async function getAlphUsd() {
    const priceUsd = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd"
    )
    .then((resp) => resp.json())
    .then((data) => data['alephium']['usd'])
    .catch((error) => {
        console.error("Error fetching ALPH price in USD:", error);
        return 0;
    });
    return priceUsd;
}


async function textPrice(alphUsd) {
    const pricePromises = localTokenList.map(async (token) => {
        try {
            const price = await getPrice(token.contractid, token.id, token.decimals);
            const alphBalance = price[0];
            const tokenBalance = price[1];
            const pricePerAlph = alphBalance / tokenBalance;

            let supply = token.supply || 0;
            let maxSupply = 0;

            
            if (token.circulating_supply_address) {
                supply = await getCirculatingSupply(
                    token.supply,
                    token.circulating_supply_address,
                    token.id,
                    token.decimals
                );
                maxSupply = token.supply;
            }

            return {
                ...token,
                pricePerAlph: pricePerAlph.toFixed(6),
                priceUsd: pricePerAlph * alphUsd,
                supply,
                maxSupply
            };
        } catch (err) {
            console.error("Error fetching price for token:", err);
            return { ...token, priceText: "error, cannot fetch price" };
        }
    });

    const tokensWithPrices = await Promise.all(pricePromises);

    
    tokensWithPrices.sort((a, b) => {
        let keyA = a.supply * a.priceUsd;
        let keyB = b.supply * b.priceUsd;
        return keyB - keyA; 
    });

    console.log("Tokens with prices:", tokensWithPrices); 
    return tokensWithPrices;
}

async function getPrice(contractid, id, decimals) {
    try {
        
        const response = await fetch(`https://backend.mainnet.alephium.org/addresses/${contractid}/tokens/${id}/balance`);
        const ayin = await response.json();

        
        const response2 = await fetch(`https://backend.mainnet.alephium.org/addresses/${contractid}/balance`);
        const alph = await response2.json();

        
        if (!ayin['balance'] || !alph['balance']) {
            throw new Error("Balance information missing in the response.");
        }

        
        const tokenBalance = parseFloat(ayin['balance']) / (10 ** decimals); 
        const alphBalance = parseFloat(alph['balance']) / (10 ** 18); 

        
        const tokenPrice = (tokenBalance / alphBalance).toFixed(18);

       
        return tokenPrice;
    } catch (error) {
        console.error("Error fetching balances:", error.message || error);
        return null;
    }
}


async function getCirculatingSupply(supply, address, id, decimals) {
   try {
       const leftSupplyResponse = await fetch(`${BACKEND_BASEURL}/addresses/${address}/tokens/${id}/balance`);
       const leftSupplyData = await leftSupplyResponse.json();
       const leftSupply = leftSupplyData['balance'];

       return supply - (leftSupply / Math.pow(10, decimals));
   } catch (error) {
       console.error("Error fetching circulating supply:", error);
       return 0;
   }
}


async function displayTokenPrice(token) {
   const tokenContainer = document.getElementById('tokenContainer');
   const tokenBox = document.createElement('div');
   tokenBox.className = 'token-box';
   tokenBox.id = `${token.symbol.toLowerCase()}coinBox`;

   
   const pricePerAlph = await getPrice(token.contractid, token.id, token.decimals);

   
   tokenBox.innerHTML = `
       <div class="token-logo">
           <img src="${token.logoURI}" alt="${token.symbol} logo" width="50">
       </div>
       <div class="token-info">
           <strong>${token.symbol}</strong><br>
           <span class="token-price">${pricePerAlph} ALPH</span><br>
           <span class="token-description">${token.description || ''}</span>
       </div>
   `;

   tokenContainer.appendChild(tokenBox);
}


async function displayAllPrices() {
    const tokenContainer = document.getElementById('tokenContainer');
    tokenContainer.innerHTML = ''; 

    for (let token of localTokenList) {
        await displayTokenPrice(token);
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    const alphUsd = await getAlphUsd();  
    await textPrice(alphUsd); 
    await displayAllPrices(); 
});
