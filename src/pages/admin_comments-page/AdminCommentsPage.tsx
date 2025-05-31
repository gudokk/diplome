import { useEffect, useState } from "react";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";

interface Comment {
  id: number;
  text: string;
  date: string;
  author: string;
  article_title: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingComments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/back/api/admin/comments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setComments(data);
    setLoading(false);
  };

  const approveComment = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`/back/api/admin/comments/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteComment = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`/back/api/admin/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-start p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Ожидающие комментарии
            </h1>
            <Link
              to="/admin"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition text-center"
            >
              Назад к панели администратора
            </Link>
          </div>
          {loading ? (
            <p>Загрузка...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-600">Нет комментариев на модерации</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-md p-4 bg-gray-50 shadow-sm"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    {c.author} · {new Date(c.date).toLocaleString()}
                  </div>
                  <div className="text-sm mb-2 text-gray-800">
                    <span className="font-semibold">К статье:</span>{" "}
                    {c.article_title}
                  </div>
                  <div
                    className="prose prose-sm text-gray-900 mb-3"
                    dangerouslySetInnerHTML={{ __html: c.text }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveComment(c.id)}
                      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                    >
                      ✅ Опубликовать
                    </button>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      🗑 Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
