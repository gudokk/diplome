import {useEffect, useState} from "react";
import {Header} from "../../widgets/header/Header";
import {Footer} from "../../widgets/footer/Footer";
import {Link} from "react-router-dom";

interface User {
    id: number;
    username: string;
    email: string;
    registration_date: string;
    description: string;
    gender: string;
    photo: string | null;
    is_blogger: boolean;
    is_active: boolean;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/back/api/admin/users", {
            headers: {Authorization: `Bearer ${token}`},
        });
        const data = await res.json();
        setUsers(data);
    };

    const handleBlock = async (userId: number, isActive: boolean) => {
        const token = localStorage.getItem("token");
        const endpoint = isActive
            ? `/back/api/admin/users/${userId}/block`
            : `/back/api/admin/users/${userId}/unblock`;

        await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        fetchUsers(); // обновить список
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow flex justify-center p-6">
                <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full p-6">
                    <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-black  mb-4">Пользователи</h2>
                    <Link
                        to={`/admin`}
                        className="text-blue-600 border mb-4 border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
                    >
                        Назад к панели администратора
                    </Link>
                    </div>
                    <table className="w-full border text-sm">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-black text-left">ID</th>
                            <th className="p-2 text-black text-left">Username</th>
                            <th className="p-2 text-black  text-left">Email</th>
                            <th className="p-2 text-black  text-left">Дата рег.</th>
                            <th className="p-2 text-black  text-left">Пол</th>
                            <th className="p-2 text-black  text-left">Блогер</th>
                            <th className="p-2 text-black text-left">Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-2 text-black ">{user.id}</td>
                                <td className="p-2 text-black ">{user.username}</td>
                                <td className="p-2 text-black ">{user.email}</td>
                                <td className="p-2 text-black ">{user.registration_date}</td>
                                <td className="p-2 text-black ">{user.gender || "—"}</td>
                                <td className="p-2 text-black ">{user.is_blogger ? "Да" : "Нет"}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleBlock(user.id, user.is_active)}
                                        className={`px-3 py-1 rounded text-white ${
                                            user.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        {user.is_active ? "Заблокировать" : "Разблокировать"}
                                    </button>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer/>
        </div>
    );
}
