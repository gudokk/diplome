import { useState } from "react";

export default function CreateTripForm({
  onTripAdded,
}: {
  onTripAdded: () => void;
}) {
  const [resort, setResort] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{
    resort?: string;
    date?: string;
    description?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!resort) {
      newErrors.resort = "Укажите название курорта";
    }
    if (!startDate || !endDate) {
      newErrors.date = "Укажите обе даты";
    } else if (new Date(endDate) < new Date(startDate)) {
      newErrors.date = "Дата окончания не может быть раньше начала";
    }
    if (description.length > 300) {
      newErrors.description = "Описание не должно превышать 300 символов";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/back/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resort_name: resort,
        trip_start_date: startDate,
        trip_end_date: endDate,
        description,
      }),
    });

    if (res.ok) {
      setResort("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setErrors({});
      onTripAdded();
    } else {
      setErrors({ date: "Ошибка при добавлении поездки" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-semibold text-center text-blue-800">
        Добавить поездку
      </h3>

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
        {errors.resort && (
          <p className="text-red-500 text-sm mt-1">{errors.resort}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Дата начала поездки
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="mt-1 w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Дата окончания поездки
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="mt-1 w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {errors.date && (
        <p className="text-red-500 text-sm mt-1">{errors.date}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Описание поездки{" "}
          <span className="text-gray-400">(необязательно)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full border border-gray-300 rounded-md p-2"
          placeholder="Например: Еду с друзьями кататься на сноуборде"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
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
