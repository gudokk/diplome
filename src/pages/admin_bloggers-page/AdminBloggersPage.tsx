import { useEffect, useState } from "react";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";

interface BloggerRequest {
  id: number;
  username: string;
  email: string;
  comment: string;
  status: string;
  created_at: string;
}

const BloggerRequestsAdminPage = () => {
  const [requests, setRequests] = useState<BloggerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const res = await fetch("/back/api/blogger-requests", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setRequests(data);
    } else {
      alert("Ошибка загрузки заявок");
    }

    setLoading(false);
  };

  const handleAction = async (id: number, action: "approve" | "reject") => {
    const res = await fetch(`/back/api/blogger-requests/${id}/${action}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      fetchRequests();
    } else {
      alert("Ошибка обновления заявки");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p className="p-6">Загрузка...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-start p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Заявки на блогеров
            </h1>
            <Link
              to="/admin"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition text-center"
            >
              Назад к панели администратора
            </Link>
          </div>
          {requests.length === 0 ? (
            <p className="text-gray-600">Заявок нет</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-400">
                      {req.username} ({req.email})
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Отправлено:{" "}
                      {new Date(req.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {req.comment}
                    </p>
                    <p className="mt-2 text-gray-500 text-sm">
                      Статус:{" "}
                      <span
                        className={`${
                          req.status === "pending"
                            ? "text-yellow-600"
                            : req.status === "approve"
                            ? "text-green-600"
                            : "text-red-600"
                        } font-semibold`}
                      >
                        {req.status === "pending"
                          ? "Ожидает"
                          : req.status === "approve"
                          ? "Одобрено"
                          : "Отклонено"}
                      </span>
                    </p>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex gap-2 mt-2 sm:mt-0 sm:flex-col">
                      <button
                        onClick={() => handleAction(req.id, "approve")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Одобрить
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "reject")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Отклонить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BloggerRequestsAdminPage;
