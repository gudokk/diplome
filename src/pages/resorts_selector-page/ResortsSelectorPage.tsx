import styles from "./ui/ResortsSelectorPage.module.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import ResortsSelector from "../../shared/ui/resorts-list_selector/ResortsListSelector";

const ResortsSelectorPage = () => {
  return (
    <div className={styles["news-page"]}>
      <Header></Header>
      <div className=" min-h-screen flex items-center justify-center p-4">
        <div className="bg-white  border rounded-lg shadow-sm max-w-5xl w-full overflow-hidden">
          <h1 className="text-4xl font-bold text-left text-black mt-2 p-10">
            Подбор курортов
          </h1>
          <div className="h-1 max-w-4xl bg-black mb-10 mx-auto " />
          <ResortsSelector />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ResortsSelectorPage;
