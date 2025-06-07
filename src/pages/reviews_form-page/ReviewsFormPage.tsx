import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import toast from "react-hot-toast";

interface ReviewFormData {
  stay_month: string;
  stay_year: number;
  rating_skiing: number;
  comment_skiing: string;
  rating_lifts: number;
  comment_lifts: string;
  rating_prices: number;
  comment_prices: string;
  rating_snow_weather: number;
  comment_snow_weather: string;
  rating_accommodation: number;
  comment_accommodation: string;
  rating_people: number;
  comment_people: string;
  rating_apres_ski: number;
  comment_apres_ski: string;
  overall_comment: string;
}

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ReviewFormData>({
    stay_month: "Январь",
    stay_year: new Date().getFullYear(),
    rating_skiing: 5,
    comment_skiing: "",
    rating_lifts: 5,
    comment_lifts: "",
    rating_prices: 5,
    comment_prices: "",
    rating_snow_weather: 5,
    comment_snow_weather: "",
    rating_accommodation: 5,
    comment_accommodation: "",
    rating_people: 5,
    comment_people: "",
    rating_apres_ski: 5,
    comment_apres_ski: "",
    overall_comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.startsWith("rating") ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(`/back/api/resorts/${id}/submit-review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // важно
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      toast.success("отзыв отправлен на модерацию");
      navigate(`/resorts/${id}`);
    } else {
      const data = await response.json();
      toast.error(data.detail || "Ошибка при публикации отзыва");
    }
  };

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container relative flex flex-col justify-between h-full max-w-5xl px-10 mx-auto xl:px-0 mt-5">
        <div className="bg-white rounded-xl shadow-2xl mx-auto w-full p-8 transition-all duration-300 animate-fade-in">
          <h2 className="text-4xl text-black font-bold mb-4">Оставить отзыв</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <select
                name="stay_month"
                value={form.stay_month}
                onChange={handleChange}
                className="border p-2 rounded bg-white text-black border-blue-400"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="stay_year"
                value={form.stay_year}
                onChange={handleChange}
                className="border p-2 rounded w-24 bg-white border-blue-400 text-black"
              />
            </div>

            <div>
              <label className="font-semibold text-black">
                Общий комментарий
              </label>
              <textarea
                name="overall_comment"
                placeholder="Общее впечатление"
                value={form.overall_comment}
                onChange={handleChange}
                className="border p-2 rounded w-full bg-white border-blue-400 text-black mt-2"
              ></textarea>
            </div>

            {[
              {
                label: "Катание",
                key: "skiing",
                hint: "Расскажите о трассах, их сложности и длине",
              },
              {
                label: "Подъёмники",
                key: "lifts",
                hint: "Комфорт и количество подъёмников",
              },
              {
                label: "Цены",
                key: "prices",
                hint: "Соотношение цены и качества",
              },
              {
                label: "Снег и погода",
                key: "snow_weather",
                hint: "Качество снега и погодные условия",
              },
              {
                label: "Жилье",
                key: "accommodation",
                hint: "Уровень проживания и доступность",
              },
              {
                label: "Публика",
                key: "people",
                hint: "Аудитория отдыхающих, атмосфера",
              },
              {
                label: "Досуг",
                key: "apres_ski",
                hint: "Развлечения после катания",
              },
            ].map(({ label, key, hint }) => (
              <div key={key}>
                <label className="font-semibold text-black">{label}</label>
                <p className="text-sm text-gray-600 mb-1">{hint}</p>
                <textarea
                  name={`comment_${key}`}
                  value={(form as any)[`comment_${key}`]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full bg-white text-black border-blue-400"
                ></textarea>
                <select
                  name={`rating_${key}`}
                  value={(form as any)[`rating_${key}`]}
                  onChange={handleChange}
                  className="border p-2 rounded mt-1 bg-white text-black border-blue-400"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              Отправить отзыв
            </button>
          </form>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ReviewForm;
