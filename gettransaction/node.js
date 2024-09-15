const fetch = require('node-fetch');

// Base URL of Alephium Explorer
const EXPLORER_BASEURL = "https://explorer.mainnet.alephium.org";
const CONTRACT_ID = "25ywM8iGxKpZWuGA5z6DXKGcZCXtPBmnbQyJEsjvjjWTy"; // AYIN Token Contract ID

async function getTransactions() {
    const url = `${EXPLORER_BASEURL}/addresses/${CONTRACT_ID}/transactions`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Return the last 5 transactions
        return data.slice(0, 5);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

// Example usage
getTransactions().then(transactions => {
    console.log("5 Transaksi Terakhir:", transactions);
});
