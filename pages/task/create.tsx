import styles from "../../styles/Task.module.css";
import { TaskCreate } from "../../types";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Create() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !body) {
      toast.error("Fields required");
      return;
    }

    const newTask: TaskCreate = {
      title: title,
      body: body,
    };

    if (selectedImage) {
      newTask.image_path = await uploadImage(selectedImage);
    }

    createTask(newTask).then(() => {
      router.push("/");
    });
  };

  return (
    <div className={styles.details}>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Body:
          <input
            type="text"
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
        />
        <button type="submit">Guardar cambios</button>
        <Link href={"/"}>Cancelar</Link>
      </form>
    </div>
  );
}

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

const createTask = async (task: TaskCreate): Promise<TaskCreate> => {
  try {
    const response = await fetch(`http://localhost:8000/tasks`, {
      method: "POST",
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
