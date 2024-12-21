import React from "react";
import Header from "../../component/Header/Hearder";
import MovieBanner from "../../component/Banner/MovieBanner";
import NewsContent from "../../component/NewContent/NewsContent";
import NewsAndReview from "../../component/NewsAndReview/NewsAndReview";
import Footer from "../../component/Footer/Footer";








interface Props {}

const Home = (props: Props) => {
  return (
    <>
        <Header />
        <MovieBanner />
        <NewsContent />
        <NewsAndReview />
        <Footer />
    </>
  )
 
};

export default Home;
