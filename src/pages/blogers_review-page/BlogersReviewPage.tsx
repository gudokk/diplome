import { useEffect, useState } from "react";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";

interface BloggerReview {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  images?: string[];
}

const BlogersReviewPage = () => {
  const [reviews, setReviews] = useState<BloggerReview[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await fetch("/back/api/blogger-reviews");
      const data = await res.json();

      const reviewsWithImages = await Promise.all(
        data.map(async (review: BloggerReview) => {
          const resImg = await fetch(
            `/back/api/blogger-reviews/${review.id}/images`
          );
          const imagePaths = await resImg.json();
          return { ...review, images: imagePaths };
        })
      );

      setReviews(reviewsWithImages);
    };

    loadReviews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-5 text-3xl font-extrabold leading-tight text-white">
            Обзоры от блогеров
          </h1>
          <div className="h-1 w-full bg-white mb-5" />

          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">Обзоров пока нет.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white shadow rounded-lg p-6 border border-gray-200"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    Автор: {review.author} ·{" "}
                    {new Date(review.created_at).toLocaleString()}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {review.title}
                  </h2>
                  <div
                    className=" text-gray-700"
                    dangerouslySetInnerHTML={{ __html: review.content }}
                  />

                  {review.images && review.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
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

export default BlogersReviewPage;
