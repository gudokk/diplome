import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";

interface Review {
  id: number;
  username: string;
  stay_month: string;
  stay_year: number;
  rating_skiing: number;
  comment_skiing: string;
  rating_lifts: number;
  comment_lifts: string;
  rating_prices: number;
  comment_prices: string;
  rating_snow_weather: number;
  comment_snow_weather: string;
  rating_accommodation: number;
  comment_accommodation: string;
  rating_people: number;
  comment_people: string;
  rating_apres_ski: number;
  comment_apres_ski: string;
  overall_comment: string;
  created_at: string;
  average_rating: number;
}
const ratingLabels: { [key: string]: string } = {
  rating_skiing: "Катание",
  rating_lifts: "Подъемники",
  rating_prices: "Цены",
  rating_snow_weather: "Снег и погода",
  rating_accommodation: "Жилье",
  rating_people: "Публика",
  rating_apres_ski: "Досуг",
};

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
            <svg
                key={`full-${i}`}
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448 1.287 3.956c.3.922-.755 1.688-1.539 1.118L10 13.348l-3.374 2.868c-.783.57-1.838-.196-1.539-1.118l1.287-3.956-3.37-2.448c-.783-.57-.38-1.81.588-1.81h4.162l1.286-3.957z" />
            </svg>
        ))}

        {hasHalfStar && (
            <svg
                key="half"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-orange-500"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
              <defs>
                <linearGradient id="half-grad">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="lightgray" />
                </linearGradient>
              </defs>
              <path
                  fill="url(#half-grad)"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448 1.287 3.956c.3.922-.755 1.688-1.539 1.118L10 13.348l-3.374 2.868c-.783.57-1.838-.196-1.539-1.118l1.287-3.956-3.37-2.448c-.783-.57-.38-1.81.588-1.81h4.162l1.286-3.957z"
              />
            </svg>
        )}

        {Array.from({ length: emptyStars }).map((_, i) => (
            <svg
                key={`empty-${i}`}
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448 1.287 3.956c.3.922-.755 1.688-1.539 1.118L10 13.348l-3.374 2.868c-.783.57-1.838-.196-1.539-1.118l1.287-3.956-3.37-2.448c-.783-.57-.38-1.81.588-1.81h4.162l1.286-3.957z" />
            </svg>
        ))}
      </div>
  );
};


const ReviewsList = () => {
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Проверка токена
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // true если токен есть

    if (!id) return;

    fetch(`/back/api/resorts/${id}/reviews`)
      .then((res) => res.json())
      .then((data: Review[]) => {
        setReviews(data);

        // Средние оценки по категориям
        const sum = {
          rating_skiing: 0,
          rating_lifts: 0,
          rating_prices: 0,
          rating_snow_weather: 0,
          rating_accommodation: 0,
          rating_people: 0,
          rating_apres_ski: 0,
        };

        data.forEach((r) => {
          sum.rating_skiing += r.rating_skiing;
          sum.rating_lifts += r.rating_lifts;
          sum.rating_prices += r.rating_prices;
          sum.rating_snow_weather += r.rating_snow_weather;
          sum.rating_accommodation += r.rating_accommodation;
          sum.rating_people += r.rating_people;
          sum.rating_apres_ski += r.rating_apres_ski;
        });

        const count = data.length || 1;
        setAverage({
          rating_skiing: +(sum.rating_skiing / count).toFixed(1),
          rating_lifts: +(sum.rating_lifts / count).toFixed(1),
          rating_prices: +(sum.rating_prices / count).toFixed(1),
          rating_snow_weather: +(sum.rating_snow_weather / count).toFixed(1),
          rating_accommodation: +(sum.rating_accommodation / count).toFixed(1),
          rating_people: +(sum.rating_people / count).toFixed(1),
          rating_apres_ski: +(sum.rating_apres_ski / count).toFixed(1),
        });
      });
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header></Header>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 gap-4 mb-5 p-5 bg-[#d9dde9]">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Общий рейтинг
            </h2>
            <div className="flex justify-right gap-4">
              {isAuthenticated && (
              <Link
                to={`/resorts/${id}/review-form`}
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
              >
                Написать отзыв
              </Link>
              )}
              {id && (
                <Link
                  to={`/resorts/${id}`}
                  className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
                >
                  Назад к курорту
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ">
            {Object.entries(average).map(([key, value]) => (
                <div
                    key={key}
                    className="text-gray-900 flex justify-between items-center border gap-10 p-4 rounded-md bg-gray-50"
                >
                  <span className="font-medium">{ratingLabels[key] || key}</span>
                  <div className="flex items-center gap-2">
                    <StarRating rating={value} />
                    <span className="text-gray-900">({value})</span>
                  </div>
                </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-5 p-5 bg-[#d9dde9]">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Отзывы о курорте
          </h2>

          {reviews.map((review) => (
            <div
              key={review.id}
              className="border p-6 mb-6 rounded-md shadow bg-white"
            >
              <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                <span className="font-semibold">{review.username}</span>
                <span>
                  {new Date(review.created_at).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-sm text-gray-700 italic mb-2">
                Время пребывания: {review.stay_month} {review.stay_year}
              </div>
              {/* <div className="text-lg text-black mb-2 font-semibold">
                {review.overall_comment}
              </div> */}

              <div className="text-lg text-black mb-2 font-semibold whitespace-pre-wrap">
                {expandedReviewId === review.id
                  ? review.overall_comment
                  : review.overall_comment.length > 200
                  ? `${review.overall_comment.slice(0, 200)}...`
                  : review.overall_comment}
              </div>

              {review.overall_comment.length > 0 && (
                <button
                  onClick={() =>
                    setExpandedReviewId((prevId) =>
                      prevId === review.id ? null : review.id
                    )
                  }
                  className="text-sm text-blue-600 hover:underline mb-4"
                >
                  {expandedReviewId === review.id
                    ? "Скрыть подробности"
                    : "Читать полностью"}
                </button>
              )}

              {expandedReviewId === review.id && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
                  {[
                    ["Катание", review.comment_skiing, review.rating_skiing],
                    ["Подъемники", review.comment_lifts, review.rating_lifts],
                    ["Цены", review.comment_prices, review.rating_prices],
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
                    ["Публика", review.comment_people, review.rating_people],
                    [
                      "Досуг",
                      review.comment_apres_ski,
                      review.rating_apres_ski,
                    ],
                  ].map(([label, comment, rating], i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded">
                      <div className="font-bold">{label}</div>
                      <div className="mt-1">{comment}</div>
                      <div className="mt-2">
                        <StarRating rating={Number(rating)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ReviewsList;
