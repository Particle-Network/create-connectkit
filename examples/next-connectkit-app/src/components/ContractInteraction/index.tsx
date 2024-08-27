'use client'

import { useState } from 'react';
import Collapse from '../Collapse';
import Button from '../Button';
import { ERC1155, ERC20ABI, NFTABI } from './abi';
import { Input, Textarea, Selector } from '../InputWrapper';

import styles from './index.module.css';

export default function ContractInteraction() {
  const [apiValue, setABIValue] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  return (
    <Collapse title="Contract Interaction" activeIndex={4}>
      <div className={styles['collapse-content']}>
        <Textarea placeholder="Please enter the ABI" tags={[
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
        ]} value={apiValue} setValue={setABIValue} />
        <Input label="Contract Address" placeholder="0x..." value={contractAddress} setValue={setContractAddress} />
        <Selector label="Method" placeholder="Select a method" options={
          [
            {
              label: 'balanceOf',
              value: 'balanceOf'
            },
            {
              label: 'transfer',
              value: 'transfer'
            },
            {
              label: 'transferFrom',
              value: 'transferFrom'
            },
            {
              label: 'approve',
              value: 'approve'
            },
            {
              label: 'totalSupply',
              value: 'totalSupply'
            }
          ]
        } />
      </div>
    </Collapse>
  )
}