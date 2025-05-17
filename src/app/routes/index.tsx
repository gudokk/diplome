import { Routes, Route } from "react-router-dom";
import MainPage from "../../pages/main-page/MainPage.tsx";
import RegistrationPage from "../../pages/registration-page/RegistrationPage.tsx";
import AuthorizationPage from "../../pages/authorization-page/AuthorizationPage.tsx";
import ProfilePage from "../../pages/profile-page/ProfilePage.tsx";
import NewsPage from "../../pages/news-page/NewsPage.tsx";
import ResortsPage from "../../pages/resorts-page/ResortsPage.tsx";
import HotelsPage from "../../pages/hotels-page/HotelsPage.tsx";
import ResortPage from "../../pages/resort-page/ResortPage.tsx";
import ReviewsPage from "../../pages/reviews-page/ReviewsPage.tsx";
import ReviewsFormPage from "../../pages/reviews_form-page/ReviewsFormPage.tsx";
import ResortsSelectorPage from "../../pages/resorts_selector-page/ResortsSelectorPage.tsx";
import BlogersReviewPage from "../../pages/blogers_review-page/BlogersReviewPage.tsx";
import NewPage from "../../pages/new-page/NewPage.tsx";
import PrivateRoute from "../../components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/authorization" element={<AuthorizationPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/resorts" element={<ResortsPage />} />
      <Route path="/resorts/:id" element={<ResortPage />} />
      <Route path="/resorts/:id/hotels" element={<HotelsPage />} />
      <Route path="/resorts/:id/reviews" element={<ReviewsPage />} />
      <Route path="/resorts/:id/review-form" element={<ReviewsFormPage />} />
      <Route path="/resorts/selector" element={<ResortsSelectorPage />} />
      <Route path="/blogers_reviews" element={<BlogersReviewPage />} />
      <Route path="/news/:id" element={<NewPage />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
