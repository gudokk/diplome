import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import SiteIcon from "../../assets/site-main-icon.png";
import PersonalAccount from "../../assets/personal-account.png";
import NewsPage from "../../assets/news-page.png";
import ResortsPage from "../../assets/resort-page.png";

export const Header = () => {
  return (
    <header className="bg-white">
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
                  <img src={ResortsPage} width="30" height="30" alt="resorts" />
                  <span>Курорты</span>
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/careers"
                >
                  Careers
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/history"
                >
                  History
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/services"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/projects"
                >
                  Projects
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/blog"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className="block rounded-md px-4 py-1.5 sm:px-5 sm:py-2.5 text-sm font-medium text-white"
                to="/profile"
              >
                <img
                  src={PersonalAccount}
                  width="40"
                  height="40"
                  alt="account"
                />
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
