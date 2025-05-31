import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";

interface PendingReview {
  id: number;
  username: string;
  resort: string;
  stay_month: string;
  stay_year: number;
  overall_comment: string;
  comment_skiing: string;
  rating_skiing: number;
  comment_lifts: string;
  rating_lifts: number;
  comment_prices: string;
  rating_prices: number;
  comment_snow_weather: string;
  rating_snow_weather: number;
  comment_accommodation: string;
  rating_accommodation: number;
  comment_people: string;
  rating_people: number;
  comment_apres_ski: string;
  rating_apres_ski: number;
}

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    const res = await fetch("/back/api/reviews/pending", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    } else {
      alert("Ошибка загрузки отзывов");
    }

    setLoading(false);
  };

  const handleAction = async (id: number, action: "approve" | "reject") => {
    const res = await fetch(`/back/api/reviews/${id}/${action}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      fetchReviews();
    } else {
      alert("Ошибка при обновлении отзыва");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedReviewId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-start p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Модерация отзывов
            </h1>
            <Link
              to="/admin"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition text-center"
            >
              Назад к панели администратора
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">Загрузка...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600">Нет отзывов на модерации</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border rounded-lg p-5 shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-full pr-4">
                      <h2 className="text-lg font-semibold text-blue-800">
                        {review.username}
                      </h2>
                      <p className="text-sm text-gray-500 mb-1">
                        Курорт: {review.resort}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Время пребывания: {review.stay_month} {review.stay_year}
                      </p>

                      <p className="text-gray-700 whitespace-pre-wrap mb-2">
                        {expandedReviewId === review.id
                          ? review.overall_comment
                          : review.overall_comment.length > 200
                          ? `${review.overall_comment.slice(0, 200)}...`
                          : review.overall_comment}
                      </p>

                      <button
                        onClick={() => toggleExpand(review.id)}
                        className="text-sm text-blue-600 hover:underline mb-4"
                      >
                        {expandedReviewId === review.id
                          ? "Скрыть подробности"
                          : "Читать полностью"}
                      </button>

                      {expandedReviewId === review.id && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-gray-800">
                          {[
                            [
                              "Катание",
                              review.comment_skiing,
                              review.rating_skiing,
                            ],
                            [
                              "Подъемники",
                              review.comment_lifts,
                              review.rating_lifts,
                            ],
                            [
                              "Цены",
                              review.comment_prices,
                              review.rating_prices,
                            ],
                            [
                              "Снег и погода",
                              review.comment_snow_weather,
                              review.rating_snow_weather,
                            ],
                            [
                              "Жилье",
                              review.comment_accommodation,
                              review.rating_accommodation,
                            ],
                            [
                              "Публика",
                              review.comment_people,
                              review.rating_people,
                            ],
                            [
                              "Досуг",
                              review.comment_apres_ski,
                              review.rating_apres_ski,
                            ],
                          ].map(([label, comment, rating], i) => (
                            <div
                              key={i}
                              className="bg-gray-50 p-4 rounded border"
                            >
                              <div className="font-semibold text-gray-700">
                                {label}
                              </div>
                              <div className="text-gray-600 mt-1 whitespace-pre-wrap">
                                {comment}
                              </div>
                              <div className="text-yellow-600 mt-2">
                                Оценка: {rating} / 5
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAction(review.id, "approve")}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      >
                        Одобрить
                      </button>
                      <button
                        onClick={() => handleAction(review.id, "reject")}
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                      >
                        Отклонить
                      </button>
                    </div>
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
};

export default AdminReviewsPage;
