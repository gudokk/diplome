import React from "react";
import type { JSX } from "react";
import {
  FaSnowflake,
  FaTree,
  FaSkiing,
  FaMountain,
  FaSun,
  FaSchool,
  FaChild,
  FaRoute,
  FaHelicopter,
  FaCloudSun,
  FaSnowboarding,
  FaMoon,
  FaWind,
  FaGlobe,
} from "react-icons/fa";

type FeatureKey =
  | "fis_certified_trails_count"
  | "panoramic_trails_above_2500m"
  | "guaranteed_snow"
  | "snowboard_friendly"
  | "night_skiing"
  | "kiting_available"
  | "snowparks_count"
  | "halfpipes_count"
  | "artificial_snow"
  | "forest_trails"
  | "glacier_available"
  | "summer_skiing"
  | "freeride_opportunities"
  | "official_freeride_zones"
  | "backcountry_routes"
  | "heliski_available"
  | "official_freeride_guides"
  | "kids_ski_schools";

const iconMap: Record<FeatureKey, JSX.Element> = {
  fis_certified_trails_count: <FaGlobe />,
  panoramic_trails_above_2500m: <FaMountain />,
  guaranteed_snow: <FaCloudSun />,
  snowboard_friendly: <FaSnowboarding />,
  night_skiing: <FaMoon />,
  kiting_available: <FaWind />,
  snowparks_count: <FaSkiing />,
  halfpipes_count: <FaSkiing />,
  artificial_snow: <FaSnowflake />,
  forest_trails: <FaTree />,
  glacier_available: <FaMountain />,
  summer_skiing: <FaSun />,
  freeride_opportunities: <FaSkiing />,
  official_freeride_zones: <FaGlobe />,
  backcountry_routes: <FaRoute />,
  heliski_available: <FaHelicopter />,
  official_freeride_guides: <FaSchool />,
  kids_ski_schools: <FaChild />,
};

const labelMap: Record<FeatureKey, string> = {
  fis_certified_trails_count: "FIS трассы",
  panoramic_trails_above_2500m: "Панорамные трассы",
  guaranteed_snow: "Гарантированный снег",
  snowboard_friendly: "Курорт для сноуборда",
  night_skiing: "Ночное катание",
  kiting_available: "Кайтинг",
  snowparks_count: "Сноупарки",
  halfpipes_count: "Халфпайпы",
  artificial_snow: "Искусственное оснежение",
  forest_trails: "Лесные трассы",
  glacier_available: "Наличие ледника",
  summer_skiing: "Летнее катание",
  freeride_opportunities: "Фрирайд возможности",
  official_freeride_zones: "Официальные фрирайд зоны",
  backcountry_routes: "Маршруты бэккантри",
  heliski_available: "Хелиски",
  official_freeride_guides: "Школы и гиды",
  kids_ski_schools: "Детские школы",
};

const FeatureItem = ({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: any;
}) => {
  const isActive = Boolean(value) && value !== "нет" && value !== 0;

  return (
    <div
      className={`flex items-center gap-3 w-full p-3 rounded-lg shadow ${
        isActive ? "bg-blue-100" : "bg-gray-100 opacity-50"
      }`}
    >
      <div className="text-2xl text-blue-500">{icon}</div>
      <div>
        <p className="font-semibold text-sm text-black">{label}</p>
        <p className="text-xs text-gray-700">
          {typeof value === "boolean"
            ? value
              ? "есть"
              : "нет"
            : value || "нет"}
        </p>
      </div>
    </div>
  );
};

const ResortFeatures = ({
  features,
}: {
  features: Partial<Record<FeatureKey, any>>;
}) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-md max-w-4xl mx-auto mt-10 mb-10 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(labelMap) as FeatureKey[]).map((key) => (
          <FeatureItem
            key={key}
            icon={iconMap[key]}
            label={labelMap[key]}
            value={features[key]}
          />
        ))}
      </div>
    </div>
  );
};

export default ResortFeatures;
