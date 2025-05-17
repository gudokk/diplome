import { useEffect, useState } from "react";

interface Resort {
  id: number;
  name: string;
  country: string;
  trail_length: number;
  max_height: number;
  min_height: number;
  num_reviews: number;
  price_day: number;
  image: string;
}

const ResortCard = ({ resort }: { resort: Resort }) => (
  <div className="bg-white rounded-xl shadow p-4 flex gap-4">
    <img
      src={`/static/images/resorts/${resort.image}`}
      alt={resort.name}
      className="w-40 h-32 object-cover rounded-md"
    />
    <div className="flex flex-col justify-between flex-1">
      <div>
        <h2 className="text-xl font-bold text-black">{resort.name}</h2>
        <p className="text-sm text-gray-500">{resort.country}</p>
        <p className="text-sm text-gray-700 mt-1">
          Трассы: {resort.trail_length} км • Перепад:{" "}
          {resort.max_height - resort.min_height} м
        </p>
      </div>
      <div className="flex justify-between items-end mt-2">
        <span className="text-sm text-gray-600">
          Отзывов: {resort.num_reviews}
        </span>
        <span className="text-lg font-semibold text-indigo-600">
          от {resort.price_day} ₽ / день
        </span>
      </div>
    </div>
  </div>
);

const ResortsSelector = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);

  useEffect(() => {
    fetch("/back/api/resorts/selector")
      .then((res) => res.json())
      .then((data) => setResorts(data))
      .catch((err) => console.error("Ошибка загрузки:", err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto grid gap-6 py-6">
      {resorts.map((resort) => (
        <ResortCard key={resort.id} resort={resort} />
      ))}
    </div>
  );
};

export default ResortsSelector;
