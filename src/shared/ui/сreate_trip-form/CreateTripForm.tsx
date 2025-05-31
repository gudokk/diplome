import { useState } from "react";

export default function CreateTripForm({
  onTripAdded,
}: {
  onTripAdded: () => void;
}) {
  const [resort, setResort] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/back/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resort_name: resort, trip_date: date }),
    });

    if (res.ok) {
      setResort("");
      setDate("");
      onTripAdded(); // обновить календарь
    } else {
      alert("Ошибка при добавлении поездки");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-semibold text-blue-800">Добавить поездку</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Курорт
        </label>
        <input
          type="text"
          value={resort}
          onChange={(e) => setResort(e.target.value)}
          required
          className="mt-1 w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Дата поездки
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
      >
        Добавить
      </button>
    </form>
  );
}
