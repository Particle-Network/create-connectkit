'use client'

import { useState, useMemo, useEffect } from 'react';
import { useSmartAccount, useWallets } from '@particle-network/connectkit';
import type { AbiFunction } from 'viem';
import Collapse from '../Collapse';
import Button from '../Button';
import type { MethodItem } from './evm';
import { ABI_TYPE, convertToString, interactWithContract, parseAbiToMethodList, readContract } from './evm';
import { ERC1155, ERC20ABI, NFTABI } from './abi';
import { Input, Textarea, Selector } from '../InputWrapper';

import styles from './index.module.css';

export default function ContractInteraction() {
  const [abiValue, setABIValue] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [methodList, setMethodList] = useState<MethodItem[]>([]);
  const [selectMethod, setSelectMethod] = useState('');
  const [readResult, setReadResult] = useState<string>('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});
  const [primaryWallet] = useWallets();
  const smartAccount = useSmartAccount();

  const currentAbiType = useMemo(() => {
    return methodList?.find?.((item) => item.name === selectMethod)?.type;
  }, [selectMethod, methodList]);

  const selectedMethodData = useMemo(() => {
    console.log(methodList, selectMethod)
    if (methodList.length === 0 || !selectMethod) return;

    return methodList.find((item) => item.name === selectMethod)
  }, [methodList, selectMethod])

  console.log('params', params)

  useEffect(() => {
    if (abiValue) {
      setMethodList(parseAbiToMethodList(abiValue));
    } else {
      setMethodList([]);
    }
  }, [abiValue]);

  useEffect(() => {
    setReadResult('');
  }, [selectMethod]);

  const handleInputParams = (value: string, name: string, index: number) => {
    setParams({
      ...params,
      [name]: value
    })
  }

  const handleWriteContract = async () => {
    try {
      setBtnLoading(true);

      const walletClient  = primaryWallet.getWalletClient();

      const transactionHash = await interactWithContract(
        walletClient,
        contractAddress,
        methodList?.find?.((item) => item.name === selectMethod)?.abi as AbiFunction,
        params,
        smartAccount
      );

      console.log('transactionHash', transactionHash)
    } catch (error: any) {
      console.log(error);
    }
    setBtnLoading(false);
  }

  const handleReadContract = async () => {
    try {
      setBtnLoading(true);

      if (!contractAddress) {
        throw new Error('Please enter the contract address');
      }
      const walletClient  = primaryWallet.getWalletClient();

      const result = await readContract(
        walletClient,
        contractAddress,
        methodList?.find?.((item) => item.name === selectMethod)?.abi as AbiFunction,
        params
      );

      setReadResult(convertToString(result) || '');
    } catch (error: any) {
      console.log(error);
    }
    setBtnLoading(false);
  }

  return (
    <Collapse title="Contract Interaction" activeIndex={4}>
      <div className={styles['collapse-content']}>
        <Textarea
          placeholder="Please enter the ABI" 
          tags={[
            {
              key: 'ERC20',
              value: JSON.stringify(ERC20ABI, null, 2)
            },
            {
              key: 'ERC721',
              value: JSON.stringify(NFTABI, null, 2)
            },
            {
              key: 'ERC1155',
              value: JSON.stringify(ERC1155, null, 2)
            }
          ]} 
          value={abiValue} 
          setValue={setABIValue} 
        />
        <Input label="Contract Address" placeholder="0x..." value={contractAddress} setValue={setContractAddress} />
        <Selector 
          label="Method" 
          placeholder="Select a method" 
          options={methodList.map(item => ({ value: item.name, label: item.name }))}
          value={selectMethod}
          setValue={setSelectMethod} 
        />
        {
          (selectedMethodData?.inputs || []).map((item: any, index: number) => (
            <Input 
              key={item.name}
              label={`${item.name}(${item.type})`}
              setValue={(value: string) => handleInputParams(value, item.name, index)}
              value={params[index]}
            />
          ))
        }
        {
          readResult ? (
            <div>{readResult}</div>
          ) : null
        }
        {
          currentAbiType === ABI_TYPE.Write ? (
            <Button block loading={btnLoading} onClick={handleWriteContract}>WRITE</Button>
          ) : null
        }
        {
          currentAbiType === ABI_TYPE.Read ? (
            <Button block loading={btnLoading} onClick={handleReadContract}>READ</Button>
          ) : null
        }
      </div>
    </Collapse>
  )
}