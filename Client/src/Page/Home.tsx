import React from "react";

import Header from "../component/Header/Hearder";


import NewsAndReview from "../component/NewsAndReview/NewsAndReview";
import Footer from "../component/Footer/Footer";
import NewsContent from "../component/NewContent/NewsContent";


import {Helmet} from "react-helmet";
import MovieBanner from "../component/Banner/MovieBanner";


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
