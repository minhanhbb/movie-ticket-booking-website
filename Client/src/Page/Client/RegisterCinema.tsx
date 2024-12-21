import React from "react";
import Header from "../../component/Header/Hearder";
import Register from "../../component/Register/Register";
import Footer from "../../component/Footer/Footer";







interface Props {}

const RegisterCinema = (props: Props) => {
  return (
    <>
        <Header />
        <Register/>
        <Footer />
    </>
  )
 
};

export default RegisterCinema;
