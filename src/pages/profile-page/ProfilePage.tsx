// ProfilePage.tsx
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import defaultPhoto from "../../assets/account-photo.jpg";

interface User {
  id: number;
  username: string;
  email: string;
  registration_date: string;
  description: string;
  gender: string;
  photo: string | null;
  is_admin: boolean;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
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
        <main className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto p-8 transition-all duration-300 animate-fade-in">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 text-center mb-8 md:mb-0">
                <img
                    src={user.photo ? `http://localhost:8000${user.photo}` : defaultPhoto}
                    alt="Profile Picture"
                    className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-blue-800 transition-transform duration-300 hover:scale-105"
                />
                <h1 className="text-2xl font-bold text-blue-800 mb-2">
                  {user.username}
                </h1>
                <p className="text-gray-600">
                  {user.description || "Нет описания"}
                </p>
                <div className="flex flex-col gap-4 mt-6">
                  <button
                      onClick={handleEditProfile}
                      className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                  >
                    Редактировать профиль
                  </button>
                  <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    Выйти
                  </button>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h2 className="text-xl font-semibold text-indigo-800 mb-4">Информация</h2>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> {user.email}</li>
                  <li><strong>Дата регистрации:</strong> {user.registration_date}</li>
                  <li><strong>Пол:</strong> {user.gender || "Не указан"}</li>
                  <li><strong>Роль:</strong> {user.is_admin ? "Администратор" : "Пользователь"}</li>
                </ul>
                <Link to="/ski-game" className="flex flex-col items-center text-gray-500 hover:text-gray-500/75">
                  <span>Статьи</span>
                </Link>
                <Link
                    to="/articles/create"
                    className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
                >
                  ✍ Создать новость
                </Link>

              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default ProfilePage;
