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
  author: string;
  image: string | null;
  tags: string[];
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("back/api/newsPage")
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setNews(data);
          setLoading(false);
        }, 500);
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
        Лента
      </Link>
      <div className="h-1 w-full bg-white mb-5" />
      {selectedTag && (
        <div className="mb-4">
          <span className="text-sm text-white-700 mr-2">
            Фильтр: #{selectedTag}
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className="text-sm text-bold text-gray-400 underline"
          >
            Сбросить фильтр
          </button>
        </div>
      )}

      <div className="w-full flex flex-wrap gap-10">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-full animate-pulse">
                <div className="h-full p-5 bg-gray-100 border-2 border-gray-300 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4 mt-6 ml-auto"></div>
                </div>
              </div>
            ))
          : news
              .filter((item) =>
                selectedTag ? item.tags.includes(selectedTag) : true
              )
              .map((item, index) => {
                const color = colors[index % colors.length];
                return (
                  <div key={index} className="w-full">
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
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tags?.map((tag, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedTag(tag)}
                              className={`text-xs px-2 py-1 rounded-full ${
                                selectedTag === tag
                                  ? "bg-blue-700 text-white"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
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
                            className="max-w-2xl mb-4 rounded-lg w-full max-h-70 object-cover mx-auto"
                          />
                        )}
                        <p className="mb-2 text-gray-600">
                          <ReactMarkdown>
                            {`${item.content.split(".")[0]}.`}
                          </ReactMarkdown>
                        </p>

                        <div className="text-left text-sm text-gray-500 mt-4">
                          {item.author}{" "}
                          {new Date(item.publication_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  );
};

export default News;
