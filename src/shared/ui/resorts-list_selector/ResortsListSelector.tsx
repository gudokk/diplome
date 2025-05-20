// Новый ResortCard + ResortSelector с макетом как на скриншоте и отображением трасс по цветам
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";

interface Resort {
    id: number;
    name: string;
    country: string;
    min_height: number;
    max_height: number;
    trail_length: number;
    trail_green: number;
    trail_blue: number;
    trail_red: number;
    trail_black: number;
    lifts: string;
    price_day: number | null;
    num_reviews: number;
    average_rating: number;
    latest_review: string | null;
}

interface ResortImage {
    id: number;
    image: string;
}

const Stars = ({ rating }: { rating: number }) => {
    const filled = Math.round(rating);
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= filled ? "text-yellow-500" : "text-gray-300"}>★</span>
            ))}
            <span className="text-gray-600 text-sm ml-1">{rating.toFixed(1)}</span>
        </div>
    );
};

const ResortCard = ({ resort, image }: { resort: Resort; image: string | null }) => (
    <div className="bg-white rounded-xl shadow p-4 flex gap-4 max-w-5xl w-full">
        {image ? (
            <img
                src={`http://localhost:8000${image}`}
                alt={resort.name}
                className="w-48 h-32 object-cover rounded-md"
            />
        ) : (
            <div className="w-48 h-32 bg-gray-300 rounded-md" />
        )}
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold text-black"><Link to={`/resorts/${resort.id}`}>{resort.name}</Link></h2>
                <p className="text-sm text-gray-500 mb-2">{resort.country}</p>
                <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Высота:</span> {resort.min_height} - {resort.max_height} м
                </div>
                <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Трассы:</span> {resort.trail_length} км •
                    <span className="text-green-600"> {resort.trail_green}</span>,
                    <span className="text-blue-600"> {resort.trail_blue}</span>,
                    <span className="text-red-600"> {resort.trail_red}</span>,
                    <span className="text-black"> {resort.trail_black}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Подъёмники:</span> {resort.lifts}
                </div>
                <div className="text-sm text-gray-700">
                    <span className="font-medium">Скипасс:</span> {resort.price_day ? `${resort.price_day} ₽ в день` : "нет данных"}
                </div>
            </div>
            <div className="flex justify-between items-end mt-2">
                <div className="flex items-center gap-2">
                    <Stars rating={resort.average_rating} />
                    <span className="text-sm text-gray-500">({resort.num_reviews})</span>
                </div>
                {resort.latest_review && (
                    <p className="text-sm text-gray-600 max-w-[300px] truncate">
                        <Link to={`/resorts/${resort.id}/reviews`} className="font-medium ">{resort.latest_review}</Link>
                        </p>
                )}
            </div>
        </div>
    </div>
);
const ResortsSelector = () => {
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [images, setImages] = useState<Record<number, string>>({});
    const [selectedSort, setSelectedSort] = useState<string>("");
    const [ascending, setAscending] = useState<boolean>(true);
    const [weatherFilters, setWeatherFilters] = useState({
        snow_last_3_days: false,
        snow_expected: false
    });


    useEffect(() => {
        const query = new URLSearchParams();
        if (weatherFilters.snow_last_3_days) query.append("snow_last_3_days", "true");
        if (weatherFilters.snow_expected) query.append("snow_expected", "true");

        fetch(`/back/api/resorts/selector?${query.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setResorts(data);
                data.forEach((resort: Resort) => {
                    fetch(`/back/api/resort-images/${resort.id}`)
                        .then((res) => res.json())
                        .then((imgs: ResortImage[]) => {
                            if (imgs.length > 0) {
                                setImages((prev) => ({ ...prev, [resort.id]: imgs[0].image }));
                            }
                        });
                });
            });
    }, [weatherFilters]);


    const handleSort = (key: string) => {
        if (key === selectedSort) {
            setAscending((prev) => !prev); // инвертировать направление
        } else {
            setSelectedSort(key);
            setAscending(true); // по умолчанию сначала по возрастанию
        }
    };

    const sortedResorts = [...resorts].sort((a, b) => {
        const multiplier = ascending ? 1 : -1;
        switch (selectedSort) {
            case "rating":
                return multiplier * (a.average_rating - b.average_rating);
            case "price":
                return multiplier * ((a.price_day || Infinity) - (b.price_day || Infinity));
            case "trail":
                return multiplier * (a.trail_length - b.trail_length);
            case "height":
                return multiplier * (a.max_height - b.max_height);
            case "green":
                return multiplier * (a.trail_green - b.trail_green);
            case "blue":
                return multiplier * (a.trail_blue - b.trail_blue);
            case "red":
                return multiplier * (a.trail_red - b.trail_red);
            case "black":
                return multiplier * (a.trail_black - b.trail_black);
            case "name":
                return multiplier * a.name.localeCompare(b.name);
            case "popular":
                return multiplier * (a.num_reviews - b.num_reviews);
            default:
                return 0;
        }
    });

    const sortButtons = [
        { key: "popular", label: "По популярности" },
        { key: "rating", label: "По рейтингу" },
        { key: "price", label: "По цене на скипасс" },
        { key: "trail", label: "По км. трасс" },
        { key: "height", label: "По высоте" },
        { key: "green", label: "По зелёным трассам" },
        { key: "blue", label: "По синим трассам" },
        { key: "red", label: "По красным трассам" },
        { key: "black", label: "По чёрным трассам" },
        { key: "name", label: "По названию" },
    ];

    return (
        <div>
            <p className="text-gray-700 text-left p-10 pb-2">
                Найдено {resorts.length} курорт{resorts.length === 1 ? "" : resorts.length < 5 && resorts.length === 1 ? "а" : "ов"}
            </p>

            {/* Блок сортировки */}
            <div className="flex flex-wrap gap-2 px-10 pb-6">
                {sortButtons.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`text-sm px-3 py-1 rounded border flex items-center gap-1 ${
                            selectedSort === key
                                ? "bg-blue-600 text-white border-blue-600"
                                : "text-blue-600 border-blue-600 hover:bg-blue-100"
                        }`}
                    >
                        {label}
                        {selectedSort === key && (
                            <span>{ascending ? "↑" : "↓"}</span>
                        )}
                    </button>
                ))}
            </div>
            <div className="px-10 pb-4">
                <h3 className="font-semibold text-sm text-black mb-1">Фильтр по погоде:</h3>
                <label className="text-sm block text-black">
                    <input
                        type="checkbox"
                        checked={weatherFilters.snow_last_3_days}
                        onChange={(e) =>
                            setWeatherFilters({ ...weatherFilters, snow_last_3_days: e.target.checked })
                        }
                    />{" "}
                    Снег за последние 3 дня
                </label>
                <label className="text-sm block text-black ">
                    <input
                        type="checkbox"
                        checked={weatherFilters.snow_expected}
                        onChange={(e) =>
                            setWeatherFilters({ ...weatherFilters, snow_expected: e.target.checked })
                        }
                    />{" "}
                    Снег ожидается в ближайшее время
                </label>
            </div>


            <div className="max-w-6xl mx-auto grid gap-6 py-6 pt-0">
                {sortedResorts.map((resort) => (
                    <ResortCard key={resort.id} resort={resort} image={images[resort.id] || null} />
                ))}
            </div>
        </div>
    );
};

export default ResortsSelector;
