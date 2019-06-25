import tokens from '@aragon/templates-tokens'
import { soliditySha3 } from '../web3-utils'
import storageAbi from './storage-abi.json'

export function testTokensEnabled(network) {
  return !!tokens[network]
}
const getContract = (web3, storageAddr) => {
  return new web3.eth.Contract(storageAbi, storageAddr)
}

export default {
  set: (web3, storageAddr, from, paramName, value) =>
    getContract(web3, storageAddr)
      .methods.registerData(soliditySha3(paramName), value)
      .send({ from: from }),
  get: (web3, storageAddr, from, paramName) =>
    getContract(web3, storageAddr)
      .methods.getRegisteredData(soliditySha3(paramName))
      .call({ from: from }),
}
