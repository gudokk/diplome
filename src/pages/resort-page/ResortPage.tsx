import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../../widgets/header/Header";
import ReactMarkdown from "react-markdown";
import City from "../../assets/city.svg";
import NearCity from "../../assets/near_cities.svg";
import ResortsSlider from "../../shared/ui/resorts-slider/ResortsSlider";
import ResortFeatures from "../../shared/ui/resort-features/ResortFeatures";
import ResortCard from "../../shared/ui/resort-card/ResortCard";
import styles from "./ui/ResortPage.module.css";

const ResortPage = () => {
  const { id } = useParams();
  const [resort, setResort] = useState<any>(null);
  const [images, setImages] = useState<{ id: number; image: string }[]>([]);
  const [feature, setFeatures] = useState<any>(null);

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

    fetch(`/back/api/resort-features/${id}`)
      .then((res) => res.json())
      .then(setFeatures)
      .catch((err) => console.error("Ошибка загрузки фичей курорта:", err));
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
          <ul className="bg-[#d9dde9] shadow overflow-hidden rounded-md max-w-4xl mx-auto mt-10 flex flex-wrap justify-center gap-4 p-4">
            <li className="flex items-center justify-center gap-2 bg-white text-black p-4 rounded-md w-full sm:w-[150px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
              <Link to={`/resorts/${id}/hotels`} className="font-medium ">
                <p className="text-black">Отели</p>
              </Link>
            </li>
            <li className="flex items-center justify-center gap-2 bg-white text-black p-4 rounded-md w-full sm:w-[150px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>

              <Link to={`/resorts/${id}/reviews`} className="font-medium ">
                <p className="text-black">Отзывы</p>
              </Link>
            </li>
          </ul>

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
          <div className="h-1 max-w-4xl mt-10 bg-black mb-10 mx-auto " />
          <div className="text-black max-w-4xl text-xl sm:text-2xl md:text-3xl mx-auto font-bold mt-6 ">
            Трассы. Дополнительно
          </div>
          <ResortFeatures features={feature} />
        </div>
      </div>
    </div>
  );
};

export default ResortPage;
