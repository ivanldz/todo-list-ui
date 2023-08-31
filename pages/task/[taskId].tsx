import styles from "../../styles/Task.module.css";
import { Task } from "../../types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CiCircleRemove } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import { removeTask } from "../../components/TaskItem";

export default function Details() {
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [removeImage, setRemoveImage] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (taskId) {
      setData(taskId);
    }
  }, [taskId]);

  const setData = (taskId: string) => {
    getTask(taskId).then((data) => {
      if (!data) return;
      setTaskDetails(data);
      setImageUrl(`http://localhost:8000/images/${data.image_path}`);
      setDone(data.done);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!taskDetails) return;

    e.preventDefault();
    const { name, value } = e.target;

    setTaskDetails({
      ...taskDetails,
      [name]: value,
    });
  };

  const checkHandler = () => {
    setDone(!done);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskDetails) return;
    let imagePath: string;
    if (removeImage || selectedImage) {
      if (taskDetails.image_path) {
        await removeImageTask(taskDetails.image_path);
        taskDetails.image_path = "";
      }
    }

    if (selectedImage) {
      imagePath = await uploadImage(selectedImage);
      taskDetails.image_path = imagePath;
    }

    taskDetails.done = done;
    updateTask(taskDetails).then((data) => {
      setTaskDetails(data);
    });
  };

  const handleRemoveAttach = () => {
    setRemoveImage(true);
  };

  const handleDelete = async () => {
    await removeTask(taskId);
    router.push("/");
  };

  return (
    <div className={styles.details}>
      {taskDetails ? (
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={taskDetails.title}
              onChange={handleChange}
            />
          </label>
          <label>
            Body:
            <input
              type="text"
              name="body"
              value={taskDetails.body}
              onChange={handleChange}
            />
          </label>

          <label className={styles.checkbox}>
            Done:
            <input
              type="checkbox"
              name="done"
              checked={done}
              onChange={checkHandler}
            />
          </label>
          {!removeImage &&
          taskDetails.image_path &&
          taskDetails.image_path != "None" ? (
            <div className={styles.imageView}>
              Attached
              <CiCircleRemove
                onClick={handleRemoveAttach}
                className={styles.deleteImage}
                color="#ff0000"
              />
              <Link href={imageUrl}>
                <Image
                  src={imageUrl}
                  alt={taskDetails.title}
                  width={100}
                  height={100}
                  priority
                />
              </Link>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            />
          )}
          <label>
            Created At:
            <input
              type="text"
              name="created_at"
              value={taskDetails.created_at}
              disabled
            />
          </label>
          <button type="submit">Guardar cambios</button>
          <button type="button" onClick={() => setData(taskId)}>
            Cancelar
          </button>
          <br />
          <button type="button" onClick={handleDelete}>
            eliminar
          </button>
        </form>
      ) : (
        <p>... </p>
      )}
    </div>
  );
}

const getTask = async (taskId: string): Promise<Task | null> => {
  let data: Task | null = null;
  try {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
  }
  return data;
};

const updateTask = async (task: Task): Promise<Task> => {
  try {
    const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return task;
  }
};

const removeImageTask = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://localhost:8000/images?image_path=${imagePath}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};

const uploadImage = async (image: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("http://localhost:8000/images/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.image_path;
    } else {
      console.error("Failed to upload image");
      return "";
    }
  } catch (error) {
    console.error(error);
    return "";
  }
};
