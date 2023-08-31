import { TaskPage } from "../../types";
import TaskItem from "../TaskItem";
import { BiTaskX } from "react-icons/bi";
import styles from "./styles.module.css";
import Link from "next/link";

interface Props {
  page: TaskPage | null;
  text: any;
  setDelete: Function;
}
export default function Paginator({ page, text, setDelete }: Props) {
  return (
    <section className={styles.container}>
      <div>
        <h3>
          <Link href={"/task/create"}>{text.buttons.create}</Link>
        </h3>
      </div>
      <ul className={styles.list}>
        {!page?.records.length ? (
          <div className={styles.noContent}>
            <h3>{text.noContent.title}</h3>
            <BiTaskX />
            <p>{text.noContent.body}</p>
          </div>
        ) : (
          page?.records.map((t) => {
            return (
              <li key={t.id}>
                <TaskItem task={t} setDelete={setDelete} />
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
