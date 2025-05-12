import { useRef, useState, useEffect } from "react";

interface ResortImage {
  id: number;
  image: string;
}

interface ResortsSliderProps {
  images: ResortImage[];
}

const ResortsSlider = ({ images }: ResortsSliderProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -carouselRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: carouselRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  // отслеживание текущего слайда
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const index = Math.round(
        carouselRef.current.scrollLeft / carouselRef.current.offsetWidth
      );
      setActiveIndex(index);
    };

    const el = carouselRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    carouselRef.current?.scrollTo({
      left: index * carouselRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-6">
      <div className="relative w-full max-w-4xl mx-auto bg-[#d9dde9] p-4 rounded-lg shadow-md overflow-hidden">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {images.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-full snap-center"
              style={{ minWidth: "100%" }}
            >
              <img
                src={`http://localhost:8000${item.image}`}
                alt={`Курорт ${item.id}`}
                className="w-full h-80 sm:h-96 object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>

        {/* Стрелки */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-10">
          <button
            onClick={scrollLeft}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-md"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10">
          <button
            onClick={scrollRight}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-md"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Индикаторы */}
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-3 h-3 rounded-full ${
                activeIndex === index ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResortsSlider;
