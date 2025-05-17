import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import SiteIcon from "../../assets/site-main-icon.png";
import NewsPage from "../../assets/news-page.png";
import ResortsPage from "../../assets/resort-page.png";
import BlogersReviewPage from "../../assets/blogers-page.svg";

export const Header = () => {
  return (
    <header className="bg-white ">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="block" to="/">
          <span className="sr-only">Home</span>
          <img src={SiteIcon} width="60" height="60" alt="site icon" />
        </Link>
        <div className={styles["header__title"]}>
          <div className={styles["header__title-text"]}>PowderPeak</div>
          <div className={styles["header__title-description"]}>
            горнолыжный портал
          </div>
        </div>
        <div className="flex h-60 flex-wrap gap-8">
          <div className="divider divider-horizontal"></div>
        </div>
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li className="hidden md:block">
                <div className="w-px h-10 bg-gray-400 mx-1"></div>
              </li>
              <li>
                <Link
                  className="flex flex-col items-center text-gray-500 transition hover:text-gray-500/75"
                  to="/news"
                >
                  <img src={NewsPage} width="40" height="40" alt="news" />
                  <span>Статьи</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex flex-col items-center text-gray-500 transition hover:text-gray-500/75"
                  to="/resorts"
                >
                  <img src={ResortsPage} width="30" height="30" alt="blogers" />
                  <span>Курорты</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex flex-col items-center text-gray-500 transition hover:text-gray-500/75"
                  to="/blogers_reviews"
                >
                  <img
                    src={BlogersReviewPage}
                    width="22"
                    height="22"
                    alt="BlogersReview"
                  />
                  <span>Обзоры блогеров</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className="flex flex-col items-center text-gray-500 transition hover:text-gray-500/75"
                to="/profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  className="size-10 text-black"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                {/* <span>Личный кабинет</span> */}
              </Link>
            </div>

            <button className="block rounded-sm bg-transparent p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
