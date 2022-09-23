//firebase config
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../serviceAccount.json');
const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

//ens config
const { ethers } = require('ethers');
const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth/0ae162f308490881ca5ff3e3db9d77e55087c214dd3b3f44cf656a14c4bc6dfd');
const etherscan = require('etherscan-api').init('AC7N3ZAS69KRSJZUKG67WI1XC1D5E1554F');

const erc20Abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];

const erc721Abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"operator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const erc1155Abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];

const erc165Abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}];

const ABI = {
  'ERC20': erc20Abi,
  'ERC721': erc721Abi,
  'ERC1155': erc1155Abi
}

let contractMetadata = {};

async function getContractDetails(contractAddress) {
  if(contractMetadata[contractAddress]) {
    return contractMetadata[contractAddress];
  } else {
    let details = {};
    details.contractType = await getContractType(contractAddress);
    let abiDetails = await getContractAbi(contractAddress, details.contractType);
    details.contractAbi = abiDetails.abi;
    details.abiSource = abiDetails.source;
    contractMetadata[contractAddress] = details;
    return details;
  }
}

async function getContractType(contractAddress) {
  let contract, is165;
  try {
    contract = new ethers.Contract(contractAddress, erc165Abi, provider);
    is165 = await contract.supportsInterface(0x01ffc9a7);
  } catch (e) {
    //console.log('error identifying contract');
    return 'UNKNOWN';
  }
  //console.log('is165', is165);
  if(is165) {
    try {
      //console.log('checking erc721...');
      let is721 = await contract.supportsInterface(0x80ac58cd);
      if(is721) return 'ERC721';
      //console.log('checking erc1155...');
      let is1155 = await contract.supportsInterface(0xd9b67a26);
      if(is1155) return 'ERC1155';
      //console.log('checking erc20...');
      let is20 = await contract.supportsInterface(0x36372b07);
      if(is20) return 'ERC20';
      //return 'ERC165';
    } catch(e) {
      console.error(e);
    }
  } else {
    return 'UNKNOWN';
  }
}

async function getContractAbi(address, contractType) {
  try {
    let apiResponse = await etherscan.contract.getabi(address);
    abi = JSON.parse(apiResponse.result);
  } catch (e) {
    abi = false;
  }
  if(abi) {
    return {
      source: 'etherscan',
      abi: abi
    }
  } else if (ABI[contractType]) {
    return {
      source: contractType,
      abi: ABI[contractType]
    }
  } else {
    return {
      source: "NA",
      abi: "NOT_FOUND"
    }
  }
}

async function getTxnLogs(txnHash) {
  response = {};
  let receipts = await provider.getTransactionReceipt(txnHash);
  response.rawLogs = receipts.logs;
  response.events = [];
  for (var i = 0; i < response.rawLogs.length; i++) {
    let contractAddress = response.rawLogs[i].address;
    let contractDetails = await getContractDetails(contractAddress);
    response.rawLogs[i].contractType = contractDetails.contractType;
    response.rawLogs[i].contractAbi = contractDetails.contractAbi;
    if(response.rawLogs[i].contractType == "UNKNOWN") {
      response.rawLogs[i].contractType = 'ERC20';
      response.rawLogs[i].contractAbi = ABI['ERC20'];
    }

    let name, symbol;
    let contract = new ethers.Contract(contractAddress, response.rawLogs[i].contractAbi, provider);
    try {
      name = await contract.name();
      symbol = await contract.symbol();
    } catch(e) {
      //console.log('name error', nameAbi, contractDetails, contractAddress, txnHash);
    }

    try {
      let iface = new ethers.utils.Interface(response.rawLogs[i].contractAbi);
      let event = iface.parseLog(response.rawLogs[i]);
      event.contractAddress = contractAddress;
      event.contractName = name;
      event.symbol = symbol;
      event.contractType = response.rawLogs[i].contractType;
      response.events.push(event);
    } catch(e) {
      //console.log('decoding txn receipts error');
    }

  }

  return response;
}

function getTxnSummary(txn) {
  let summary = {};
  if(txn.fromDetails.type == "wallet" && txn.toDetails.type == "wallet") {
    summary.type = "ETH";
    summary.value = txn.value;
    summary.currency = "ETH";
  } else {
    summary.toDetails = txn.toDetails;
    summary.fromDetails = txn.fromDetails;
    summary.events = [];
    txn.logs.events.forEach( (log, i) => {
      txn.logs.events[i].eventSummary = {};

      if(log.contractType == 'ERC721') {
        switch (log.name) {
          case 'Transfer':
            if(log.args[0] == '0x0000000000000000000000000000000000000000') {
              txn.logs.events[i].eventSummary = {
                  type: 'MINT',
                  from: log.args[0],
                  to: log.args[1],
                  tokenId: log.args[2]
                };
            } else {
              txn.logs.events[i].eventSummary = {
                  type: 'TRANSFER',
                  from: log.args[0],
                  to: log.args[1],
                  tokenId: log.args[2]
                };
            }
            break;
          case 'Approval':
            txn.logs.events[i].eventSummary = {
              type: 'APPROVAL',
              owner: log.args[0],
              approved: log.args[1],
              tokenId: log.args[2]
            };
            break;
          case 'ApprovalForAll':
            txn.logs.events[i].eventSummary = {
              type: 'APPROVAL_FOR_ALL',
              owner: log.args[0],
              operator: log.args[1],
              approved: log.args[2]
            };
            break;
        }
      } else if (log.contractType == 'ERC1155') {
        switch (log.name) {
          case 'TransferSingle':
            if(log.args[1] == '0x0000000000000000000000000000000000000000') {
              txn.logs.events[i].eventSummary = {
                  type: 'MINT',
                  from: log.args[1],
                  to: log.args[2],
                  tokenType: log.args[3],
                  value: log.args[4],
                };
            } else {
              txn.logs.events[i].eventSummary = {
                type: 'TRANSFER',
                from: log.args[1],
                to: log.args[2],
                tokenType: log.args[3],
                value: log.args[4],
                };
            }
            break;
          case 'TransferBatch':
            if(log.args[1] == '0x0000000000000000000000000000000000000000') {
              txn.logs.events[i].eventSummary = {
                  type: 'MINT',
                  from: log.args[1],
                  to: log.args[2],
                  tokenTypes: log.args[3],
                  values: log.args[4],
                };
            } else {
              txn.logs.events[i].eventSummary = {
                  type: 'TRANSFER',
                  from: log.args[1],
                  to: log.args[2],
                  tokenTypes: log.args[3],
                  values: log.args[4],
                };
            }
            break;
          case 'ApprovalForAll':
            txn.logs.events[i].eventSummary = {
              type: 'APPROVAL',
              owner: log.args[0],
              operator: log.args[1],
              approved: log.args[2]
            };
            break;
        }
      } else if (log.contractType == 'ERC20') {
        switch (log.name) {
          case 'Transfer':
            txn.logs.events[i].eventSummary = {
                type: 'TRANSFER',
                from:  log.args[0],
                to: log.args[1],
                value: ethers.utils.formatEther(log.args[2])
              };
            break;
          case 'Approval':
            txn.logs.events[i].eventSummary = {
              type: 'APPROVAL',
              owner: log.args[0],
              spender: log.args[1],
              value: ethers.utils.formatEther(log.args[2])
            };
            break;
        }
      } else {
        txn.logs.events[i].eventSummary = {
          type: 'UNKNOWN',
          args: log.args
        };
      };

      txn.logs.events[i].eventSummary.eventName = log.name;
      txn.logs.events[i].eventSummary.contractType = log.contractType;
      txn.logs.events[i].eventSummary.eventType = log.eventType;
      txn.logs.events[i].eventSummary.contractAddress = log.contractAddress;
      txn.logs.events[i].eventSummary.contractName = log.contractName;
      txn.logs.events[i].eventSummary.symbol = log.symbol;

      if(txn.logs.events[i].eventSummary.type) summary.events.push(txn.logs.events[i].eventSummary);
    });
  }

  if(summary.events && summary.events.length > 0) {
    let types = [...new Set(summary.events.map(e => e.contractType))];
    if(txn.toDetails.contractType == 'ERC721' || txn.fromDetails.contractType == 'ERC721' || (types.length == 1 && types[0] == 'ERC721')) {
      summary.type = 'ERC721';
    } else if(txn.toDetails.contractType == 'ERC1155' || txn.fromDetails.contractType == 'ERC1155' || (types.length == 1 && types[0] == 'ERC1155')) {
      summary.type = 'ERC1155';
    } else if(txn.toDetails.contractType == 'ERC20' || txn.fromDetails.contractType == 'ERC20' || (types.length == 1 && types[0] == 'ERC20')) {
      summary.type = 'ERC20';
    }
  }

  return summary;
}

async function processTransaction(txnHash) {
  let txn = await provider.getTransaction(txnHash);
  let fromCode = await provider.getCode(txn.from);
  let toCode = await provider.getCode(txn.to);
  txn.fromDetails = { address: txn.from };
  txn.toDetails = { address: txn.to };
  txn.fromDetails.type = fromCode == "0x" ? "wallet" : "contract";
  txn.toDetails.type = toCode == "0x" ? "wallet" : "contract";

  if(txn.fromDetails.type == "contract") {
    let fromContractDetails = await getContractDetails(txn.from);
    //console.log('fromContractDetails', fromContractDetails.contractType, fromContractDetails.abiSource);
    txn.fromDetails.contractType = txn.fromDetails.type == "contract" ? fromContractDetails.contractType : "";
    txn.fromDetails.contractAbi = txn.fromDetails.type == "contract" ? fromContractDetails.contractAbi : "";
  }

  if(txn.toDetails.type == "contract") {
    let toContractDetails = await getContractDetails(txn.to);
    //console.log('toContractDetails', toContractDetails.contractType, toContractDetails.abiSource);
    txn.toDetails.contractType = txn.toDetails.type == "contract" ? toContractDetails.contractType : "";
    txn.toDetails.contractAbi = txn.toDetails.type == "contract" ? toContractDetails.contractType : "";
  }

  txn.logs = await getTxnLogs(txn.hash);
  txn.summary = getTxnSummary(txn);
  return txn;
}

module.exports = { processTransaction }
