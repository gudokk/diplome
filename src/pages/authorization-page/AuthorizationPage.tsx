import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Header} from "../../widgets/header/Header";
import {Footer} from "../../widgets/footer/Footer";

interface FormData {
    username: string;
    password: string;
}

interface Errors {
    username: string;
    password: string;
    form?: string; // для общей ошибки (например, пользователь не найден)
}

const AuthorizationPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState<Errors>({
        username: "",
        password: "",
        form: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Errors = {
            username: "",
            password: "",
            form: "",
        };

        if (!formData.username) newErrors.username = "Введите имя пользователя.";
        if (!formData.password) newErrors.password = "Введите пароль.";

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((error) => error !== "");
        if (hasErrors) return;

        try {
            const response = await fetch("back/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem("token", result.access_token);

                // теперь получим профиль
                const profileRes = await fetch("back/api/profile", {
                    headers: {
                        Authorization: `Bearer ${result.access_token}`,
                    },
                });

                if (profileRes.ok) {
                    const profile = await profileRes.json();
                    if (profile.is_admin) {
                        navigate("/admin");
                    } else {
                        navigate("/profile");
                    }
                } else {
                    console.warn("Не удалось получить профиль");
                    navigate("/profile");
                }

            } else {
                const errorData = await response.json();
                setErrors((prev) => ({...prev, form: errorData.detail}));
            }
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            setErrors((prev) => ({...prev, form: "Ошибка соединения с сервером."}));
        }
    };


    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow flex items-center justify-center">
                <div
                    className="items-center bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-auto mt-12 animate-fade-in">
                    <h2 className="text-2xl font-bold text-center text-indigo-800 mb-8">
                        Войти в аккаунт
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.form && (
                            <p className="text-red-500 text-center text-sm">{errors.form}</p>
                        )}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-indigo-900 font-semibold mb-2"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300"
                                placeholder="Введите имя пользователя"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-2">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-indigo-900 font-semibold mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300"
                                placeholder="Введите пароль"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            Войти
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-6">
                        Нет аккаунта?{" "}
                        <Link
                            to="/registration"
                            className="text-indigo-800 font-semibold hover:text-blue-900 transition-colors duration-300"
                        >
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
};

export default AuthorizationPage;
