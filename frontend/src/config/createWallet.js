// Crossmint's API key  
const apiKey = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY;

async function createWallet(apiKey) {
    const response = await fetch("https://staging.crossmint.com/api/v1-alpha2/wallets", {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "evm-smart-wallet",
            config: {
                adminSigner: {
                   "type": "evm-fireblocks-custodial"
                }
            },
            linkedUser: "email:arthur-weasley@ministryofmagic.com"
        })
    });
    
    return await response.json();
}
