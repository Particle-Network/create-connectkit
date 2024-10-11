import type { AbiFunction } from 'viem';

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
    console.error('ABI parse error:', error);
    return [];
  }
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
