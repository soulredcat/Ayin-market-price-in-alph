let localTokenList = []; 


async function fetchTokenList() {
  const url = 'https://raw.githubusercontent.com/alephium/token-list/master/tokens/mainnet.json';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.tokens; 
  } catch (error) {
    console.error('Error fetching token list:', error);
    return [];
  }
}


async function fetchLocalTokenList() {
  const url = './localtokens.json'; 
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Could not fetch local tokens');
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching local token list:', error);
    return [];
  }
}


async function updateTokenList() {
  const githubTokenList = await fetchTokenList(); 
  const localTokens = await fetchLocalTokenList(); 

  githubTokenList.forEach(tokenFromGithub => {
    const localToken = localTokens.find(localToken => localToken.symbol === tokenFromGithub.symbol);

    if (localToken) {
   
      tokenFromGithub.contractid = localToken.contractid;
      tokenFromGithub.supply = localToken.supply;
    } else {
      
      tokenFromGithub.contractid = '';
      tokenFromGithub.supply = 0;
    }

    localTokenList.push(tokenFromGithub);
  });

  displayAllPrices(); 
}


document.addEventListener('DOMContentLoaded', () => {
  updateTokenList(); 
});
