import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../../widgets/header/Header";
import ReactMarkdown from "react-markdown";
import City from "../../assets/city.svg";
import NearCity from "../../assets/near_cities.svg";
import ResortsSlider from "../../shared/ui/resorts-slider/ResortsSlider";
import ResortCard from "../../shared/ui/resort-card/ResortCard";
import styles from "./ui/ResortPage.module.css";

const ResortPage = () => {
  const { id } = useParams();
  const [resort, setResort] = useState<any>(null);
  const [images, setImages] = useState<{ id: number; image: string }[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/back/api/resorts/${id}`)
      .then((res) => res.json())
      .then(setResort)
      .catch((err) => console.error("Ошибка загрузки курорта:", err));

    fetch(`/back/api/resort-images/${id}`)
      .then((res) => res.json())
      .then(setImages)
      .catch((err) => console.error("Ошибка загрузки изображений:", err));
  }, [id]);

  if (!resort) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className={styles["resort-page"]}>
      <Header />
      <div className=" min-h-screen flex items-center justify-center p-4">
        <div className="bg-white  border rounded-lg shadow-sm max-w-5xl w-full overflow-hidden">
          <h1 className="text-5xl font-bold mb-4 mt-6 text-black text-center">
            {resort.name}
          </h1>
          <ResortsSlider images={images} />
          <ResortCard></ResortCard>
          <div className="h-1 max-w-4xl mt-10 bg-black mb-10 mx-auto " />
          <div className="bg-[#d9dde9] shadow overflow-hidden rounded-md max-w-4xl mx-auto mt-10 flex flex-wrap justify-center gap-4 p-4">
            <p className="text-black">
              <ReactMarkdown>{`${resort.information}`}</ReactMarkdown>
            </p>
          </div>
          <div className="text-black max-w-4xl text-xl sm:text-2xl md:text-3xl mx-auto font-bold mb-4 mt-6 ">
            Как добраться
          </div>
          <p className="text-black max-w-4xl mx-auto ">
            <ReactMarkdown>{`${resort.how_to_get_there}`}</ReactMarkdown>
          </p>
          <div className="bg-[#d9dde9] shadow overflow-hidden rounded-md max-w-4xl mx-auto mt-10 mb-10 flex flex-col gap-4 p-4">
            <p className="text-black text-xl sm:text-xl md:text-xl font-bold">
              Родственные зоны катания
            </p>
            <p className="text-black flex flex-wrap gap-3">
              <img
                src={City}
                alt="Родственные зоны катания"
                className="w-6 h-6"
              />
              <ReactMarkdown>{`${resort.related_ski_areas}`}</ReactMarkdown>
            </p>
          </div>
          <div className="bg-[#d9dde9] shadow overflow-hidden rounded-md max-w-4xl mx-auto mt-10 mb-10 flex flex-col gap-4 p-4">
            <p className="text-black text-xl sm:text-xl md:text-xl font-bold">
              Города рядом
            </p>
            <p className="text-black flex flex-wrap gap-3">
              <img src={NearCity} alt="орода рядом" className="w-6 h-6" />
              <ReactMarkdown>{`${resort.nearby_cities}`}</ReactMarkdown>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortPage;
