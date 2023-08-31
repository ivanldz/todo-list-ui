import styles from "./styles.module.css";
import { ChangeEvent } from "react";
import { useRouter } from "next/router";

export default function LanguageSelector() {
  const router = useRouter();
  const changeLang = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(router.pathname, router.pathname, { locale: e.target.value });
  };

  return (
    <select
      className={styles.selector}
      onChange={changeLang}
      defaultValue={router.locale}
    >
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
  );
}
