// EditProfilePage.tsx
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Header} from "../../widgets/header/Header";
import {Footer} from "../../widgets/footer/Footer";

interface UserData {
    username: string;
    email: string;
    description: string;
    gender: string;
    photo: string | null;
}

const EditProfilePage = () => {
    const [formData, setFormData] = useState<UserData>({
        username: "",
        email: "",
        description: "",
        gender: "",
        photo: null,
    });
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("/back/api/profile", {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => setFormData(data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const form = new FormData();
        form.append("username", formData.username);
        form.append("email", formData.email);
        form.append("description", formData.description);
        form.append("gender", formData.gender);
        if (file) form.append("photo", file);

        await fetch("/back/api/profile/update", {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`},
            body: form,
        });

        navigate("/profile");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow flex items-center justify-center">
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto p-8 transition-all duration-300 animate-fade-in">

                    <h2 className="text-2xl font-bold text-black mb-6">Редактирование профиля</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-gray-600">Логин</p>
                        <input name="username" value={formData.username} onChange={handleChange} placeholder="Имя"
                               className="w-full p-2 border rounded"/>
                        <p className="text-gray-600">Email</p>
                        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email"
                               className="w-full p-2 border rounded"/>
                        <p className="text-gray-600">Описание</p>
                        <textarea name="description" value={formData.description} onChange={handleChange}
                                  placeholder="Описание" className="w-full p-2 border rounded"/>
                        <p className="text-gray-600">Пол</p>
                        <select name="gender" value={formData.gender} onChange={handleChange}
                                className="w-full p-2 border rounded">
                            <option value="">Не указан</option>
                            <option value="Мужской">Мужской</option>
                            <option value="Женский">Женский</option>
                        </select>
                        <p className="text-gray-600">Загрузить изображение</p>
                        <input type="file" onChange={handleFileChange} className="w-full"/>
                        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Сохранить</button>
                    </form>
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
};

export default EditProfilePage;
