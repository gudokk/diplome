// ProfilePage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import defaultPhoto from "../../assets/account-photo.jpg";
import BloggerRequestForm from "../../shared/ui/blogger-request/BloggerRequestForm";
import calendarBanner from "../../assets/calendar-banner.png";

interface User {
  id: number;
  username: string;
  email: string;
  registration_date: string;
  description: string;
  gender: string;
  photo: string | null;
  is_admin: boolean;
  is_blogger: boolean;
  has_pending_blogger_request: boolean;
  friends_count?: number;
}

function pluralizeFriend(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return `${n} друг`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} друга`;
  return `${n} друзей`;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/back/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/authorization");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/authorization");
  };

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center mt-4 px-4">
        <div className="px-4 sm:px-0 w-full">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-auto p-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 text-center mb-8 md:mb-0">
                <img
                  src={
                    user.photo
                      ? `http://localhost:8000${user.photo}`
                      : defaultPhoto
                  }
                  alt="Profile Picture"
                  className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-blue-800 object-cover"
                />
                <h1 className="text-2xl font-bold text-blue-800 mb-2">
                  {user.username}
                </h1>
                <p className="text-gray-600 mb-2">
                  {user.description || "Нет описания"}
                </p>
                {/* Блок друзей */}
                <Link
                  to="/profile/friends"
                  className="text-sm text-gray-700 hover:underline"
                >
                  {pluralizeFriend(user.friends_count || 0)}
                </Link>
              </div>
              <div className="md:w-1/3 md:pl-8">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  Информация
                </h2>
                <ul className="space-y-2 text-gray-700 mb-5">
                  <li>
                    <strong>Email:</strong> {user.email}
                  </li>
                  <li>
                    <strong>Дата регистрации:</strong> {user.registration_date}
                  </li>
                  <li>
                    <strong>Пол:</strong> {user.gender || "Не указан"}
                  </li>
                  <li>
                    <strong>Роль:</strong>{" "}
                    {user.is_admin ? "Администратор" : "Пользователь"}
                  </li>
                </ul>
              </div>
              <div className="md:w-1/3 md:pl-8">
                <div className="flex flex-col  gap-4 ">
                  {/* <Link
                    to="/ski-game"
                    className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 text-center"
                  >
                    Играть в игру
                  </Link> */}
                  <Link
                    to="/calendar"
                    className="flex flex-col justify-center px-10"
                  >
                    <img
                      src={calendarBanner}
                      alt="Перейти в календарь поездок"
                      className="w-30 h-30 transition hover:opacity-90"
                    />
                    <p className="text-sm text-blue-800 mt-2 hover:underline text-center">
                      Перейти в календарь
                    </p>
                  </Link>
                  <Link
                    to="/news/create"
                    className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 text-center"
                  >
                    ✍ Создать новость
                  </Link>

                  <BloggerRequestForm
                    isBlogger={user.is_blogger}
                    hasPending={user.has_pending_blogger_request}
                  />
                  <button
                    onClick={handleEditProfile}
                    className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900"
                  >
                    Редактировать профиль
                  </button>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
