import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";

interface Resort {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const ResortsMap = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);

  useEffect(() => {
    fetch("back/api/resorts")
      .then((res) => res.json())
      .then((data) => setResorts(data));
  }, []);

  return (
      <div className="w-full px-4 sm:px-6 max-w-7xl mx-auto h-[500px] mb-10">
    {/*// <div*/}
    {/*//   id="map-container"*/}
    {/*//   style={{*/}
    {/*//     width: "64em",*/}
    {/*//     height: "32em",*/}
    {/*//     margin: "0 auto",*/}
    {/*//   }}*/}
    {/*// >*/}
      <YMaps
        query={{
          apikey: "df26c33f-b6e4-4442-bc85-0c1c3461ed2a",
          lang: "ru_RU",
        }}
      >
        <Map
          defaultState={{ center: [55, 37], zoom: 4 }}
          style={{ width: "100%", height: "100%" }} // карта на весь контейнер
        >
          {resorts.map((resort) => (
            <Placemark
              key={resort.id}
              geometry={[resort.latitude, resort.longitude]}
              properties={{
                balloonContent: `
      <a href="/resorts/${resort.id}" style="color: #1E90FF; text-decoration: underline;">
        ${resort.name}
      </a>
    `,
                hintContent: resort.name,
              }}
              options={{
                balloonPanelMaxMapArea: 0,
              }}
              modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
            />
          ))}
        </Map>
      </YMaps>
    </div>
  );
};

export default ResortsMap;
