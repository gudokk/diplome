import styles from "./ui/MainPage.module.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import NewsList from "../../shared/ui/news-preview/NewsPreview.tsx";

function MainPage() {
  return (
    <div className={styles["main-page"]}>
      <div className={styles["main-page__header"]}>
        <Header></Header>
      </div>
      <NewsList></NewsList>
      <div className="h-1 max-w-6xl bg-white mb-5 mx-auto " />
      <Footer></Footer>
    </div>
  );
}

export default MainPage;
