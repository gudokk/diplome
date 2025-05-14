import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ui/ResortsPage.module.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import ResortsMap from "../../shared/ui/resorts-map/ResortsMap";
import SearchBar from "../../shared/ui/search-bar/SearchBar";
import ResortsList from "../../shared/ui/resorts-list/ResortsList";
import ResortsQuickSearch from "../../shared/ui/resorts-quick-search/ResortsQuickSearch";

const ResortsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className={styles["resorts-page"]}>
      <Header></Header>
      <section className=" sm:py-10 bg-[#d9dde9] ">
        <ResortsQuickSearch></ResortsQuickSearch>
        <ResortsMap />
      </section>

      <div className="wave-divider">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[#d9dde9]"
          />
        </svg>
      </div>

      <section className="py-1 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <div className="text-3xl font-extrabold leading-tight text-black mb-5">
            Все курорты России
          </div>
          <SearchBar onSearch={setSearchQuery} />
          <ResortsList searchQuery={searchQuery} />
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
};

export default ResortsPage;
