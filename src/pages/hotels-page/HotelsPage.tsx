import { useParams, Link } from "react-router-dom";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import HotelsCards from "../../shared/ui/hotels-cards/HotelsCards";

const HotelsPage = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white border rounded-lg shadow-sm w-full max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center p-6">
            <h1 className="text-4xl font-bold text-black">Отели</h1>
            {id && (
              <Link
                to={`/resorts/${id}`}
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
              >
                Назад к курорту
              </Link>
            )}
          </div>
          <div className="h-1 max-w-6xl bg-black mb-10 mx-auto" />
          <HotelsCards></HotelsCards>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelsPage;
