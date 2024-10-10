import rightIcon from '@/assets/images/right.svg';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import Tag from '../Tag';

import styles from './index.module.css';

type InputWrapperProps = {
  label?: String;
  children?: React.ReactNode;
};

function InputWrapper(props: InputWrapperProps) {
  return (
    <div className={styles['input-wrapper']}>
      <div className={styles['label']}>{props.label}</div>
      {props.children}
    </div>
  );
}

type InputProps = {
  value: string | undefined;
  setValue: (data: string) => void;
  label: String;
  children?: React.ReactNode;
  placeholder?: string;
  type?: string;
  suffix?: string;
};

export function Input(props: InputProps) {
  const { value, setValue } = props;

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <InputWrapper label={props.label}>
      <input
        type={props.type || 'text'}
        className={styles['input']}
        placeholder={props.placeholder}
        value={value}
        onChange={handleInputValue}
      />
      {props.suffix && <span className={styles['suffix']}>{props.suffix}</span>}
    </InputWrapper>
  );
}

type TextareaProps = {
  value: string;
  setValue: (data: string) => void;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  tags?: {
    key: string;
    value: string;
  }[];
  type?: string;
};

export function Textarea(props: TextareaProps) {
  const { value, setValue } = props;

  const handleInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleClickTag = (data: string) => {
    setValue(data);
  };

  return (
    <InputWrapper label={props.label}>
      <textarea className={styles.textarea} value={value} onChange={handleInputValue} placeholder={props.placeholder} />
      {props.tags && !value && (
        <div className={styles.tags}>
          {props.tags.map((item) => (
            <Tag key={item.key} onClick={() => handleClickTag(item.value)}>
              {item.key}
            </Tag>
          ))}
        </div>
      )}
    </InputWrapper>
  );
}

type SelectorProps = {
  value: string;
  setValue: (data: string) => void;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  type?: string;
  placeholder?: string;
};

export function Selector(props: SelectorProps) {
  const [toggleOptions, setToggleOptions] = useState(false);
  const { options = [], value, setValue } = props;

  const handleSelectValue = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setValue(target.getAttribute('data-value') || '');
    setToggleOptions(false);
  };

  const handleOnBlur = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    if (target?.id !== 'options' && target?.id !== 'selector') {
      setToggleOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOnBlur);

    return () => {
      document.removeEventListener('click', handleOnBlur);
    };
  }, []);

  return (
    <InputWrapper label={props.label}>
      <input
        id='selector'
        type={props.type || 'text'}
        readOnly
        className={styles['input']}
        value={value}
        placeholder={props.placeholder}
        onFocus={() => setToggleOptions(true)}
      />
      {toggleOptions && (
        <div className={styles.options} id='options'>
          {options.map((item) => (
            <div
              key={item.value}
              onClick={handleSelectValue}
              className={classnames(styles.option, value === item.value ? styles['option-selected'] : '')}
              data-value={item.value}
            >
              {item.label}
              {value === item.value ? <img className={styles['right-icon']} alt='right' src={rightIcon} /> : null}
            </div>
          ))}
        </div>
      )}
    </InputWrapper>
  );
}
