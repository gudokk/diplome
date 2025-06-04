import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import defaultPhoto from "../../assets/account-photo.jpg";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";
import "../trip_calendar-page/ui/TripCalendarPage.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";

interface User {
  id: number;
  username: string;
  photo: string | null;
  description?: string;
  friend_status?: "friend" | "pending" | "none";
}

interface Trip {
  id: number;
  resort_name: string;
  trip_start_date: string;
  trip_end_date: string;
  description?: string;
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("/back/api/trips", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMyTrips);
  }, []);

  useEffect(() => {
    if (!token || !userId) return;

    fetch(`/back/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        if (data.friend_status === "friend") {
          fetch(`/back/api/trips/${data.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then(setTrips);
        }
      });
  }, [userId]);

  const normalizeDate = (d: string | Date) =>
    new Date(d).toISOString().slice(0, 10);

  const isTripOver = (trip: Trip) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(trip.trip_end_date);
    end.setHours(0, 0, 0, 0);
    return end < today;
  };

  const hasSameTrip = (trip: Trip): boolean => {
    return myTrips.some(
      (t) =>
        t.resort_name === trip.resort_name &&
        normalizeDate(t.trip_start_date) ===
          normalizeDate(trip.trip_start_date) &&
        normalizeDate(t.trip_end_date) === normalizeDate(trip.trip_end_date)
    );
  };

  const handleAddFriend = async () => {
    if (!token || !user) return;

    const res = await fetch(`/back/api/friends/add/${user.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setUser({ ...user, friend_status: "pending" });
    } else {
      toast.error("Ошибка при отправке заявки");
    }
  };

  const handleDayClick = (date: Date) => {
    const trip = trips.find((t) => {
      const start = new Date(t.trip_start_date);
      const end = new Date(t.trip_end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= start && date <= end;
    });

    if (selectedTrip && trip && selectedTrip.id === trip.id) {
      setSelectedTrip(null);
      setParticipants([]);
    } else {
      setSelectedTrip(trip || null);
      if (trip) fetchParticipants(trip);
    }
  };

  const fetchParticipants = async (trip: Trip) => {
    if (!token) return;

    const res = await fetch(`/back/api/trips/${trip.id}/participants`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setParticipants(data);
    }
  };

  const joinTrip = async (tripId: number) => {
    if (!token) return;

    const res = await fetch(`/back/api/trips/join_user/${tripId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok && selectedTrip) {
      toast.success("Вы успешно присоединились к поездке!");
      setMyTrips((prev) => [...prev, selectedTrip]);
    } else {
      const err = await res.json();
      toast.error(err.detail || "Ошибка при присоединении");
    }
  };

  if (!user) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center mt-4 px-4">
        <div className="px-4 sm:px-0 w-full">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-auto p-8">
            <div className="text-right mb-5">
              <Link
                to="/profile/friends"
                className="text-blue-800 hover:underline"
              >
                ← Назад к поиску
              </Link>
            </div>

            <div className="flex flex-col items-center gap-4">
              <img
                src={
                  user.photo
                    ? `http://localhost:8000${user.photo}`
                    : defaultPhoto
                }
                alt=""
                className="w-40 h-40 rounded-full object-cover border"
              />
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">
                  {user.username}
                </h2>
                {user.description && (
                  <p className="text-gray-600 text-lg mt-1">
                    {user.description}
                  </p>
                )}
              </div>

              {user.friend_status === "friend" && (
                <p className="text-green-600 font-medium mt-2">
                  У вас в друзьях
                </p>
              )}
              {user.friend_status === "pending" && (
                <p className="text-yellow-600 font-medium mt-2">
                  Заявка отправлена
                </p>
              )}
              {user.friend_status === "none" && (
                <button
                  onClick={handleAddFriend}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                >
                  Добавить в друзья
                </button>
              )}

              {user.friend_status === "friend" && trips.length > 0 && (
                <div className="mt-6 w-full text-center">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    Календарь поездок {user.username}
                  </h3>

                  <div className="bg-white p-4 rounded-xl shadow-md max-w-md mx-auto">
                    {selectedTrip && (
                      <div className="relative mb-4 mx-auto bg-blue-100 border border-blue-300 rounded-lg p-4 text-blue-800 shadow-md max-w-md">
                        <button
                          className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                          onClick={() => setSelectedTrip(null)}
                        >
                          ✖
                        </button>
                        <p className="font-semibold">Поездка:</p>
                        <p>
                          Курорт: <strong>{selectedTrip.resort_name}</strong>
                        </p>
                        <p>
                          С{" "}
                          {new Date(
                            selectedTrip.trip_start_date
                          ).toLocaleDateString()}{" "}
                          до{" "}
                          {new Date(
                            selectedTrip.trip_end_date
                          ).toLocaleDateString()}
                        </p>
                        {selectedTrip.description && (
                          <p className="mt-2 text-gray-700 italic">
                            {selectedTrip.description}
                          </p>
                        )}

                        {isTripOver(selectedTrip) ? (
                          <p className="mt-2 text-gray-600 italic">
                            Поездка завершена
                          </p>
                        ) : hasSameTrip(selectedTrip) ? (
                          <p className="mt-2 text-green-700 font-medium">
                            Вы уже участвуете в этой поездке
                          </p>
                        ) : (
                          <button
                            onClick={() => joinTrip(selectedTrip.id)}
                            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                          >
                            Присоединиться к поездке
                          </button>
                        )}
                      </div>
                    )}

                    <Calendar
                      onClickDay={handleDayClick}
                      tileClassName={({ date }) => {
                        const d = new Date(date);
                        d.setHours(0, 0, 0, 0);

                        const trip = trips.find((t) => {
                          const start = new Date(t.trip_start_date);
                          const end = new Date(t.trip_end_date);
                          start.setHours(0, 0, 0, 0);
                          end.setHours(0, 0, 0, 0);
                          return d >= start && d <= end;
                        });

                        if (trip) {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const tripEnd = new Date(trip.trip_end_date);
                          tripEnd.setHours(0, 0, 0, 0);
                          return tripEnd < today ? "past-trip" : "marked-trip";
                        }

                        return null;
                      }}
                    />

                    <Tooltip id="trip-tooltip" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
