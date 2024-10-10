import { useAccount, usePublicClient, useWallets } from '@particle-network/connectkit';
import { useEffect, useMemo, useState } from 'react';
import type { Abi, Address } from 'viem';
import type { MethodItem } from '../../util';
import { ABI_TYPE, convertToString, parseAbiToMethodList } from '../../util';
import Button from '../Button';
import Collapse from '../Collapse';
import { Input, Selector, Textarea } from '../InputWrapper';
import { ERC1155, ERC20ABI, NFTABI } from './abi';

import styles from './index.module.css';

export default function ContractInteraction() {
  const [abiValue, setABIValue] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [selectMethod, setSelectMethod] = useState('');
  const [readResult, setReadResult] = useState<string>('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});
  const [primaryWallet] = useWallets();
  const publicClient = usePublicClient();
  const { chain, address } = useAccount();

  const methodList = useMemo(() => {
    if (!abiValue) return [];

    return parseAbiToMethodList(abiValue);
  }, [abiValue]);

  const selectedMethodData: Partial<MethodItem> = useMemo(() => {
    if (methodList.length === 0 || !selectMethod) return {};

    return methodList.find((item) => item.name === selectMethod) as MethodItem;
  }, [methodList, selectMethod]);

  const functionParams = useMemo(() => {
    if (!selectedMethodData) return [];

    return selectedMethodData.abi?.inputs.map((input) => {
      if (input.type === 'uint256' && params[input.name as string]) {
        return BigInt(params[input.name as string]);
      }
      return params[input.name as string];
    });
  }, [selectedMethodData, params]);

  useEffect(() => {
    setReadResult('');
    setParams({});
  }, [selectMethod]);

  const handleInputParams = (value: string, name: string, index: number) => {
    setParams({
      ...params,
      [name]: value,
    });
  };

  const handleWriteContract = async () => {
    try {
      setBtnLoading(true);

      if (!contractAddress) {
        throw new Error('Please enter the contract address');
      }

      const walletClient = primaryWallet.getWalletClient();
      const hash = await walletClient.writeContract({
        address: contractAddress as Address,
        abi: JSON.parse(abiValue) as Abi,
        functionName: selectedMethodData.abi?.name as string,
        args: functionParams,
        chain,
        account: address as Address,
      });

      setReadResult(`transaction hash: ${hash}` || '');
    } catch (error: any) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleReadContract = async () => {
    try {
      setBtnLoading(true);

      if (!contractAddress) {
        throw new Error('Please enter the contract address');
      }

      if (!publicClient) {
        throw new Error('Wrong publicClient');
      }

      const result = await publicClient.readContract({
        address: contractAddress as Address,
        abi: JSON.parse(abiValue) as Abi,
        functionName: selectedMethodData.abi?.name as string,
        args: functionParams || [],
      });

      setReadResult(convertToString(result) || '');
    } catch (error: any) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Collapse title='Contract Interaction' activeIndex={4}>
      <div className={styles['collapse-content']}>
        <Textarea
          placeholder='Please enter the ABI'
          tags={[
            {
              key: 'ERC20',
              value: JSON.stringify(ERC20ABI, null, 2),
            },
            {
              key: 'ERC721',
              value: JSON.stringify(NFTABI, null, 2),
            },
            {
              key: 'ERC1155',
              value: JSON.stringify(ERC1155, null, 2),
            },
          ]}
          value={abiValue}
          setValue={setABIValue}
        />
        <Input label='Contract Address' placeholder='0x...' value={contractAddress} setValue={setContractAddress} />
        <Selector
          label='Method'
          placeholder='Select a method'
          options={methodList.map((item) => ({ value: item.name, label: item.name }))}
          value={selectMethod}
          setValue={setSelectMethod}
        />
        {(selectedMethodData?.inputs || []).map((item: any, index: number) => (
          <Input
            key={item.name}
            label={`${item.name}(${item.type})`}
            setValue={(value: string) => handleInputParams(value, item.name, index)}
            value={params[index]}
          />
        ))}
        {readResult ? <div>{readResult}</div> : null}
        {selectedMethodData.type === ABI_TYPE.Write ? (
          <Button block loading={btnLoading} onClick={handleWriteContract}>
            WRITE
          </Button>
        ) : null}
        {selectedMethodData.type === ABI_TYPE.Read ? (
          <Button block loading={btnLoading} onClick={handleReadContract}>
            READ
          </Button>
        ) : null}
      </div>
    </Collapse>
  );
}
