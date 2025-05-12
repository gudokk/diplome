import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ui/NewsPage.module.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import News from "../../shared/ui/news/News";

const NewsPage = () => {
  return (
    <div className={styles["news-page"]}>
      <Header></Header>
      <News></News>
      <Footer></Footer>
    </div>
  );
};

export default NewsPage;
