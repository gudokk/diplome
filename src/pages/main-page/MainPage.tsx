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
      <div className="h-1 max-w-6xl bg-white mb-10 mt-10 mx-auto " />
      <ResortsQuickSearch></ResortsQuickSearch>
      <Footer></Footer>
    </div>
  );
}

export default MainPage;
