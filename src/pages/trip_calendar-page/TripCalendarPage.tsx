import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ui/TripCalendarPage.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { Link } from "react-router-dom";
import CreateTripForm from "../../shared/ui/сreate_trip-form/CreateTripForm";

interface Trip {
  id: number;
  resort_name: string;
  trip_start_date: string;
  trip_end_date: string;
  description?: string;
  created_by: number;
}

interface User {
  id: number;
  username: string;
  photo: string | null;
}

export default function TripCalendarPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/back/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCurrentUserId(data.id));
  }, []);

  const fetchTrips = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/back/api/trips", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTrips);
  };

  useEffect(fetchTrips, []);

  const isDateInRange = (date: Date, start: string, end: string) => {
    const d = date.setHours(0, 0, 0, 0);
    const s = new Date(start).setHours(0, 0, 0, 0);
    const e = new Date(end).setHours(0, 0, 0, 0);
    return d >= s && d <= e;
  };

  const isPastTrip = (end: string) => {
    return new Date(end).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  };

  const handleDayClick = (value: Date) => {
    const clickedTrip = trips.find((t) =>
      isDateInRange(value, t.trip_start_date, t.trip_end_date)
    );

    if (selectedTrip && clickedTrip && selectedTrip.id === clickedTrip.id) {
      setSelectedTrip(null);
      setParticipants([]);
    } else {
      setSelectedTrip(clickedTrip || null);
      if (clickedTrip) fetchParticipants(clickedTrip);
    }
  };

  const fetchParticipants = async (trip: Trip) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/back/api/trips/${trip.id}/participants`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setParticipants(data);
    } else {
      setParticipants([]);
    }
  };

  const deleteTrip = async (tripId: number) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="text-sm">
            <p>Вы уверены, что хотите удалить поездку?</p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(t.id);
                }}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Да
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  toast.dismiss(t.id);
                }}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Отмена
              </button>
            </div>
          </div>
        ),
        { duration: 10000 }
      );
    });

    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/back/api/trips/${tripId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success("Поездка успешно удалена");
      setSelectedTrip(null);
      fetchTrips();
    } else {
      toast.error("Ошибка при удалении поездки");
    }
  };

  const leaveTrip = async (tripId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/back/api/trips/leave/${tripId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success("Вы отказались от участия в поездке");
      setSelectedTrip(null);
      fetchTrips();
    } else {
      toast.error("Ошибка при выходе из поездки");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center mt-4 px-4">
        <div className="px-4 sm:px-0 w-full">
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex justify-center text-center flex-col">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                  <h2 className="text-xl font-semibold text-blue-800">
                    Календарь поездок
                  </h2>
                  <Link to="/profile" className="text-blue-800 hover:underline">
                    ← Назад к профилю
                  </Link>
                </div>

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

                    {participants.length > 0 && (
                      <div className="mt-3 text-left">
                        <p className="font-medium mb-2 text-blue-700">
                          Участники поездки:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {participants.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center space-x-2 border px-2 py-1 rounded-full bg-white shadow-sm"
                            >
                              <img
                                src={
                                  p.photo
                                    ? `http://localhost:8000${p.photo}`
                                    : "/default-avatar.png"
                                }
                                alt={p.username}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {p.username}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentUserId !== null &&
                    selectedTrip.created_by === currentUserId ? (
                      <button
                        onClick={() => deleteTrip(selectedTrip.id)}
                        className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Удалить поездку
                      </button>
                    ) : (
                      <button
                        onClick={() => leaveTrip(selectedTrip.id)}
                        className="mt-3 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Не поеду
                      </button>
                    )}
                  </div>
                )}

                <Calendar
                  tileClassName={({ date }) => {
                    const match = trips.find((t) =>
                      isDateInRange(date, t.trip_start_date, t.trip_end_date)
                    );
                    if (!match) return null;
                    return isPastTrip(match.trip_end_date)
                      ? "past-trip"
                      : "marked-trip";
                  }}
                  onClickDay={handleDayClick}
                />
              </div>
            </div>
            <CreateTripForm onTripAdded={fetchTrips} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
