'use client'

import { useState } from 'react';
import Collapse from '../Collapse';
import Button from '../Button';
import { Input, Textarea, Selector } from '../InputWrapper';
import styles from './index.module.css';

export default function SendNativeToken() {
  
  return (
    <Collapse title="Send Native Token" activeIndex={1}>
      <div className={styles['collapse-content']}>
        <Input type='text' label="Receive address" placeholder="0x..." />
        <Input type='number' label="Token amount"  placeholder="amount in wei" suffix="wei"/>
        <Button block>SEND TRANSACTION</Button>
      </div>
    </Collapse>
  )
}