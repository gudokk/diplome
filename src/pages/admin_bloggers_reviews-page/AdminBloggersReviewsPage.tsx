import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";

interface Review {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  status: string;
  images?: string[];
}

export default function BloggerReviewModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    const res = await fetch("/back/api/blogger-reviews/moderation", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    } else {
      toast.error("Ошибка загрузки обзоров");
    }
  };

  const handleModeration = async (id: number, action: "approve" | "reject") => {
    const res = await fetch(`/back/api/blogger-reviews/${id}/${action}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      toast.success(`Обзор ${action === "approve" ? "одобрен" : "отклонён"}`);
      fetchReviews(); // обновить список
    } else {
      toast.error("Ошибка при модерации");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-start p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Модерация обзоров от блогеров
            </h1>
            <Link
              to="/admin"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition text-center"
            >
              Назад к панели администратора
            </Link>
          </div>
          {reviews.length === 0 ? (
            <p className="text-gray-500">Нет обзоров на модерацию</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-md p-4 bg-gray-50 shadow-sm"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    Блогер: {review.author} ·{" "}
                    {new Date(review.created_at).toLocaleString()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      {review.title}
                    </h2>
                    <div
                      className="text-gray-700 mb-3"
                      dangerouslySetInnerHTML={{ __html: review.content }}
                    />
                  </div>
                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {review.images.map((src, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:8000${src}`}
                          alt={`Изображение ${idx + 1}`}
                          className="rounded shadow border border-gray-200"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => handleModeration(review.id, "approve")}
                      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                    >
                      ✅ Опубликовать
                    </button>
                    <button
                      onClick={() => handleModeration(review.id, "reject")}
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
