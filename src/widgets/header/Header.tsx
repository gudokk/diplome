import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import SiteIcon from "../../assets/site-main-icon.png";
import NewsPage from "../../assets/news-page.png";
import ResortsPage from "../../assets/resort-page.png";
import BlogersReviewPage from "../../assets/blogers-page.svg";
import { useEffect, useState } from "react";

export const Header = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("/back/api/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => {
                setUsername(data.username);
                setIsAdmin(data.is_admin === true);
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
        <header className="bg-white">
            <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link className="block" to="/">
                    <img src={SiteIcon} width="60" height="60" alt="site icon" />
                </Link>
                <div className={styles["header__title"]}>
                    <div className={styles["header__title-text"]}>PowderPeak</div>
                    <div className={styles["header__title-description"]}>
                        горнолыжный портал
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-end md:justify-between">
                    <nav aria-label="Global" className="hidden md:block">
                        <ul className="flex items-center gap-6 text-sm">
                            <li><div className="w-px h-10 bg-gray-400 mx-1"></div></li>
                            <li>
                                <Link to="/news" className="flex flex-col items-center text-gray-500 hover:text-gray-500/75">
                                    <img src={NewsPage} width="40" height="40" alt="news" />
                                    <span>Статьи</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/resorts" className="flex flex-col items-center text-gray-500 hover:text-gray-500/75">
                                    <img src={ResortsPage} width="30" height="30" alt="resorts" />
                                    <span>Курорты</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/blogers_reviews" className="flex flex-col items-center text-gray-500 hover:text-gray-500/75">
                                    <img src={BlogersReviewPage} width="22" height="22" alt="BlogersReview" />
                                    <span>Обзоры блогеров</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4 ml-4">
                        {username && (
                            <div className="hidden sm:flex flex-col items-end text-sm text-gray-700">
                                {isAdmin && (
                                    <span className="text-xs text-red-600 font-semibold uppercase">
                    Панель администратора
                  </span>
                                )}
                                <span className="text-sm">
                  Привет, <span className="font-semibold">{username}</span>!
                </span>
                                <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">
                                    Выйти
                                </button>
                            </div>
                        )}
                        <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-gray-500/75">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1" stroke="currentColor" className="size-10 text-black">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
