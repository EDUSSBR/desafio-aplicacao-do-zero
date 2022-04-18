import { LinkComponent } from '../LinkComponent';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.Container}>
      <LinkComponent href="/" className={styles.Content}>
        <img src="/logo.svg" alt="logo" />
      </LinkComponent>
    </header>
  );
}
