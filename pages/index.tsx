/* eslint-disable react-hooks/exhaustive-deps */
import { useState, FormEvent, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import LanguageSelector from "../components/LanguageSelector";
import { TaskPage } from "../types";
import Paginator from "../components/Paginator";
import { AiOutlineSearch } from "react-icons/ai";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";

interface Props {
  text: any;
}

const Home: NextPage<Props> = ({ text }: Props) => {
  const [tasks, setTasks] = useState<TaskPage | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTask, setDeleteTask] = useState(false);

  const [totalPages, setTotalPages] = useState<number>(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchDataResult = await searchData(page, query);
    setTasks(searchDataResult);
  };

  useEffect(() => {
    searchData(page, "").then((data) => {
      if (!data) return;
      setTasks(data);
    });
  }, [page, deleteTask]);

  useEffect(() => {
    if (tasks) {
      setTotalPages(Math.ceil(tasks.totals / tasks.per_page));
    }
  }, [tasks]);

  return (
    <div className={styles.container}>
      <LanguageSelector />

      <Head>
        <title>todo list app</title>
        <meta name="description" content="todo list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.menu}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={text.forms.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">
              <AiOutlineSearch />
            </button>
          </form>
        </section>
        <Paginator page={tasks} text={text} setDelete={setDeleteTask} />
        <div className={styles.footer}>
          <p>
            <span>
              {text.paginate.page}: {page}/{totalPages}
            </span>
            <span>
              {text.paginate.perPage} {tasks?.per_page}
            </span>
          </p>
          {page != 1 && <GrCaretPrevious onClick={() => setPage(page - 1)} />}
          {page < totalPages && (
            <GrCaretNext onClick={() => setPage(page + 1)} />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  locale,
}): Promise<{ props: Props }> => {
  const response = await import(`../lang/${locale}.json`);
  return {
    props: {
      text: response.default,
    },
  };
};

async function searchData(
  page: number,
  query: string
): Promise<TaskPage | null> {
  try {
    const response = await fetch(
      `http://localhost:8000/tasks?page=${page}&per_page=15&query=${query}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default Home;
