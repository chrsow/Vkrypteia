import '../global';
// import 'babel-preset-react-native-web3/globals';
import Web3 from 'web3';
import { Platform } from 'react-native';
import Promise from 'bluebird'; 
// import HDWalletProvider from 'truffle-hdwallet-provider';
import { RINKEBY_RPC_URL } from './config';
import { INFURA_ACCESS_TOKEN } from 'react-native-dotenv';

// const getWeb3 = (mnemonic, rpcUrl) => {
const getWeb3 = (rpcUrl) => {
  // if (!mnemonic) {
  //   mnemonic = 'knee violin certain rebuild rival couch wonder bind bridge delay tourist poet';
  // }
  if(!rpcUrl) {
    rpcUrl = RINKEBY_RPC_URL+ INFURA_ACCESS_TOKEN;
  }

  const provider = new Web3.providers.WebsocketProvider('wss://websocket-rinkeby.ethereum.nodes.augur.net');
  // const provider = new Web3.providers.HttpProvider(rpcUrl);
  const web3 = new Web3(provider);

  if (typeof web3.eth.getAccountsPromise === "undefined") {
    Promise.promisifyAll(web3.eth, { suffix: "Promise" });
  }
  
  
  return web3;
};

export default getWeb3;