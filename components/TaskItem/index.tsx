import Link from "next/link";
import { Task } from "../../types";
import styles from "./styles.module.css";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineDelete, AiFillCheckCircle } from "react-icons/ai";

import { BsCircle } from "react-icons/bs";
interface Props {
  task: Task;
  setDelete: Function;
}

export default function TaskItem({ task, setDelete }: Props) {
  const handleRemove = () => {
    removeTask(task.id);
    toast.success("🗑️");
    setDelete((prevState: boolean) => !prevState);
  };
  return (
    <div className={styles.item}>
      <div className={styles.options}>
        {task.done ? (
          <AiFillCheckCircle color="#5E60CE" />
        ) : (
          <BsCircle color="#4EA8DE" />
        )}
      </div>
      <Link
        href={`task/${task.id}`}
        className={task.done ? styles.titleCheck : ""}
      >
        {task.title}
      </Link>
      <div className={styles.options}>
        <AiOutlineDelete onClick={handleRemove} />
      </div>
      <Toaster />
    </div>
  );
}

export const removeTask = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};
