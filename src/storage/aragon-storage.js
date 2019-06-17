import tokens from '@aragon/templates-tokens'
import { soliditySha3 } from '../web3-utils'

export function testTokensEnabled(network) {
  return !!tokens[network]
}
const getContract = (web3, storageAddr) => {
  return new web3.eth.Contract(
    [
      {
        constant: true,
        inputs: [],
        name: 'hasInitialized',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_script',
            type: 'bytes',
          },
        ],
        name: 'getEVMScriptExecutor',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'getRecoveryVault',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
        ],
        name: 'allowRecoverability',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'appId',
        outputs: [
          {
            name: '',
            type: 'bytes32',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'getInitializationBlock',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_token',
            type: 'address',
          },
        ],
        name: 'transferToVault',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_sender',
            type: 'address',
          },
          {
            name: '_role',
            type: 'bytes32',
          },
          {
            name: '_params',
            type: 'uint256[]',
          },
        ],
        name: 'canPerform',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'getEVMScriptRegistry',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'kernel',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'isPetrified',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'REGISTER_DATA_ROLE',
        outputs: [
          {
            name: '',
            type: 'bytes32',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'key',
            type: 'bytes32',
          },
        ],
        name: 'Registered',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'executor',
            type: 'address',
          },
          {
            indexed: false,
            name: 'script',
            type: 'bytes',
          },
          {
            indexed: false,
            name: 'input',
            type: 'bytes',
          },
          {
            indexed: false,
            name: 'returnData',
            type: 'bytes',
          },
        ],
        name: 'ScriptResult',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'vault',
            type: 'address',
          },
          {
            indexed: true,
            name: 'token',
            type: 'address',
          },
          {
            indexed: false,
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'RecoverToVault',
        type: 'event',
      },
      {
        constant: false,
        inputs: [],
        name: 'initialize',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_key',
            type: 'bytes32',
          },
          {
            name: '_value',
            type: 'string',
          },
        ],
        name: 'registerData',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_key',
            type: 'bytes32',
          },
        ],
        name: 'getRegisteredData',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    storageAddr
  )
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
