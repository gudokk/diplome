import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("/back/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (!data.is_admin) navigate("/");
        else {
          setIsAdmin(true);
          setUsername(data.username);
        }
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  if (isAdmin === null) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="px-4 sm:px-0 w-full mt-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto w-full p-8 transition-all duration-300 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Админ-панель
            </h1>
            <p className="text-gray-700 mb-4">
              Добро пожаловать,{" "}
              <span className="font-semibold">{username}</span>!
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => navigate("/admin/users")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
              >
                🔧 Управление пользователями
              </button>
              <button
                onClick={() => navigate("/admin/comments")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
              >
                💬 Модерация комментариев
              </button>

              <button
                onClick={() => navigate("/admin/resorts")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
              >
                🗂 Добавление курортов
              </button>
              <button
                onClick={() => navigate("/admin/blogger-reviews")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
              >
                💬 Модерация обзоров от блогеров
              </button>
              <button
                onClick={() => navigate("/admin/news")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
              >
                📢 Публикация новостей
              </button>
              <button
                onClick={() => navigate("/admin/reviews")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
              >
                📄 Модерация отзывов
              </button>
              <button
                onClick={() => navigate("/admin/blogger-requests")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
              >
                📢 Проверка блогеров
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
