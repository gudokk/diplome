import { useEffect, useState } from "react";
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
    if (recentSnow) params.set("snow_last_3_days", "true");
    if (expectedSnow) params.set("snow_expected", "true");

    navigate(`/resorts/selector?${params.toString()}`);
  };

  return (
    <div className=" container max-w-6xl mx-auto px-10 py-8 pl-5 bg-white rounded-lg mb-10">
      <h2 className="text-gray-950 text-xl font-bold mb-4 tracking-wider">
        КУДА ПОЕХАТЬ →
      </h2>

      {/* Форма фильтров */}
      <div className="flex flex-wrap gap-6 items-center">
        {/* 1. Трассы */}
        <div>
          <div className="text-lg font-semibold mb-2 text-gray-950">Трассы</div>
          <div className="flex gap-2 text-gray-950">
            {["Синяя", "Красная", "Чёрная"].map((color) => (
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
                value="yes"
                checked={visa === "yes"}
                onChange={() => setVisa("yes")}
              />
              Только с визой
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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
    </div>
  );
};

export default ResortsQuickSearch;
