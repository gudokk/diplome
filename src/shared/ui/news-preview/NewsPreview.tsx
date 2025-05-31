import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const colors = [
  { border: "border-indigo-500", text: "text-indigo-500", bg: "bg-indigo-500" },
  { border: "border-purple-500", text: "text-purple-500", bg: "bg-purple-500" },
  { border: "border-blue-400", text: "text-blue-400", bg: "bg-blue-400" },
  { border: "border-yellow-400", text: "text-yellow-400", bg: "bg-yellow-400" },
  { border: "border-green-500", text: "text-green-500", bg: "bg-green-500" },
];

interface NewsItem {
  id: number;
  title: string;
  content: string;
  publication_date: string;
  image: string | null;
}

const NewsList = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("back/api/news")
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setNews(data);
          setLoading(false);
        }, 500); // Задержка 500 мс для плавного перехода
      })
      .catch((error) => {
        console.error("Ошибка загрузки новостей:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5">
      <Link
        className="mb-5 text-3xl font-extrabold leading-tight text-white"
        to="/news"
      >
        Все новости
      </Link>
      <div className="h-1 w-full bg-white mb-5" />

      <div className="w-full flex flex-wrap gap-10">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-full sm:w-[48%] animate-pulse">
                <div className="h-full p-5 bg-gray-100 border-2 border-gray-300 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4 mt-6 ml-auto"></div>
                </div>
              </div>
            ))
          : news.map((item, index) => {
              const color = colors[index % colors.length]; // циклично берем цвет
              return (
                <div key={index} className="w-full sm:w-[48%]">
                  <div className="relative h-full">
                    <span
                      className={`absolute top-0 left-0 w-full h-full mt-1 ml-1 ${color.bg} rounded-lg`}
                    ></span>
                    <div
                      className={`relative h-full p-5 bg-white border-2 ${color.border} rounded-lg`}
                    >
                      <div className="flex items-center -mt-1">
                        <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">
                          <Link to={`/news/${item.id}`}>{item.title}</Link>
                        </h3>
                      </div>
                      <p
                        className={`mt-3 mb-1 text-xs font-medium ${color.text} uppercase`}
                      >
                        ----------------------
                      </p>
                      {item.image && (
                        <img
                          src={`http://localhost:8000${item.image}`}
                          alt={item.title}
                          className="mb-4 rounded-lg w-full max-h-70 object-cover"
                        />
                      )}
                      <p className="mb-2 text-gray-600">
                        <ReactMarkdown>
                          {`${item.content.split(".")[0]}.`}
                        </ReactMarkdown>
                      </p>

                      <div className="text-right text-sm text-gray-500 mt-4">
                        {new Date(item.publication_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      <div className="h-1 w-full bg-white mb-5 mt-10" />
    </div>
  );
};

export default NewsList;
