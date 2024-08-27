import type { AbiFunction, Address, WalletClient } from 'viem';
import {
  decodeFunctionResult,
  encodeFunctionData,
  isAddress,
  keccak256,
  parseAbi,
  parseEther,
  toHex,
  type Hash,
} from 'viem';

import events from './eventBus';

export enum TransactionType {
  ERC20Approve = 'ERC20Approve',
  SendERC20Token = 'SendERC20Token',
  SendERC721Token = 'SendERC721Token',
  SendERC1155Token = 'SendERC1155Token',
}

export enum ABI_TYPE {
  Read = 'Read',
  Write = 'Write',
}

export interface MethodItem {
  name: string;
  type: ABI_TYPE | '';
  inputs: {
    name: string;
    type: string;
  }[];
  abi: AbiFunction;
}

export function getAbiType(abiJson: AbiFunction): ABI_TYPE | '' {
  if (typeof abiJson !== 'object' || abiJson === null) {
    throw new Error('Invalid ABI JSON input');
  }

  const stateMutability = abiJson.stateMutability;

  if (typeof stateMutability !== 'string') {
    throw new Error('Invalid or missing stateMutability in ABI JSON');
  }

  switch (stateMutability.toLowerCase()) {
    case 'view':
    case 'pure':
      return ABI_TYPE.Read;
    case 'nonpayable':
    case 'payable':
      return ABI_TYPE.Write;
    default:
      return '';
  }
}

/**
 * identifyTransactionTypes
 * @param abi string | AbiFunction[]
 * @returns TransactionType[]
 */
export function identifyTransactionTypes(abi: string | AbiFunction[]): TransactionType[] {
  try {
    let parsedAbi: AbiFunction[];

    if (typeof abi === 'string') {
      parsedAbi = parseAbi([abi]);
    } else if (Array.isArray(abi)) {
      parsedAbi = abi;
    } else {
      throw new Error('Invalid ABI format');
    }

    const transactionTypes: TransactionType[] = [];

    for (const func of parsedAbi) {
      if (func.type === 'function') {
        switch (func.name) {
          case 'approve':
            transactionTypes.push(TransactionType.ERC20Approve);
            break;
          case 'transfer':
            transactionTypes.push(TransactionType.SendERC20Token);
            break;
          case 'transferFrom':
            if (func.inputs.length === 3 && func.inputs[2].type === 'uint256') {
              transactionTypes.push(TransactionType.SendERC721Token);
            } else {
              transactionTypes.push(TransactionType.SendERC20Token);
            }
            break;
          case 'safeTransferFrom':
          case 'safeBatchTransferFrom':
            transactionTypes.push(TransactionType.SendERC1155Token);
            break;
        }
      }
    }

    return transactionTypes;
  } catch (error) {
    console.error('Failed to identify transaction types:', error);
    return [];
  }
}

export function parseAbiToMethodList(abiInput: string): MethodItem[] {
  try {
    let abiJson: AbiFunction[] = eval(`(${abiInput})`);

    if (!Array.isArray(abiJson)) {
      abiJson = [abiJson];
    }

    const functionAbi = abiJson.filter((item) => item.type === 'function') as AbiFunction[];

    return functionAbi.map((func) => ({
      name: func.name,
      type: getAbiType(func),
      inputs: func.inputs.map((input, index) => ({
        name: input.name || `param${index}`,
        type: input.type,
      })),
      abiType: getAbiType(func),
      abi: func,
    }));
  } catch (error) {
    console.error('ABI 解析错误:', error);
    return [];
  }
}

export async function sendTransaction(
  provider: WalletClient,
  toAddress: string,
  amount: string,
  smartAccount?: any
): Promise<Hash> {
  if (!isAddress(toAddress)) {
    throw new Error('Invalid recipient address');
  }

  const amountBigInt = parseEther(amount);
  if (amountBigInt <= 0n) {
    throw new Error('Amount must be greater than 0');
  }

  const [account] = await provider.request({ method: 'eth_requestAccounts' });
  if (!account) {
    throw new Error('No accounts found. Please connect a wallet.');
  }

  const transaction: any = {
    from: account,
    to: toAddress,
    value: amount,
    data: '0x',
    type: '0x0',
  };

  let txHash = '' as Hash;

  if (smartAccount) {
    const feeQuotes = await smartAccount.getFeeQuotes(transaction);
    txHash = await new Promise<Hash>((resolve, reject) => {
      events.emit('erc4337:prepareTransaction', feeQuotes);
      events.once('erc4337:sendTransaction', async (params: any) => {
        try {
          const res = await smartAccount.sendTransaction(params);
          resolve(res as Hash);
        } catch (error) {
          events.emit('erc4337:sendTransactionError', error);
        }
      });
      events.once('erc4337:sendTransactionError', (error) => {
        reject(error);
      });
    });
  } else {
    txHash = await provider.sendTransaction({
      ...transaction,
    } as any);
  }

  return txHash;
}

export async function sendEIP1559Transaction(provider: WalletClient, toAddress: string, amount: string): Promise<Hash> {
  if (!isAddress(toAddress)) {
    throw new Error('Invalid recipient address');
  }

  const amountBigInt = parseEther(amount);
  if (amountBigInt <= 0n) {
    throw new Error('Amount must be greater than 0');
  }

  const [account] = await provider.request({ method: 'eth_requestAccounts' });
  if (!account) {
    throw new Error('No accounts found. Please connect a wallet.');
  }

  const transaction: any = {
    from: account,
    to: toAddress,
    value: amount,
    type: '0x2',
  };

  const txHash = await provider.request({ method: 'eth_sendTransaction', params: [transaction] });

  return txHash;
}

function convertAbiJsonToSignatures(abiJson: AbiFunction[]) {
  return abiJson
    .map((item: AbiFunction) => {
      if (item.type === 'function') {
        const inputs = item.inputs.map((input) => input.type).join(',');
        const outputs = item.outputs ? item.outputs.map((output) => output.type).join(',') : '';
        return `${item.type} ${item.name}(${inputs})${item.stateMutability ? ' ' + item.stateMutability : ''}${outputs ? ' returns (' + outputs + ')' : ''}`;
      } else if (item.type === 'event') {
        const params = item.inputs
          .map((input: any) => `${input.type}${input.indexed ? ' indexed' : ''} ${input.name}`)
          .join(', ');
        return `${item.type} ${item.name}(${params})`;
      }
      return null;
    })
    .filter((item): item is string => item !== null);
}

export async function interactWithContract(
  provider: WalletClient,
  contractAddress: string,
  abiJson: AbiFunction,
  userInputs: Record<string, string>,
  smartAccount: any
): Promise<Hash> {
  const abiSignatures = convertAbiJsonToSignatures([abiJson]);
  const abi = parseAbi(abiSignatures);

  const functionParams = abiJson.inputs.map((input) => {
    if (input.type === 'uint256') {
      return BigInt(userInputs[input.name as string]);
    }
    return userInputs[input.name as string];
  });

  const data = encodeFunctionData({
    abi,
    functionName: abiJson.name,
    args: functionParams,
  });

  const [account] = await provider.request({ method: 'eth_requestAccounts' });
  if (!account) {
    throw new Error('No accounts found. Please connect a wallet.');
  }

  const transaction: any = {
    from: account,
    to: contractAddress,
    data: data,
  };

  let txHash = '' as Hash;

  if (smartAccount) {
    const feeQuotes = await smartAccount.getFeeQuotes(transaction);
    txHash = await new Promise<Hash>((resolve, reject) => {
      events.emit('erc4337:prepareTransaction', feeQuotes);
      events.once('erc4337:sendTransaction', async (params: any) => {
        try {
          const res = await smartAccount.sendTransaction(params);
          resolve(res as Hash);
        } catch (error) {
          events.emit('erc4337:sendTransactionError', error);
        }
      });
      events.once('erc4337:sendTransactionError', (error) => {
        reject(error);
      });
    });
  } else {
    txHash = (await provider.request({
      method: 'eth_sendTransaction',
      params: [transaction],
    })) as Hash;
  }

  return txHash;
}

export async function readContract(
  provider: WalletClient,
  contractAddress: string,
  abiJson: AbiFunction,
  userInputs: Record<string, string>
): Promise<any> {
  const abiSignatures = convertAbiJsonToSignatures([abiJson]);
  const abi = parseAbi(abiSignatures);

  const functionParams = abiJson.inputs.map((input) => {
    if (input.type === 'uint256') {
      return BigInt(userInputs[input.name as string]);
    }
    return userInputs[input.name as string];
  });

  const data = encodeFunctionData({
    abi,
    functionName: abiJson.name,
    args: functionParams,
  });

  const callObject = {
    to: contractAddress,
    data: data,
  };

  const result = await provider.request({
    // @ts-ignore
    method: 'eth_call',
    // @ts-ignore
    params: [callObject, 'latest'],
  });

  const decodedResult = decodeFunctionResult({
    abi,
    functionName: abiJson.name,
    // @ts-ignore
    data: result,
  });

  return decodedResult;
}

export function convertToString(value: any): string {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return '[' + value.map(convertToString).join(', ') + ']';
  }

  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toISOString();
    }
    const entries = Object.entries(value).map(([key, val]) => `"${key}": ${convertToString(val)}`);
    return '{' + entries.join(', ') + '}';
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Failed to stringify value:', error);
    return '[Unstringifiable value]';
  }
}

/**
 * generateUniqueId
 * @returns unique id
 */
function generateUniqueId(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const timestamp = Date.now().toString();
  const combined = new Uint8Array(randomBytes.length + timestamp.length);
  combined.set(randomBytes);
  combined.set(new TextEncoder().encode(timestamp), randomBytes.length);
  return toHex(keccak256(combined));
}

/**
 * personalSign
 * @param provider Web3 provider
 * @param message sign message
 * @param address signer address
 * @param unique if generate unique id
 * @returns signature
 */
export async function personalSign(
  provider: any,
  message: string,
  address: string,
  unique = false
): Promise<{ signature: string; uniqueId?: string }> {
  try {
    let fullMessage = message;
    let uniqueId: string | undefined;

    if (unique) {
      uniqueId = generateUniqueId();
      fullMessage = `${message}\n\nUnique ID: ${uniqueId}`;
    }

    // const messageHash = keccak256(toHex(fullMessage));

    const signature = await provider.request({
      method: 'personal_sign',
      params: [toHex(fullMessage), address],
    });

    return unique ? { signature, uniqueId } : { signature };
  } catch (error) {
    console.error('Personal sign failed:', error);
    throw error;
  }
}

/**
 * signTypedData
 * @param provider Web3 provider
 * @param address signer address
 * @param typedDataJson domain, types, message primaryType
 * @param unique if generate unique id
 * @returns signature
 */
export async function signTypedData(
  provider: any,
  address: Address,
  typedDataJson: {
    domain: Record<string, any>;
    types: Record<string, Array<{ name: string; type: string }>>;
    message: Record<string, any>;
    primaryType: string;
  },
  unique = false
): Promise<`0x${string}`> {
  let { domain, types, message, primaryType } = typedDataJson;

  if (unique) {
    const timestamp = Date.now();
    const randomValue = Math.random().toString(36).substring(2, 15);
    const uniqueId = keccak256(toHex(`${timestamp}-${randomValue}`));

    message = {
      ...message,
      uniqueId,
    };
    types = {
      ...types,
      [primaryType]: [...(types[primaryType] || []), { name: 'uniqueId', type: 'bytes32' }],
    };
  }

  const typedData = { domain, types, primaryType, message };

  const signature: `0x${string}` = await provider.request({
    method: 'eth_signTypedData_v4',
    params: [address, JSON.stringify(typedData)],
  });

  return signature;
}

/**
 * 使用 provider.request 签名消息
 * @param provider Web3 provider (如 MetaMask)
 * @param address 签名者地址
 * @param message 要签名的消息
 * @returns 签名结果
 */
export async function signMessage(provider: any, address: string, message: string): Promise<string> {
  // // 将消息转换为十六进制字符串
  // const hexMessage = '0x' + Buffer.from(message).toString('hex');

  // // 使用 provider.request 方法签名消息
  // const signature: string = await provider.request({
  //   method: 'personal_sign',
  //   params: [hexMessage, address],
  // });

  // return signature;

  // 直接使用明文消息
  const signature: string = await provider.request({
    method: 'personal_sign',
    params: [message, address],
  });

  return signature;
}
