import styles from "./ui/ResortsSelectorPage.module.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import ResortsSelector from "../../shared/ui/resorts-list_selector/ResortsListSelector";

const ResortsSelectorPage = () => {
    return (
        <div className={styles["news-page"]}>
            <Header />
            <main className="min-h-screen flex justify-center px-4 sm:px-8 py-6">
                <div className="bg-white border rounded-lg shadow-sm w-full max-w-6xl flex flex-col justify-start min-h-[1200px]">
                    <h1 className="text-2xl sm:text-4xl font-bold text-center text-black p-4 sm:p-5">
                        Подбор курортов
                    </h1>
                    <div className="h-1 bg-black w-full max-w-md mx-auto mb-4" />
                    <ResortsSelector />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ResortsSelectorPage;
