import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";

const ArticleCreatePage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image) formData.append("image", image);
        formData.append("tags", JSON.stringify(tags));
        console.log("tags field:", formData.get("tags"));


        const response = await fetch("/back/api/news/create", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            alert("Новость отправлена на модерацию");
            navigate("/profile");
        } else {
            alert("Ошибка при создании статьи");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handleAddTag = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center mt-5">
                <div className="px-4 sm:px-0 w-full">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-md max-w-xl w-full space-y-4"
                >
                    <h2 className="text-2xl font-bold text-black mb-4">Создание новости</h2>

                    <input
                        type="text"
                        placeholder="Заголовок"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />

                    <textarea
                        placeholder="Текст новости"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        required
                        className="w-full p-2 border rounded"
                    />

                    <div>
                        <label className="font-semibold">Теги</label>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Добавить тег"
                                className="flex-grow p-2 border rounded"
                            />
                            <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800">
                                +
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <span key={tag} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="font-semibold">Изображение</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                        {image && (
                            <div className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm text-gray-800 mt-2">
                                <span className="truncate">{image.name}</span>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="text-red-600 hover:underline text-xs ml-4"
                                >
                                    Удалить
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
                    >
                        Отправить
                    </button>
                </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ArticleCreatePage;
