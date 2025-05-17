import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResortsQuickSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resorts, setResorts] = useState<any[]>([]);
  const [hasSearch, setHasSearch] = useState(false);

  const [slopes, setSlopes] = useState<string | null>(null);
  const [visa, setVisa] = useState<string>("any");
  const [recentSnow, setRecentSnow] = useState(false);
  const [expectedSnow, setExpectedSnow] = useState(false);

  // Загружаем курорты только если параметры заданы
  useEffect(() => {
    const isAnyFilter = searchParams.toString() !== "";
    if (!isAnyFilter) {
      setHasSearch(false);
      return;
    }

    setHasSearch(true);

    fetch(`/back/api/resorts/search?${searchParams.toString()}`)
      .then((res) => res.json())
      .then(setResorts)
      .catch((err) => console.error("Ошибка загрузки курортов:", err));
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (slopes) params.set("slopes", slopes);
    if (visa !== "any") params.set("visa", visa);
    if (recentSnow) params.set("recentSnow", "true");
    if (expectedSnow) params.set("expectedSnow", "true");

    setSearchParams(params);
  };

  return (
    <div className="w-full py-8 px-4 sm:px-8 rounded-lg bg-white mb-10 max-w-6xl mx-auto">
      <h2 className="text-gray-950 text-xl font-bold mb-4 tracking-wider">
        КУДА ПОЕХАТЬ →
      </h2>

      {/* Форма фильтров */}
      <div className="flex flex-wrap gap-6 items-center">
        {/* 1. Трассы */}
        <div>
          <div className="text-lg font-semibold mb-2 text-gray-950">Трассы</div>
          <div className="flex gap-2 text-gray-950">
            {["Синие", "Красные", "Черные"].map((color) => (
              <button
                key={color}
                onClick={() => setSlopes(color)}
                className={`border px-3 py-1 rounded ${
                  slopes === color ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Виза */}
        <div>
          <div className="text-lg font-semibold mb-2 text-gray-950">Виза</div>
          <div className="flex gap-3">
            <label className="flex items-center gap-1 text-gray-950">
              <input
                type="radio"
                name="visa"
                value="any"
                checked={visa === "any"}
                onChange={() => setVisa("any")}
              />
              Любая виза
            </label>
            <label className="flex items-center gap-1 text-gray-950">
              <input
                type="radio"
                name="visa"
                value="no"
                checked={visa === "no"}
                onChange={() => setVisa("no")}
              />
              Без визы
            </label>
          </div>
        </div>

        {/* 3. Снег */}
        <div>
          <div className="text-lg font-semibold mb-2 text-gray-950">Снег</div>
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-gray-950">
              <input
                type="checkbox"
                checked={recentSnow}
                onChange={() => setRecentSnow((v) => !v)}
              />
              Недавний снег
            </label>
            <label className="flex items-center gap-2 text-gray-950">
              <input
                type="checkbox"
                checked={expectedSnow}
                onChange={() => setExpectedSnow((v) => !v)}
              />
              Снег ожидается
            </label>
          </div>
        </div>

        <div className="ml-auto flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleSearch}
            className="bg-blue-500  hover:bg-blue-600  text-white px-4 py-2 rounded"
          >
            Найти курорт
          </button>
          <button
            onClick={() => navigate("/resorts/selector")}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded"
          >
            Расширенный поиск
          </button>
        </div>
      </div>

      {/* Блок результатов */}
      {hasSearch && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Результаты поиска</h3>
          {resorts.length === 0 ? (
            <p className="text-gray-600">
              Ничего не найдено по заданным фильтрам.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resorts.map((resort) => (
                <div
                  key={resort.id}
                  className="bg-white shadow rounded p-4 border border-gray-100"
                >
                  <h4 className="text-xl font-semibold text-black mb-2">
                    {resort.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {resort.country || "Страна не указана"}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    Трассы: {resort.trails_km || 0} км
                  </p>
                  <p className="text-sm text-gray-700">
                    Высота: {resort.altitude_min} - {resort.altitude_max} м
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResortsQuickSearch;
