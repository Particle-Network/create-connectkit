import styles from './index.module.css'

export default function Tag(props) {

  return (
    <div className={styles.tag}>
      {props.children}
    </div>
  )
}