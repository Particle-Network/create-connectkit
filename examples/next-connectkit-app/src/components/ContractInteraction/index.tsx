'use client'

import { useState } from 'react';
import Collapse from '../Collapse';
import Button from '../Button';
import { Input, Textarea, Selector } from '../InputWrapper';
import styles from './index.module.css';

export default function ContractInteraction() {

  return (
    <Collapse title="Contract Interaction" activeIndex={4}>
      <div className={styles['collapse-content']}>
        <Textarea placeholder="Please enter the ABI" tags={['ERC20', 'ERC721', 'ERC1155']}/>
        <Input label="Contract Address" placeholder="0x..." />
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