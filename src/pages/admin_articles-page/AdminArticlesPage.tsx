import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  image: string | null;
}

const AdminArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/back/api/news/unpublished", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setArticles)
      .catch(() => navigate("/"));
  }, []);

  const handlePublish = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/back/api/news/publish/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/back/api/news/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setEditedTitle(article.title);
    setEditedContent(article.content);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || editingId === null) return;

    await fetch(`/back/api/articles/edit/${editingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editedTitle, content: editedContent }),
    });

    setArticles((prev) =>
      prev.map((a) =>
        a.id === editingId
          ? { ...a, title: editedTitle, content: editedContent }
          : a
      )
    );
    setEditingId(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-start p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Непубликованные статьи
            </h1>
            <Link
              to="/admin"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition text-center"
            >
              Назад к панели администратора
            </Link>
          </div>

          {articles.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              Нет неопубликованных статей
            </p>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="border p-4 rounded-md bg-gray-50 shadow-sm space-y-2 mb-4"
              >
                {editingId === article.id ? (
                  <>
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full bg-white text-gray-600 p-2 border rounded"
                    />
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full bg-white text-gray-600 p-2 border rounded"
                      rows={5}
                    />
                    <button
                      onClick={handleSave}
                      className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                    >
                      💾 Сохранить
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl text-gray-900 font-semibold">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Автор: {article.author}
                    </p>
                    <p className="text-sm text-gray-500">{article.date}</p>
                    {article.image && (
                      <img
                        src={`http://localhost:8000${article.image}`}
                        alt="preview"
                        className="w-full max-h-64 object-cover rounded"
                      />
                    )}
                    <p
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  </>
                )}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => handlePublish(article.id)}
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                  >
                    ✅ Опубликовать
                  </button>
                  <button
                    onClick={() => handleEdit(article)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    ✏️ Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    🗑 Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminArticlesPage;
