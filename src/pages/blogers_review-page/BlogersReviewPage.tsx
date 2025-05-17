import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ui/BlogersReviewPage.module.css";
import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";

const BlogersReviewPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header></Header>
      <main className="flex-grow flex items-center justify-center"></main>
      <Footer></Footer>
    </div>
  );
};

export default BlogersReviewPage;
