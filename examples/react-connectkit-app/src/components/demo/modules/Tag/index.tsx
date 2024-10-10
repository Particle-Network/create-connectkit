import styles from './index.module.css';

export default function Tag(props: { children: React.ReactNode; [key: string]: any }) {
  return (
    <div className={styles.tag} {...props}>
      {props.children}
    </div>
  );
}
