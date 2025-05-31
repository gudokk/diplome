import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";

const trailTypes = ["Зелёная", "Синяя", "Красная", "Чёрная"];

const AddResortPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    information: "",
    trail_length: 0,
    max_height: 0,
    season: "",
    country: "",
  });

  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });

  const [extraInfo, setExtraInfo] = useState({
    how_to_get_there: "",
    nearby_cities: "",
    related_ski_areas: "",
  });

  const [features, setFeatures] = useState({
    panoramic_trails_above_2500m: false,
    guaranteed_snow: false,
    snowboard_friendly: false,
    night_skiing: false,
    kiting_available: false,
    snowparks_count: 0,
    halfpipes_count: 0,
    artificial_snow: false,
    forest_trails: false,
    glacier_available: false,
    summer_skiing: false,
    freeride_opportunities: "неизвестно",
    official_freeride_zones: false,
    backcountry_routes: false,
    heliski_available: false,
    official_freeride_guides: false,
    kids_ski_schools: false,
    fis_certified_trails_count: false,
  });

  const [tracks, setTracks] = useState([
    { trail_type: "Зелёная", trail_length: 0 },
  ]);

  const [skiPass, setSkiPass] = useState({
    price_day: 0,
    price_child: 0,
    price_2_days: 0,
    price_3_days: 0,
    price_4_days: 0,
    price_5_days: 0,
    price_6_days: 0,
    price_7_days: 0,
    season_pass: 0,
  });

  const [images, setImages] = useState<File[]>([]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExtraInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExtraInfo({ ...extraInfo, [e.target.name]: e.target.value });
  };

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinates({ ...coordinates, [e.target.name]: e.target.value });
  };

  const handleTrackChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...tracks];
    (updated[index] as any)[field] = value;
    setTracks(updated);
  };

  const addTrack = () => {
    setTracks([...tracks, { trail_type: "Зелёная", trail_length: 0 }]);
  };

  const handleSkiPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkiPass({ ...skiPass, [e.target.name]: parseInt(e.target.value) });
  };

  const handleFeaturesChange = (e: any) => {
    const { name, type, checked, value } = e.target;
    setFeatures({
      ...features,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value.toString())
    );
    Object.entries(coordinates).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    Object.entries(extraInfo).forEach(([key, value]) =>
      formData.append(key, value)
    );
    formData.append("tracks", JSON.stringify(tracks));
    formData.append("ski_pass", JSON.stringify(skiPass));
    formData.append("features", JSON.stringify(features));
    images.forEach((file) => formData.append("images", file));

    const res = await fetch("/back/api/admin/resorts", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      alert("Курорт успешно добавлен");
      navigate("/admin");
    } else {
      const err = await res.json();
      alert(`Ошибка: ${err.detail}`);
    }
  };

  const skiPassLabels: Record<string, string> = {
    price_day: "Цена за 1 день",
    price_child: "Детский ски-пасс",
    price_2_days: "Цена за 2 дня",
    price_3_days: "Цена за 3 дня",
    price_4_days: "Цена за 4 дня",
    price_5_days: "Цена за 5 дней",
    price_6_days: "Цена за 6 дней",
    price_7_days: "Цена за 7 дней",
    season_pass: "Сезонный абонемент",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-start p-6">
        <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Добавление курорта
            </h1>
            <Link
              to="/admin"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition text-center"
            >
              Назад к панели администратора
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основные поля */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Название
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Введите название курорта"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Страна</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleFormChange}
                  placeholder="Страна"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Описание
                </label>
                <textarea
                  name="information"
                  value={form.information}
                  onChange={handleFormChange}
                  placeholder="Краткое описание курорта"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Общая длина трасс (км)
                </label>
                <input
                  name="trail_length"
                  type="number"
                  value={form.trail_length}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Максимальная высота
                </label>
                <input
                  name="max_height"
                  type="number"
                  value={form.max_height}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Сезон
                </label>
                <input
                  name="season"
                  value={form.season}
                  onChange={handleFormChange}
                  placeholder="например, декабрь-март"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Широта (необязательно)
                </label>
                <input
                  name="latitude"
                  type="number"
                  value={coordinates.latitude}
                  onChange={handleCoordinatesChange}
                  placeholder="например, 45.123"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Долгота (необязательно)
                </label>
                <input
                  name="longitude"
                  type="number"
                  value={coordinates.longitude}
                  onChange={handleCoordinatesChange}
                  placeholder="например, 6.456"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Дополнительная информация */}
            <div>
              <h2 className="font-semibold text-gray-700 mb-2">
                Дополнительная информация
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Как добраться
                  </label>
                  <textarea
                    name="how_to_get_there"
                    value={extraInfo.how_to_get_there}
                    onChange={handleExtraInfoChange}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Ближайшие города
                  </label>
                  <input
                    name="nearby_cities"
                    value={extraInfo.nearby_cities}
                    onChange={handleExtraInfoChange}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Связанные лыжные зоны
                  </label>
                  <input
                    name="related_ski_areas"
                    value={extraInfo.related_ski_areas}
                    onChange={handleExtraInfoChange}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Особенности курорта */}
            <div>
              <h2 className="font-semibold text-gray-700 mb-2">
                Особенности курорта
              </h2>

              {/* Чекбоксы */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  [
                    "panoramic_trails_above_2500m",
                    "Панорамные трассы выше 2500м",
                  ],
                  ["guaranteed_snow", "Гарантированный снег"],
                  ["snowboard_friendly", "Подходит для сноуборда"],
                  ["night_skiing", "Ночное катание"],
                  ["kiting_available", "Кайтинг доступен"],
                  ["artificial_snow", "Искусственный снег"],
                  ["forest_trails", "Трассы в лесу"],
                  ["glacier_available", "Наличие ледника"],
                  ["summer_skiing", "Летнее катание"],
                  ["official_freeride_zones", "Официальные зоны фрирайда"],
                  ["backcountry_routes", "Маршруты бэккантри"],
                  ["heliski_available", "Гели-ски доступен"],
                  ["official_freeride_guides", "Официальные фрирайд-гиды"],
                  ["kids_ski_schools", "Детские горнолыжные школы"],
                  ["fis_certified_trails", "FIS сертифицированные трассы"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={key}
                      checked={
                        features[key as keyof typeof features] as boolean
                      }
                      onChange={handleFeaturesChange}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {/* Числовые поля */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["snowparks_count", "Количество сноупарков"],
                  ["halfpipes_count", "Количество халфпайпов"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={features[key as keyof typeof features] as number}
                      onChange={handleFeaturesChange}
                      className="rounded-xl border border-gray-300 p-3 text-sm shadow-sm w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Возможности фрирайда (select) */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Возможности фрирайда
                </label>
                <select
                  name="freeride_opportunities"
                  value={features.freeride_opportunities}
                  onChange={handleFeaturesChange}
                  className="rounded-xl border border-gray-300 p-3 text-sm shadow-sm w-full"
                >
                  <option value="неизвестно">Неизвестно</option>
                  <option value="плохие">Плохие</option>
                  <option value="хорошие">Хорошие</option>
                </select>
              </div>
            </div>

            {/* Трассы */}
            <div>
              <h2 className="font-semibold text-gray-700 mb-2">Трассы</h2>
              {tracks.map((track, i) => (
                <div key={i} className="flex gap-4 mb-2">
                  <select
                    value={track.trail_type}
                    onChange={(e) =>
                      handleTrackChange(i, "trail_type", e.target.value)
                    }
                    className="rounded-xl border border-gray-300 p-2 text-sm"
                  >
                    {trailTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={track.trail_length}
                    onChange={(e) =>
                      handleTrackChange(
                        i,
                        "trail_length",
                        parseInt(e.target.value)
                      )
                    }
                    placeholder="Длина (км)"
                    className="rounded-xl border border-gray-300 p-2 w-32 text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addTrack}
                className="text-blue-600 hover:underline text-sm mt-2"
              >
                + Добавить трассу
              </button>
            </div>

            {/* Ски-пасс */}
            <div>
              <h2 className="font-semibold text-gray-700 mb-2">
                Цены на ски-пасс
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(skiPass).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {skiPassLabels[key]}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={value}
                      placeholder={skiPassLabels[key]}
                      onChange={handleSkiPassChange}
                      className="rounded-xl border border-gray-300 p-3 text-sm shadow-sm w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Изображения */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Изображения курорта
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-900"
            >
              Сохранить курорт
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddResortPage;
