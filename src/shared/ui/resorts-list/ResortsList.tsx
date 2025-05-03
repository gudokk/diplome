// === FRONTEND ===
import React, { useEffect, useState } from "react";

interface Resort {
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

const ResortsTable = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);

  useEffect(() => {
    fetch("back/api/resorts-table")
      .then((res) => res.json())
      .then((data) => setResorts(data))
      .catch((err) => console.error("Failed to load resorts:", err));
  }, []);

  return (
    <div className="overflow-x-auto mt-10 px-4">
      <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Курорт</th>
            <th className="px-4 py-2">Трассы (km)</th>
            <th className="px-4 py-2">Перепад высот</th>
            <th className="px-4 py-2">Макс. высота</th>
            <th className="px-4 py-2 text-green-600">Зелёные</th>
            <th className="px-4 py-2 text-blue-600">Синие</th>
            <th className="px-4 py-2 text-red-500">Красные</th>
            <th className="px-4 py-2 text-black">Чёрные</th>
            <th className="px-4 py-2">Подъёмники</th>
          </tr>
        </thead>
        <tbody>
          {resorts.map((resort, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2 font-medium text-black">
                {resort.name}
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
