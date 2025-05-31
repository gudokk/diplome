import { useEffect, useState } from "react";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";
import defaultPhoto from "../../assets/account-photo.jpg";

interface User {
  id: number;
  username: string;
  photo: string | null;
  is_friend?: boolean;
}

const FriendsPage = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [outgoing, setOutgoing] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [newRequestCount, setNewRequestCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/back/api/friends/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFriends);

    fetch("/back/api/friends/requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setNewRequestCount(data.length);
      });

    fetch("/back/api/friends/outgoing", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOutgoing);
  }, []);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(
      `/back/api/users/search?query=${encodeURIComponent(search)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    } else {
      alert("Ошибка поиска");
    }
  };

  const handleAddFriend = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/back/api/friends/add/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      //   alert("Заявка отправлена");
      setResults((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert("Не удалось отправить заявку");
    }
  };

  const handleAccept = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/back/api/friends/accept/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((u) => u.id !== id));
      const accepted = requests.find((u) => u.id === id);
      if (accepted) {
        setFriends((prev) => [...prev, accepted]);
      }
      setNewRequestCount((prev) => prev - 1);
    }
  };

  const handleDecline = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/back/api/friends/decline/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((u) => u.id !== id));
      setNewRequestCount((prev) => prev - 1);
    }
  };

  const handleRemoveFriend = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/back/api/friends/remove/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setFriends((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-blue-800">
              Поиск пользователей
            </h2>
            <Link to="/profile" className="text-blue-800 hover:underline">
              ← Назад к профилю
            </Link>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Введите логин"
              className="flex-grow border border-gray-300 rounded-lg p-2"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900"
            >
              Найти
            </button>
          </div>
          {results.length > 0 && (
            <ul className="space-y-2">
              {results.map((u) => (
                <li
                  key={u.id}
                  className="flex text-gray-900 justify-between items-center border p-2 rounded-lg"
                >
                  <Link to={`/users/${u.id}`} className="hover:underline">
                    {u.username}
                  </Link>
                  {u.is_friend ? (
                    <span className="text-blue-800">У вас в друзьях</span>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(u.id)}
                      className="border border-blue-800 text-blue-800 font-bold py-2 px-4 rounded hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    >
                      Добавить в друзья
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="mb-8">
            <h2 className="text-xl text-gray-900 font-semibold mb-4">
              Ваши друзья ({friends.length})
            </h2>
            <div className="flex flex-wrap gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex flex-col items-center w-24 text-center relative"
                >
                  <img
                    src={
                      friend.photo
                        ? `http://localhost:8000${friend.photo}`
                        : defaultPhoto
                    }
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <Link
                    to={`/users/${friend.id}`}
                    className="text-sm text-gray-900 mt-1 hover:underline"
                  >
                    {friend.username}
                  </Link>
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="absolute top-0 right-0 text-xs text-red-600 hover:underline"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl text-gray-900 font-semibold mb-4">
              Заявки в друзья ({requests.length})
            </h2>
            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex text-gray-900 items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        req.photo
                          ? `http://localhost:8000${req.photo}`
                          : defaultPhoto
                      }
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span>{req.username}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl text-gray-900 font-semibold mb-4">
              Исходящие заявки ({outgoing.length})
            </h2>
            <div className="flex flex-wrap gap-4">
              {outgoing.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col text-gray-900 items-center w-24 text-center"
                >
                  <img
                    src={
                      user.photo
                        ? `http://localhost:8000${user.photo}`
                        : defaultPhoto
                    }
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <span className="text-sm mt-1 text-gray-900">
                    {user.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FriendsPage;
