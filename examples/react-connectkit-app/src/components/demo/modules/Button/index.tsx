import classnames from 'classnames';

import styles from './index.module.css';

type ButtonProps = {
  loading?: boolean;
  className?: string;
  [key: string]: any;
};

export default function Button(props: ButtonProps) {
  const { className, loading = false, ...rest } = props;

  return (
    <div
      className={classnames(
        styles.button,
        props.block === 'true' ? styles['block-button'] : '',
        className,
        loading ? styles['disable-btn'] : ''
      )}
      {...rest}
    >
      {loading ? <div className={styles.loading}></div> : null}
      {props.children}
    </div>
  );
}
