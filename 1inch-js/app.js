Moralis.initialize("***");
Moralis.serverURL = "***";

let web3;

const user = Moralis.User.current();
// add from here down
async function init() {
  web3 = await Moralis.enable();
  await Moralis.initPlugins();
}
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.Web3.authenticate();
  }
  console.log("logged in user:", user);
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

async function getSupportedTokens() {
  // Get chains
  const chain = document.getElementById("chain").value;
  const tokens = await Moralis.Plugins.oneInch.getSupportedTokens({
    chain, // The blockchain you want to use (eth/bsc/polygon)
  });
  const tokenList = Object.keys(tokens.tokens).map((key) => tokens.tokens[key]);
  var fromToken = document.getElementById("fromToken");
  var toToken = document.getElementById("toToken");
  fromToken.innerHTML = "";
  toToken.innerHTML = "";
  for (i = 0; i < tokenList.length; i++) {
    var item = document.createElement("option");
    var item2 = document.createElement("option");
    item.value = tokenList[i].address;
    item2.value = tokenList[i].address;
    item.text = tokenList[i].name;
    item2.text = tokenList[i].name;
    fromToken.options.add(item);
    toToken.options.add(item2);
  }
}

async function getQuote() {
  const chain = document.getElementById("chain").value;
  const fromTokenAddress = document.getElementById("fromToken").value;
  const toTokenAddress = document.getElementById("toToken").value;
  const quote = await Moralis.Plugins.oneInch.quote({
    chain, // The blockchain you want to use (eth/bsc/polygon)
    fromTokenAddress, // The token you want to swap
    toTokenAddress, // The token you want to receive
    amount: 1000,
  });
  document.getElementById("result").innerHTML = JSON.stringify(quote);
  console.log(quote);
}

async function hasAllowance() {
  const chain = document.getElementById("chain").value;
  const fromTokenAddress = document.getElementById("fromToken").value;
  const allowance = await Moralis.Plugins.oneInch.hasAllowance({
    chain, // The blockchain you want to use (eth/bsc/polygon)
    fromTokenAddress, // The token you want to swap
    fromAddress: user.attributes.accounts[0], // Your wallet address
    amount: 1000,
  });
  document.getElementById("result").innerHTML = JSON.stringify(allowance);
  console.log(`The user has enough allowance: ${allowance}`);
}

async function approve() {
  const chain = document.getElementById("chain").value;
  const fromTokenAddress = document.getElementById("fromToken").value;
  await Moralis.Plugins.oneInch.approve({
    chain, // The blockchain you want to use (eth/bsc/polygon)
    tokenAddress: fromTokenAddress, // The token you want to swap
    fromAddress: user.attributes.accounts[0], // Your wallet address
  });
}

async function swap() {
  const chain = document.getElementById("chain").value;
  const fromTokenAddress = document.getElementById("fromToken").value;
  const toTokenAddress = document.getElementById("toToken").value;
  const receipt = await Moralis.Plugins.oneInch.swap({
    chain, // The blockchain you want to use (eth/bsc/polygon)
    fromTokenAddress, // The token you want to swap
    toTokenAddress, // The token you want to receive
    amount: 1000,
    fromAddress: user.attributes.accounts[0], // Your wallet address
    slippage: 1,
  });
  document.getElementById("result").innerHTML = JSON.stringify(receipt);
  console.log(receipt);
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
document.getElementById("btn-getsupportedtokens").onclick = getSupportedTokens;
document.getElementById("btn-getquote").onclick = getQuote;
document.getElementById("btn-hasallowance").onclick = hasAllowance;
document.getElementById("btn-approve").onclick = approve;
document.getElementById("btn-swap").onclick = swap;
init();
