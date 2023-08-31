import styles from "./styles.module.css"

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}><span>to</span><span>do</span></h1>
      </header>
    </>
  );
}
