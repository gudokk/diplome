import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Resort {
  id: number;
  name: string;
  total_km: number;
  min_height: number;
  max_height: number;
  green: number;
  blue: number;
  red: number;
  black: number;
  lifts: string;
}

type SortKey = keyof Resort;
type SortOrder = "asc" | "desc";

const ResortsTable = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    fetch("back/api/resorts-table")
      .then((res) => res.json())
      .then((data) => setResorts(data))
      .catch((err) => console.error("Failed to load resorts:", err));
  }, []);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedResorts = [...resorts].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const renderHeader = (label: string, key: SortKey, className = "") => (
    <th
      className={`px-4 py-2 cursor-pointer ${className}`}
      onClick={() => handleSort(key)}
    >
      {label} {sortKey === key && (sortOrder === "asc" ? "↑" : "↓")}
    </th>
  );

  return (
    <div className="overflow-x-auto mt-10 px-4 max-w-7xl mx-auto">
      <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {renderHeader("Курорт", "name", "text-blue-700")}
            {renderHeader("Трассы (km)", "total_km")}
            {renderHeader("Мин. высота", "min_height")}
            {renderHeader("Макс. высота", "max_height")}
            {renderHeader("Зелёные", "green", "text-green-600")}
            {renderHeader("Синие", "blue", "text-blue-600")}
            {renderHeader("Красные", "red", "text-red-500")}
            {renderHeader("Чёрные", "black", "text-black")}
            {renderHeader("Подъёмники", "lifts")}
          </tr>
        </thead>
        <tbody>
          {sortedResorts.map((resort, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2 font-medium text-blue-700 underline">
                <Link to={`/resorts/${resort.id}`}>{resort.name}</Link>
              </td>
              <td className="px-4 py-2 text-black">{resort.total_km}</td>
              <td className="px-4 py-2 text-black">{resort.min_height}</td>
              <td className="px-4 py-2 text-black">{resort.max_height}</td>
              <td className="px-4 py-2 text-black">{resort.green}</td>
              <td className="px-4 py-2 text-black">{resort.blue}</td>
              <td className="px-4 py-2 text-black">{resort.red}</td>
              <td className="px-4 py-2 text-black">{resort.black}</td>
              <td className="px-4 py-2 text-black">{resort.lifts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResortsTable;
