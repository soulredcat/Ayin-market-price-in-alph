const ALPH_DECIMALS = 18;
const BACKEND_BASEURL = "https://backend.mainnet.alephium.org"; // Ensure this is correct

// Fetch ALPH/USD price from CoinGecko
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

// Main function to calculate token prices
async function textPrice(alphUsd) {
    const pricePromises = localTokenList.map(async (token) => {
        try {
            const price = await getPrice(token.contractid, token.id, token.decimals);
            const alphBalance = price[0];
            const tokenBalance = price[1];
            const pricePerAlph = alphBalance / tokenBalance;

            let supply = token.supply || 0;
            let maxSupply = 0;

            // If the token has a circulating supply address, get the current supply
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

    // Sort tokens by their supply and price in USD
    tokensWithPrices.sort((a, b) => {
        let keyA = a.supply * a.priceUsd;
        let keyB = b.supply * b.priceUsd;
        return keyB - keyA; // Sort descending
    });

    console.log("Tokens with prices:", tokensWithPrices); // Log the results
    return tokensWithPrices;
}
async function getPrice(contractid, id, decimals) {
   try {
       // Fetch the token balance
       const response = await fetch(`https://backend.mainnet.alephium.org/addresses/${contractid}/tokens/${id}/balance`);
       const ayin = await response.json(); // The full response object
       
       // Fetch the ALPH balance
       const response2 = await fetch(`https://backend.mainnet.alephium.org/addresses/${contractid}/balance`);
       const alph = await response2.json();
       
       // Calculate the price of the token in ALPH
       const tokenPrice = (parseFloat(alph['balance']) / parseFloat(ayin['balance'])).toFixed(4);
       
       // Return token price
       return tokenPrice;
   } catch (error) {
       console.error("Error fetching balances:", error);
       return null;
   }
}

// Optional: Get circulating supply
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

// Display a single token's price and details
async function displayTokenPrice(token) {
   const tokenContainer = document.getElementById('tokenContainer');
   const tokenBox = document.createElement('div');
   tokenBox.className = 'token-box';
   tokenBox.id = `${token.symbol.toLowerCase()}coinBox`;

   // Get the price for the token
   const pricePerAlph = await getPrice(token.contractid, token.id, token.decimals);

   // Build the HTML for the token's price and details
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

// Display all tokens in the container
async function displayAllPrices() {
    const tokenContainer = document.getElementById('tokenContainer');
    tokenContainer.innerHTML = ''; // Clear the container before adding new tokens

    for (let token of localTokenList) {
        await displayTokenPrice(token);
    }
}

// When the page loads, fetch prices and display tokens
document.addEventListener("DOMContentLoaded", async () => {
    const alphUsd = await getAlphUsd();  // Fetch ALPH price in USD
    await textPrice(alphUsd);  // Calculate token prices
    await displayAllPrices();  // Display tokens on the page
});
