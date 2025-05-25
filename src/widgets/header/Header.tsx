import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
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
            headers: {Authorization: `Bearer ${token}`},
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
            <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Link to="/" className="shrink-0">
                        <img src={SiteIcon} className="h-12 w-12" alt="site icon"/>
                    </Link>
                    <div className="flex flex-col leading-tight">
                        <div className="text-xl sm:text-2xl text-gray-900 font-bold">PowderPeak</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                            горнолыжный портал
                        </div>
                    </div>
                </div>

                {/* Бургер-кнопка */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-gray-700 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

                {/* Навигация */}
                <div
                    className={`absolute top-16 left-0 w-full md:static md:w-auto md:flex items-center z-40 overflow-hidden transition-all duration-500 md:overflow-visible`}
                    style={{
                        maxHeight: menuOpen ? `${menuHeight + 40}px` : "0px",
                        opacity: menuOpen ? 1 : 0,
                    }}
                >
                    <div
                        ref={menuRef}
                        className="bg-white md:bg-transparent flex flex-col md:flex-row md:items-center gap-6 text-sm p-4 md:p-0 border-t md:border-none"
                    >
                        <Link to="/news" className="flex items-center text-gray-600 hover:text-blue-500">
                            <img src={NewsPage} className="w-5 h-5 mr-2" alt="news"/>
                            Статьи
                        </Link>
                        <Link to="/resorts" className="flex items-center text-gray-600 hover:text-blue-500">
                            <img src={ResortsPage} className="w-5 h-5 mr-2" alt="resorts"/>
                            Курорты
                        </Link>
                        <Link to="/blogers_reviews" className="flex items-center text-gray-600 hover:text-blue-500">
                            <img src={BlogersReviewPage} className="w-5 h-5 mr-2" alt="blogers"/>
                            Обзоры блогеров
                        </Link>

                        {/* 🔽 Новый блок "Профиль" в бургер-меню только на мобильных */}
                        <Link
                            to={isAdmin ? "/admin" : "/profile"}
                            className="md:hidden text-gray-600 hover:text-blue-500"
                        >
                            Перейти в профиль
                        </Link>

                        {/* Блок "Приветствие" и кнопка выйти (универсальные) */}
                        {username ? (
                            <div className="flex flex-col md:items-end text-sm text-gray-700">
                                {isAdmin && (
                                    <span className="text-xs text-red-600 font-semibold uppercase">
          Панель администратора
        </span>
                                )}
                                <span>
        Привет, <span className="font-semibold">{username}</span>!
      </span>
                                <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/profile"
                                className="hidden md:flex flex-col items-center text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24"
                                    strokeWidth="1" stroke="currentColor"
                                    className="w-8 h-8"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
