import styles from "./ui/MainPage.module.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import NewsList from "../../shared/ui/news-preview/NewsPreview.tsx";
import ResortsQuickSearch from "../../shared/ui/resorts-quick-search/ResortsQuickSearch";

function MainPage() {
  return (
    <div className={styles["main-page"]}>
      <div className={styles["main-page__header"]}>
        <Header></Header>
      </div>
      <NewsList></NewsList>
        <section className="sm:py-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
      <ResortsQuickSearch></ResortsQuickSearch>
            </div>
            </section>
      <Footer></Footer>
    </div>
  );
}

export default MainPage;
