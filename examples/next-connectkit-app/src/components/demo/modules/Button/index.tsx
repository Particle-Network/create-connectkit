import classnames from 'classnames';

import styles from './index.module.css';

type ButtonProps = {
  loading?: boolean;
  className?: string;
  [key: string]: any;
};

export default function Button(props: ButtonProps) {
  const { className, loading = false, block, children, ...rest } = props;

  return (
    <div
      className={classnames(
        styles.button,
        block ? styles['block-button'] : '',
        className,
        loading ? styles['disable-btn'] : ''
      )}
      {...rest}
    >
      {loading ? <div className={styles.loading}></div> : null}
      {children}
    </div>
  );
}
