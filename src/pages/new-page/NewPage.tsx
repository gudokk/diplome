import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import {Footer} from "../../widgets/footer/Footer";
import styles from "./ui/NewPage.module.css";
import ReactMarkdown from "react-markdown";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const NewPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");


  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    fetch(`/back/api/newsPage/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setNews(data);
          setRating(data.rating ?? 0);
        })
        .catch((err) => console.error("Ошибка загрузки статьи:", err));
  }, [id]);

  fetch(`/back/api/comments/${id}`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error("Ошибка загрузки комментариев:", err));


  const handleVote = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`/back/api/newsPage/${id}/vote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRating((prev) => prev + 1);
        setHasVoted(true);
      } else {
        const err = await response.json();
        if (err.detail === "Вы уже голосовали за эту статью") {
          setHasVoted(true); // Просто блокируем кнопку
        } else {
          console.error("Ошибка голосования:", err.detail);
        }
      }
    } catch (err) {
      console.error("Ошибка при голосовании:", err);
    }
  };

  const handleSubmitComment = async () => {
    const token = localStorage.getItem("token");
    if (!token || !newComment.trim()) return;

    const formData = new FormData();
    formData.append("text", newComment);

    const res = await fetch(`/back/api/comments/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      const updated = await fetch(`/back/api/comments/${id}`).then((r) => r.json());
      setComments(updated);
      setNewComment("");
    }
  };



  if (!news) return <p className="text-center mt-10">Загрузка...</p>;

  const voteDisabled = hasVoted || !isAuthenticated;

  return (
      <div className={styles["new-page"]}>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-4 flex-col">
          <div className="bg-white border rounded-lg shadow-sm max-w-6xl w-full overflow-hidden">
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
                    <p className="text-s mb-4 text-gray-500 truncate">
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

              {/* Блок голосования */}
              <div className=" flex justify-left mt-6">
                <div className="flex rounded overflow-hidden shadow-md text-white font-bold text-sm">
                  <div className="bg-green-500 px-4 py-2">{`+${rating}`}</div>
                  <button
                      onClick={handleVote}
                      disabled={voteDisabled}
                      className={`px-4 py-2 bg-white text-gray-700 ${
                          voteDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                      }`}
                  >
                    ↑
                  </button>
                </div>
              </div>



            </div>
          </div>
          {isAuthenticated && (
              <div className="mt-10 max-w-5xl mx-auto">
                <h2 className="text-xl font-semibold mb-2">Оставить комментарий</h2>
                <CKEditor
                    editor={ClassicEditor}
                    data={newComment}
                    onChange={(_, editor) => setNewComment(editor.getData())}
                />
                <button
                    className="mt-3 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    onClick={handleSubmitComment}
                >
                  Отправить
                </button>
              </div>
          )}

          {comments.length > 0 && (
              <div className="mt-10 max-w-5xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Комментарии</h2>
                <div className="space-y-4">
                  {comments.map((c, i) => (
                      <div key={i} className="bg-gray-100 p-4 rounded">
                        <div className="text-sm text-gray-500 mb-1">
                          {c.author} · {new Date(c.date).toLocaleString()}
                        </div>
                        <div
                            className="prose prose-sm text-gray-800"
                            dangerouslySetInnerHTML={{ __html: c.text }}
                        />
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>

        <Footer />
      </div>
  );
};

export default NewPage;
