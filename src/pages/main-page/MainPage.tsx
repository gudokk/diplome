import styles from "./ui/MainPage.module.css";
import { Header } from "../../widgets/header/Header";
import NewsList from "../../shared/ui/news-preview/NewsPreview.tsx";

function MainPage() {
  return (
    <div className={styles["main-page"]}>
      <div className={styles["main-page__header"]}>
        <Header></Header>
        <NewsList></NewsList>
      </div>
    </div>
  );
}

export default MainPage;
