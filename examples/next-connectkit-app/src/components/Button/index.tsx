import classnames from 'classnames'

import styles from './index.module.css'

type ButtonProps = {
  className?: string;
  [key: string]: any
}

export default function Button(props: ButtonProps) {
  const { className, ...rest } = props;

  return (
    <div className={classnames(styles.button, props.block ? styles['block-button'] : '', className)} {...rest}>
      {props.children}
    </div>
  )
}