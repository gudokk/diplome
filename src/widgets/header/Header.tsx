import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SiteIcon from "../../assets/site-main-icon.png";
import NewsPage from "../../assets/news-page.png";
import ResortsPage from "../../assets/resort-page.png";
import BlogersReviewPage from "../../assets/blogers-page.svg";

export const Header = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, [menuOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/back/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUsername(data.username);
        setIsAdmin(data.is_admin);
      })
      .catch(() => {
        setUsername(null);
        setIsAdmin(false);
        localStorage.removeItem("token");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Логотип и навигация вместе */}
        <div className="flex items-center gap-10">
          <Link to="/" className="shrink-0 flex items-center gap-3">
            <img src={SiteIcon} className="h-12 w-12" alt="site icon" />
            <div className="flex flex-col leading-tight">
              <div className="text-xl sm:text-2xl text-gray-900 font-bold">
                PowderPeak
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                горнолыжный портал
              </div>
            </div>
          </Link>
          <div className="h-10 border-l border-gray-500" />

          {/* Навигация — слева от экрана, вертикально */}
          <nav className="hidden md:flex gap-8">
            <Link
              to="/news"
              className="flex flex-col items-center text-gray-600 hover:text-blue-500"
            >
              <img src={NewsPage} className="w-9 h-7 mb-1" alt="news" />
              <span className="text-sm">Статьи</span>
            </Link>
            <Link
              to="/resorts"
              className="flex flex-col items-center text-gray-600 hover:text-blue-500"
            >
              <img src={ResortsPage} className="w-8 h-7 mb-1" alt="resorts" />
              <span className="text-sm">Курорты</span>
            </Link>
            <Link
              to="/blogers_reviews"
              className="flex flex-col items-center text-gray-600 hover:text-blue-500"
            >
              <img
                src={BlogersReviewPage}
                className="w-7 h-7 mb-1"
                alt="blogers"
              />
              <span className="text-sm">Обзоры блогеров</span>
            </Link>
          </nav>
        </div>

        {/* Бургер-кнопка для мобильной версии */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Профиль и выход */}
        {username ? (
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-700">
            <div className="flex flex-col text-right">
              {isAdmin && (
                <span className="text-xs text-red-600 font-semibold uppercase">
                  Панель администратора
                </span>
              )}
              <span>
                Привет, <span className="font-semibold">{username}</span>!
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:underline"
              >
                Выйти
              </button>
            </div>
            <Link
              to={isAdmin ? "/admin" : "/profile"}
              className="flex flex-col items-center text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <Link
            to="/profile"
            className="hidden md:flex flex-col items-center text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col gap-4 px-4 py-6 text-sm text-gray-700">
            <Link
              to="/news"
              className="flex items-center gap-2 hover:text-blue-500"
            >
              <img src={NewsPage} className="w-5 h-5" alt="news" />
              Статьи
            </Link>
            <Link
              to="/resorts"
              className="flex items-center gap-2 hover:text-blue-500"
            >
              <img src={ResortsPage} className="w-5 h-5" alt="resorts" />
              Курорты
            </Link>
            <Link
              to="/blogers_reviews"
              className="flex items-center gap-2 hover:text-blue-500"
            >
              <img src={BlogersReviewPage} className="w-5 h-5" alt="blogers" />
              Обзоры блогеров
            </Link>
            <Link
              to={isAdmin ? "/admin" : "/profile"}
              className="text-gray-600 hover:text-blue-500"
            >
              Перейти в профиль
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
