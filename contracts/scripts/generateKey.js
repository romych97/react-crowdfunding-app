const { Wallet } = require("ethers");

async function generateKey() {
  const wallet = Wallet.createRandom();
  console.log("Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey); // Скопируй без "0x"
  console.log("Mnemonic:", wallet.mnemonic.phrase);
}

generateKey();
