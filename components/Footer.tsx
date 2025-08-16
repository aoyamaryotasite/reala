// components/Footer.tsx
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p>
          &copy; {new Date().getFullYear()} REALA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
