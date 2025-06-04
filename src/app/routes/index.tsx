import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import BlogersMakeReviewPage from "../../pages/blogers_make_review-page/BlogersMakeReviewPage.tsx";
import EditProfilePage from "../../pages/edit_profile-page/EditProfilePage.tsx";
import NewPage from "../../pages/new-page/NewPage.tsx";
import SkiGame from "../../pages/ski-game/SkiGame.tsx";
import ArticleCreatePage from "../../pages/article_create-page/ArticleCreatePage.tsx";
import AdminArticlesPage from "../../pages/admin_articles-page/AdminArticlesPage.tsx";
import AdminCommentsPage from "../../pages/admin_comments-page/AdminCommentsPage.tsx";
import AdminBloggersPage from "../../pages/admin_bloggers-page/AdminBloggersPage.tsx";
import AdminReviewsPage from "../../pages/admin_reviews-page/AdminReviewsPage.tsx";
import AdminResortsPage from "../../pages/admin_resorts-page/AdminResortsPage.tsx";
import AdminBloggersReviewsPage from "../../pages/admin_bloggers_reviews-page/AdminBloggersReviewsPage.tsx";
import UserProfilePage from "../../pages/user_profile-page/UserProfilePage.tsx";
import FriendsPage from "../../pages/friends-page/FriendsPage.tsx";
import AdminPage from "../../pages/admin-page/AdminPage.tsx";
import UsersPage from "../../pages/users-page/UsersPage.tsx";
import TripCalendarPage from "../../pages/trip_calendar-page/TripCalendarPage.tsx";
import PrivateRoute from "../../components/PrivateRoute";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
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
        <Route path="/blogger-overview" element={<BlogersMakeReviewPage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/news/create" element={<ArticleCreatePage />} />
        <Route path="/admin/news" element={<AdminArticlesPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/comments" element={<AdminCommentsPage />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
        <Route path="/admin/resorts" element={<AdminResortsPage />} />
        <Route path="/admin/blogger-requests" element={<AdminBloggersPage />} />
        <Route
          path="/admin/blogger-reviews"
          element={<AdminBloggersReviewsPage />}
        />
        <Route path="/users/:userId" element={<UserProfilePage />} />
        <Route path="/profile/friends" element={<FriendsPage />} />
        <Route path="/calendar" element={<TripCalendarPage />} />
        <Route path="/ski-game" element={<SkiGame />} />
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
    </>
  );
}
