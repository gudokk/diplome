import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Review {
  id: number;
  username: string;
  overall_comment: string;
  created_at: string;
  average_rating: number;
  resort_name: string;
  country: string;
  resort_id: number;
}

const ResortReviewsPreview = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/back/api/resorts/preview-reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch(console.error);
  }, []);

  return (
    <section className="border-t border-gray-300 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-lg font-bold uppercase ">
          Оценки курортов
        </h2>
        <div className="h-1 w-full bg-white mb-5 mt-5" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <strong className="text-lg text-gray-800">
                    {review.resort_name}
                  </strong>
                  <div className="text-yellow-500 text-sm">
                    {"★".repeat(Math.round(review.average_rating))}
                    {"☆".repeat(5 - Math.round(review.average_rating))}
                  </div>
                </div>
                <Link
                  to={`/resorts/${review.resort_id}/reviews`}
                  className="text-gray-700 text-sm mb-3 line-clamp-4 hover:underline block"
                >
                  {review.overall_comment}
                </Link>
                <p className="text-right text-gray-500 text-sm italic">
                  {review.country}
                </p>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <span className="text-sm">👤</span> {review.username}
                </span>
                <span>
                  {new Date(review.created_at).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResortReviewsPreview;
