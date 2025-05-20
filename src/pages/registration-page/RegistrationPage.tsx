import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";

// Интерфейс для данных формы
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Интерфейс для ошибок
interface Errors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationPage = () => {
  // Типизация состояния с использованием интерфейса FormData
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Инициализация состояния ошибок с пустыми строками
  const [errors, setErrors] = useState<Errors>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Обработчик изменения значений формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Обработчик отправки формы

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Отправка формы:", formData);

    const newErrors: Errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email.";
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Пароль должен содержать минимум 8 символов.";
    }

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Пароли не совпадают.";

    setErrors(newErrors);

    // Проверяем: есть ли хоть одна ошибка?
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      console.warn("Ошибки при валидации формы:", newErrors);
      return; // Если ошибки есть, останавливаем отправку
    }

    try {
      const response = await fetch("back/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Регистрация успешна, ID пользователя:", result.userId);
        alert("Регистрация прошла успешно!");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка регистрации:", errorData.detail);

        if (errorData.detail === "Username already exists.") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "Это имя пользователя уже занято.",
          }));
        } else if (errorData.detail === "Email already registered.") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Аккаунт с такой почтой уже существует.",
          }));
        } else {
          // Удали или закомментируй alert:
          // alert("Ошибка регистрации: " + errorData.detail);

          // Вместо этого можно также вывести общее сообщение (опционально):
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: errorData.detail || "Ошибка регистрации",
          }));
        }

        return;
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      alert("Ошибка соединения с сервером!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header></Header>
      <main className="flex-grow flex items-center justify-center">
        <div className="items-center bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-auto mt-12 animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-indigo-800 mb-8">
            Создать аккаунт
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-2">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-indigo-900 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-indigo-900 font-semibold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Уже есть аккаунт?{" "}
            <Link
              to="/authorization"
              className="text-indigo-800 font-semibold hover:text-blue-900 transition-colors duration-300"
            >
              Войти
            </Link>
          </p>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default RegistrationPage;
