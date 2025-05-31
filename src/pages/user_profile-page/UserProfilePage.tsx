import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import defaultPhoto from "../../assets/account-photo.jpg";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";

interface User {
  id: number;
  username: string;
  photo: string | null;
  description?: string;
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;

    fetch(`/back/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  if (!user) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center mt-4 px-4">
        <div className="px-4 sm:px-0 w-full">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-auto p-8">
            <div className="flex flex-col ">
              <div className="flex items-center gap-4">
                <img
                  src={
                    user.photo
                      ? `http://localhost:8000${user.photo}`
                      : defaultPhoto
                  }
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.username}
                  </h2>
                  {user.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {user.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
