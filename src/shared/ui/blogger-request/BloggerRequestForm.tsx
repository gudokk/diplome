// import { useState } from "react";

// interface Props {
//   isBlogger: boolean;
// }

// const BloggerRequestForm = ({ isBlogger }: Props) => {
//   const [comment, setComment] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   if (isBlogger) {
//     return (
//       <p className="text-green-700 text-sm mt-6">
//         Вы уже являетесь блогером. Спасибо за вклад в платформу!
//       </p>
//     );
//   }

//   if (submitted) {
//     return (
//       <p className="text-green-600 mt-6 text-sm">
//         Заявка на получение статуса блогера отправлена!
//       </p>
//     );
//   }

//   const handleSubmit = async () => {
//     const res = await fetch("/back/api/blogger-requests", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({ comment }),
//     });

//     if (res.ok) {
//       setSubmitted(true);
//     } else {
//       const err = await res.json();
//       alert(err.detail);
//     }
//   };

//   return (
//     <div className="bg-gray-50 p-4 rounded shadow mt-6">
//       <h3 className="text-base font-semibold mb-2 text-blue-800">
//         Стать блогером
//       </h3>
//       <textarea
//         className="border w-full p-2 rounded mb-2 text-sm"
//         placeholder="Добавьте ссылки на соцсети или кратко расскажите о себе..."
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         rows={3}
//       />
//       <button
//         onClick={handleSubmit}
//         className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
//       >
//         Отправить заявку
//       </button>
//     </div>
//   );
// };

// export default BloggerRequestForm;

import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  isBlogger: boolean;
  hasPending: boolean;
}

const BloggerRequestForm = ({ isBlogger, hasPending }: Props) => {
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (isBlogger) {
    return (
      <Link
        to="/blogger-overview"
        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-green-800 text-center"
      >
        📚 Обзор от блогера
      </Link>
    );
  }

  if (hasPending || submitted) {
    return (
      <p className="text-yellow-700 text-sm mt-6">
        Ваша заявка на блогера рассматривается.
      </p>
    );
  }

  const handleSubmit = async () => {
    const res = await fetch("/back/api/blogger-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const err = await res.json();
      alert(err.detail);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow mt-6">
      <h3 className="text-base font-semibold mb-2 text-blue-800">
        Стать блогером
      </h3>
      <textarea
        className="border w-full p-2 rounded mb-2 text-sm"
        placeholder="Добавьте ссылки на соцсети или кратко расскажите о себе..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
      >
        Отправить заявку
      </button>
    </div>
  );
};

export default BloggerRequestForm;
