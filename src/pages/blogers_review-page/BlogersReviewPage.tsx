import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ui/BlogersReviewPage.module.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";

const BlogersReviewPage = () => {
  return (
    <div className={styles["blogers-page"]}>
      <Header></Header>
      <Footer></Footer>
    </div>
  );
};

export default BlogersReviewPage;
