

/*
const tokenList = [
   {
      tokenid:
         "1a281053ba8601a658368594da034c2e99a0fb951b86498d05e76aedfe666800",
      contractid: "25ywM8iGxKpZWuGA5z6DXKGcZCXtPBmnbQyJEsjvjjWTy",
      ayincoin: "AYIN",
      decimals: 18,
  
   },
   {
      tokenid:
         "bb440a66dcffdb75862b6ad6df14d659aa6d1ba8490f6282708aa44ebc80a100",
      contractid: "vFpZ1DF93x1xGHoXM8rsDBFjpcoSsCi5ZEuA5NG5UJGX",
      apadcoin: "APAD",
      decimals: 18,
      circulating_supply_address: "27HxXZJBTPjhHXwoF1Ue8sLMcSxYdxefoN2U6d8TKmZsm",
      supply: 100000000,
   },
   {
      tokenid:
         "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
      contractid: "2A5R8KZQ3rhKYrW7bAS4JTjY9FCFLJg6HjQpqSFZBqACX",
      usdtcoin: "USDT",
      decimals: 6
   },   
   {
      tokenid:
         "edcd9b5c59f23d545faa6d5e91d196098f4d0a14146ace422a8b367ef3b34000",
      contractid: "uM4QJwHqFoTF2Pou8TqwhaDiHYLk4SHG65uaQG8r7KkT",
      ansdcoin: "ANSD",
      decimals: 18,
      circulating_supply_address: "2AhEaQiUYtAF6g1vtRQHsPR7xTkMY1PRr3k7QkXuisynF",
      supply: 200000000,
   },
   {
      tokenid:
         "722954d9067c5a5ad532746a024f2a9d7a18ed9b90e27d0a3a504962160b5600",
      contractid: "2961aauvprhETv6TXGQRc3zZY4FbLnqKon2a4wK6ABH9q",
      usdccoin: "USDC",
      decimals: 6,
   },
   {
      tokenid:
         "383bc735a4de6722af80546ec9eeb3cff508f2f68e97da19489ce69f3e703200",
      contractid: "28XY326TxvSekaAwiWDLFg2QBRfacSga8dyNJCYGUYNbq",
      wbtccoin: "WBTC",
      decimals: 8,
   },
   {
      tokenid:
         "df3008f43a7cc1d4a37eef71bf581fc4b9c3be4e2d58ed6d1df483bbb83bd200",
      contractid: "21nj6sBTtQfTwCErYAHF3CNBaDRAc1E1Q3aUCcbsuG8mu",
      ngucoin: "NGU",
      decimals: 7,
      supply: 7777777,
   },
   {
      tokenid:
         "c1aeea313e36454f35beaf40130c9219faa40ba645aff93e16429146039f8202",
      contractid: "uReV154fNdL1fNbvw8qghk67ERGbuPkLToNMCwYjiaXh",
      wangcoin: "WANG",
      decimals: 5,
      circulating_supply_address: "1GKH3r2ZG9M8R1TRFFxrf5gq6Ww7MgdrLYt7cptiG4Vrx",
      supply: 1500000,
   },
   {
      tokenid: "11bf07230f5607f626773044414a196d0471d79ba9abc26f148b57b40d983a00",
      contractid: "26hqVwuNQ7DUEMobdySHyDiW1beoDhQHpNaoXGjoHvK2w",
      topcoin: "TOP",
      decimals: 6,
      circulating_supply_address: "19f8QMDYmsQ1QnmTQuKakhTZ3UV2wVWwJ16YTSfiXDR5h",
      supply: 100000000
   },   
   {
      tokenid: "ba17d4a0d35eaf94540c31ce713d61f14b8b92f19f607d59d5f20c8d4042d700",
      contractid: "25b5aNfdrNRjJ7ugPTkxThT51L1NSvf8igQyDHKZhweiK",
      chengcoin: "CHENG",
      decimals: 6,
      circulating_supply_address: "162aufXbuQ8GMLFxBGtxucKGdd2ZVBzWT2giLHBzvvgUV",
      supply: 100000000000
   }
];
*/
const ALPH_DECIMALS = 18;
      const EXPLORER_BASEURL = "https://explorer.mainnet.alephium.org";
      const BACKEND_BASEURL = "https://explorer.alephium.notrustverify.ch";

      document.addEventListener("DOMContentLoaded", async function () {
         const alphUsd = await getAlphUsd();
         document.getElementById("autoUpdate").checked = true;
         alphPriceText(alphUsd);
         await textPrice(alphUsd);
         document.getElementById("loading").remove();
         calculateArbitrage(alphUsd);
      });

      function alphPriceText(alphUsd) {
         document.getElementById("alphPrice").innerHTML = "<i>ALPH Price $" + alphUsd + "</i>";
      }

      async function textPrice(alphUsd) {
         const tokenListElement = document.getElementById("tokenlisttable");
         const pricePromises = tokenList.map(async (value) => {
            try {
               const price = await getPrice(value["contractid"], value["id"], value["decimals"]);
               const alphBalance = price[0];
               const tokenBalance = price[1];
               const pricePerAlph = alphBalance / tokenBalance;
               let supply = value['supply'] || 0;
               let maxSupply = 0;

               if (value["circulating_supply_address"] !== undefined) {
                  supply = await getCirculatingSupply(value["supply"], value["circulating_supply_address"], value["id"], value["decimals"]);
                  maxSupply = value["supply"];
               }

               return {
                  ...value,
                  priceText: value["symbol"],
                  pricePerAlph: pricePerAlph.toFixed(6),
                  priceUsd: pricePerAlph * alphUsd,
                  supply,
                  maxSupply
               };
            } catch (err) {
               console.error(err);
               return { ...value, priceText: "error, cannot fetch price" };
            }
         });

         const tokensWithPrices = await Promise.all(pricePromises);

         tokensWithPrices.sort((a, b) => {
            let keyA = a.supply * a.priceUsd;
            let keyB = b.supply * b.priceUsd;
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
         });

      }

      function formatNumber(number) {
         const formatter = Intl.NumberFormat("en", { notation: "standard" });
         return formatter.format(number);
      }

      async function getPrice(contractid, id, decimals) {
         const price = await Promise.all([
            await fetch(
               BACKEND_BASEURL + "/addresses/" +
               contractid +
               "/tokens/" +
               id +
               "/balance"
            ).then((resp) => resp.json()),
            await fetch(
               BACKEND_BASEURL + "/addresses/" +
               contractid +
               "/balance"
            ).then((resp) => resp.json()),
         ]).then((allResponses) => {
            tokenBalance =
               parseFloat(allResponses[0]["balance"]) / Math.pow(10, decimals);
            alphBalance =
               parseFloat(allResponses[1]["balance"]) /
               Math.pow(10, ALPH_DECIMALS);

            return new Promise((resolve, reject) => {
               resolve([alphBalance, tokenBalance]);
            });
         }).catch(err => { console.error(err) });

         return price;
      }

      async function getAlphUsd() {
         const priceUsd = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd"
         ).then((resp) => resp.json()).then(data => { return data['alephium']['usd'] }).catch(error => {
            console.error(error);
            return 0;
         });
         return priceUsd;
      }

      async function getCirculatingSupply(supply, address, id, decimals) {
         const leftSupply = await fetch(
            BACKEND_BASEURL + "/addresses/" +
            address +
            "/tokens/" +
            id +
            "/balance"
         ).then((resp) => resp.json()).then(data => { return data['balance'] }).catch(error => {
            console.error(error);
            return 0;
         });

         return supply - (leftSupply / Math.pow(10, decimals));
      }


      function toggleDarkMode() {
         document.body.classList.toggle("dark-mode");
      }
