import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function BloggerReviewForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((file) => formData.append("images", file));

    const res = await fetch("/back/api/blogger-reviews", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (res.ok) {
      toast.success("Обзор отправлен на модерацию!");
      navigate("/blogger-overview");
    } else {
      const err = await res.json();
      toast.error(err.detail || "Ошибка при публикации обзора");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center mt-4 px-4">
        <div className="px-4 sm:px-0 w-full">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-auto p-8">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto p-4 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold text-blue-800">
                  Обзор курорта от блогера
                </h2>
                <Link to="/profile" className="text-blue-800 hover:underline">
                  ← Назад к профилю
                </Link>
              </div>

              <p className="text-gray-500">Введите заголовок</p>
              <input
                type="text"
                placeholder="Заголовок"
                className="w-full border bg-white text-black border-gray-300 p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <p className="text-gray-500">Введите текст обзора</p>
              <div className="text-black">
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(_, editor) => setContent(editor.getData())}
                />
              </div>

              <p className="text-gray-500">Добавьте изображения</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block mt-2"
              />

              {images.length > 0 && (
                <div className="mt-2 space-y-1">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                    >
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="ml-2 text-red-500 hover:text-red-700 text-lg"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900 transition"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
