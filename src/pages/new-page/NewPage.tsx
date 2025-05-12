import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import styles from "./ui/NewPage.module.css";
import ReactMarkdown from "react-markdown";

const NewPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/back/api/newsPage/${id}`)
      .then((res) => res.json())
      .then(setNews)
      .catch((err) => console.error("Ошибка загрузки статьи:", err));
  }, [id]);

  if (!news) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className={styles["new-page"]}>
      <Header></Header>
      <div className=" min-h-screen flex items-center justify-center p-4">
        <div className="bg-white  border rounded-lg shadow-sm max-w-6xl w-full overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-sm min-w-0">
                  <h1 className="text-3xl font-bold mb-4 text-black">
                    {news.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-2 mb-4 ">
                    {news.tags?.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-s mb-4  text-gray-500 truncate">
                    Автор: {news.author}{" "}
                    {new Date(news.publication_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-3 -mx-4 sm:mx-0 sm:rounded-lg overflow-hidden">
              {news.image && (
                <img
                  src={`http://localhost:8000${news.image}`}
                  alt={news.title}
                  className="max-w-2xl mb-4 rounded-lg w-full max-h-70 object-cover mx-auto"
                />
              )}
              <div className="text-sm text-gray-600 mb-3 break-words">
                <div className="prose prose-sm max-w-5xl mx-auto mt-7 px-4">
                  <ReactMarkdown>{news.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPage;
