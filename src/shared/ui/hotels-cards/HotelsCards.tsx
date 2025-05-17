import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Hotel {
  id: number;
  name: string;
  hotel_type: string;
  stars: number;
  reviews_count: number;
  rating: number;
  yandex_link: string;
  distance_to_lift: number;
  price_per_night: number;
  images: string[];
}

const HotelCard = ({ hotel }: { hotel: Hotel }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row  gap-4 p-4  min-h-[300px]">
    <img
      src={
        `http://localhost:8000${hotel.images[0]}` ||
        "/static/images/hotels/default.jpg"
      }
      alt={hotel.name}
      className="w-full sm:w-[350px] max-h-[270px] object-cover rounded-md"
    />
    <div className="flex flex-col justify-between flex-1">
      <div>
        <h2 className="text-3xl font-bold text-black">{hotel.name}</h2>
        <p className="text-l text-gray-600">
          {hotel.hotel_type} • {hotel.stars} ⭐ • {hotel.reviews_count} отзывов
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Рейтинг: {hotel.rating} • {hotel.distance_to_lift} м до подъёмника
        </p>
      </div>
      <div className="flex justify-between items-end mt-2">
        <a
          href={hotel.yandex_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          Ссылка на Яндекс.Путешествия
        </a>
        <span className="text-2xl font-semibold text-blue-600">
          от {hotel.price_per_night} ₽ / ночь
        </span>
      </div>
    </div>
  </div>
);

const HotelsList = () => {
  const { id } = useParams(); // id = resort_id
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/back/api/resorts/${id}/hotels`)
      .then((res) => res.json())
      .then(async (hotelsData) => {
        const hotelsWithImages = await Promise.all(
          hotelsData.map(async (hotel: Hotel) => {
            try {
              const imgRes = await fetch(
                `/back/api/hotels-images/${id}/${hotel.id}`
              );
              const images = await imgRes.json();
              return { ...hotel, images: images.map((img: any) => img.image) };
            } catch {
              return { ...hotel, images: [] };
            }
          })
        );
        setHotels(hotelsWithImages);
      })
      .catch((err) => console.error("Ошибка загрузки отелей:", err));
  }, [id]);

  return (
    <div className="grid gap-6 py-6 px-4 grid-cols-1  w-full max-w-7xl mx-auto">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelsList;
