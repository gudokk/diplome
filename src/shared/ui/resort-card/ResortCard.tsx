import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Mountains from "../../../assets/mountains.svg";
import Skiing from "../../../assets/skiing.svg";
import Gondola from "../../../assets/gondola.svg";

const ResortCard = () => {
  const { id } = useParams();
  const [resort, setResort] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/back/api/resorts/${id}`)
      .then((res) => res.json())
      .then(setResort)
      .catch((err) => console.error("Ошибка загрузки курорта:", err));
  }, [id]);

  if (!resort) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <ul className="bg-[#d9dde9] shadow overflow-hidden rounded-md max-w-4xl mx-auto mt-10 flex flex-wrap justify-center gap-4 p-4">
      <li className="flex items-center gap-4 bg-white text-black p-4 rounded-md w-full sm:w-[250px]">
        <img src={Mountains} alt="Иконка перепада" className="w-8 h-8" />
        <div>
          <p className="font-medium">Перепад высот:</p>
          <p>{resort.changes} м</p>
        </div>
      </li>

      <li className="flex items-center gap-4 bg-white text-black p-4 rounded-md w-full sm:w-[250px]">
        <img src={Skiing} alt="Иконка перепада" className="w-8 h-8" />
        <div>
          <p className="font-medium">Трассы:</p>
          <p>{resort.trail_length} км</p>
        </div>
      </li>

      <li className="flex items-center gap-4 bg-white text-black p-4 rounded-md w-full sm:w-[250px]">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10m-11 4h11M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <div>
          <p className="font-medium">Сезон:</p>
          <p>{resort.season}</p>
        </div>
      </li>
      <li className="flex items-center gap-4 bg-white text-black p-4 rounded-md w-full sm:w-[780px]">
        <img src={Gondola} alt="Иконка перепада" className="w-8 h-8" />
        <div>
          <p className="font-medium">Подъемники:</p>
          <p>{resort.lifts}</p>
        </div>
      </li>
    </ul>
  );
};

export default ResortCard;
