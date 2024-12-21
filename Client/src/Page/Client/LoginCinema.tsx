import React from "react";
import Header from "../../component/Header/Hearder";
import Login from "../../component/Login/Login";
import Footer from "../../component/Footer/Footer";







interface Props {}

const LoginCinema = (props: Props) => {
  return (
    <> 
    
        <Header />
        <Login/>
        <Footer />
    </>
  )
 
};

export default LoginCinema;
