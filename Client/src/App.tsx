import "./App.css";
import { Route, Routes } from "react-router-dom";


import OrderCheckout from "./component/Pay/OderCheckOut";

import Headerticket from "./component/Headerticket/Headerticket";
import RegisterCinema from "./Page/Client/RegisterCinema";
import LoginCinema from "./Page/Client/LoginCinema";
import Dashboard from "./Page/Admin/Dashboard/Dashboard";
import User from "./Page/Admin/User/UserManager";
import ShowtimesManager from "./Page/Admin/Showtimes/ShowtimesManager";
import OrdersManager from "./Page/Admin/Orders/OrdersManager";

import PostsManager from "./Page/Admin/Posts/PostsManager";
import CategoriesManager from "./Page/Admin/Categories/CategoriesManager";
import CountriesManager from "./Page/Admin/Countries/CountriesManager";
import ComboManager from "./Page/Admin/Combo/ComboManager";
import CinemasManager from "./Page/Admin/Cinemas/CinemasManager";
import MoviesManager from "./Page/Admin/Movies/MoviesManager";
import SchedulesManager from "./Page/Admin/Schedules/SchedulesManager";
import RevenueByCinemaManager from "./Page/Admin/RevenueByCinema/RevenueByCinemaManager";
import RevenueByMoviesManager from "./Page/Admin/RevenueByMoviesManager/RevenueByMoviesManager";
import EmailConfirm from "./component/EmailConfirm/EmailConfirm";
import UserAddManager from "./Page/Admin/User/UserAdd";
import Home from "./Page/Home";
import Bookcinematickets from "./Page/Client/Bookcinematickets";
import CinemasFormManager from "./Page/Admin/Cinemas/CinemasForm";
import ComboFormManager from "./Page/Admin/Combo/ComboForm";
import ShowtimesFormManager from "./Page/Admin/Showtimes/ShowtimesForm";
import MoviesManagerForm from "./Page/Admin/Movies/MoviesForm";

import PostsFormManager from "./Page/Admin/Posts/PostForm";
import LichChieu from "./component/MovieDetail/LichChieu";
import DanhGia from "./component/MovieDetail/DanhGia";
import TinTuc from "./component/MovieDetail/TinTuc";
import { ContentMovie } from "./component/MovieDetail/ContentMovie";
import CountriesFormManager from "./Page/Admin/Countries/CountriesForm";
import MoviesAddManager from "./Page/Admin/Movies/MoviesForm";
import CategoriesFormManager from "./Page/Admin/Categories/CategoriesForm";
import MuaVe from "./component/MovieDetail/MuaVe";
import SerachMovies from "./component/SerachMovies/SerachMovies";

import Personal from "./component/PersonalPage/Personal";
import ChangePassword from "./component/PersonalPage/ChangePassword";
import Profile from "./component/PersonalPage/Profile";
import PrivateRoute from "./PrivateRoute";

import MovieShowing from "./component/Movies/MovieShowing";
import SupportCenter from "./component/Support/Support";
import PostDetail from "./component/Post/PostDetail";

import Deponsit from "./component/PersonalPage/Deposit";
import ForgetPass from "./component/Login/ForgetPass";

import AdminLogin from "./component/Admin/Login/LoginAdmin";
import PostDetailManager from "./component/Admin/PostsDasboard/PostDetailManager";

import EarlyMovie from "./component/Movies/EarlyMovie";
import ResetPassword from "./component/Login/ResetPasswod";
import Otp from "./component/Login/Otp";
import NotFound from "./component/NotFoud/NotFound";
import ResetPasswod from "./component/Login/ResetPasswod";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from '../src/server/queryClient'; 

import RoomsManager from "./Page/Admin/Rooms/RoomsManager";
import RoomsFormManager from "./Page/Admin/Rooms/RoomsForm";
import Video from "./component/News/Video";
import FilmNews from "./component/News/FilmNews";





import ActorManager from "./Page/Admin/Actor/ActorManager";
import ActorForm from "./Page/Admin/Actor/ActorForm";
import DirectorManager from "./Page/Admin/Director/DirectorManager";
import DirectorFormManager from "./Page/Admin/Director/DirectorForm";
import UpcomingMovies from "./component/Movies/UpcomingMovies";

// import PageTitleUpdater from "./component/PageTitleUpdater/PageTitleUpdater";

import MethodManager from "./Page/Admin/Method/MethodManager";
import MethodFormManager from "./Page/Admin/Method/MethodForm";
import PromotionsManager from "./Page/Admin/Promotions/PromotionsManager";
import PromotionsFormManager from "./Page/Admin/Promotions/PromotionsForm";
import OrderPage from "./component/Oders/OrderPage";
import OrdersFormManager from "./Page/Admin/Orders/OrdersForm";

import PageTitleUpdater from "./component/PageTitleUpdater/PageTitleUpdater";


import SeatMapManager from "./Page/Admin/SeatMap/SeatMapManager";

import RankManager from "./Page/Admin/Ranks/RankManager";
import RankForm from "./Page/Admin/Ranks/RankForm";

import OrdersDetailManager from "./Page/Admin/Orders/OrdersDetail";
import WebsiteSettingsManager from "./Page/Admin/WebsiteSettings/WebsiteSettingManager";
import ShowtimesAuto from "./Page/Admin/Showtimes/ShowtimesAuto";

import MovieTicket from "./component/PersonalPage/MovieTicket";

import SeatMapFormManager from "./Page/Admin/SeatMap/SeatMapForm";








import Community from "./component/Community/Community";


import Pointaccumulation from "./component/PersonalPage/Pointaccumulation";










import CinemaSeatSelection from "./component/SeatMap/CinemaSeatSelection";
import OrderHistoryApp from "./component/PersonalPage/MovieTicket";

import MovieStatistics from "./component/Admin/MovieStatistics/MovieStatistics";
import MovieStatisticsManager from "./Page/Admin/MovieStatistics/MovieStatisticsManager";
import CinemaInfo from "./component/Cinema/CinemaInfo";
import ThongTinRap from "./component/Cinema/CinemaInfo";
import CityForm from "./component/CityForm/CityForm";
import CinemaList from "./component/Area/CinemaList";
import PaymentSuccess from "./component/PersonalPage/PaymentSuccess";

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
       <PageTitleUpdater/>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/buy-ticket" element={<Bookcinematickets />} />
        <Route path="/orders" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
        <Route path="/pay" element={ <PrivateRoute><OrderCheckout /></PrivateRoute> } />

        <Route path="/community" element={<Community/>} />
        
        <Route path="/seat" element={<CinemaSeatSelection/>} />
        <Route path="/cinemalist" element={<CinemaList/>} />
        <Route path="/cinema/:cinemaId" element={<ThongTinRap/>} />

        <Route path="/payment-success" element={<PaymentSuccess  />} />
        <Route path="/location-cinema" element={<PaymentSuccess  />} />

        <Route path="/cityform" element={<CityForm isVisible={false} onClose={function (): void {
            throw new Error("Function not implemented.");
          } }/>} />
        <Route path="/movie-detail/:slug" element={<ContentMovie />} />
        <Route path="/schedule/:slug" element={<LichChieu />} />
        <Route path="/reviews/:slug" element={<DanhGia />} />
        <Route path="/news/:slug" element={<TinTuc />} />
        <Route path="/buy-now/:slug" element={<MuaVe />} />
        <Route path="/headerticket" element={<Headerticket />} />
        <Route path="/confirm" element={<EmailConfirm />} />
     
        <Route path="/*" element={<NotFound />} />
        <Route path="/movieticket" element={<MovieTicket/>} />
        <Route path="/Pointaccumulation" element={<Pointaccumulation/>} />


        <Route path="/filmnews" element={<FilmNews/>} />
        <Route path="/video" element={<Video />} />
        <Route path="/sp" element={<SupportCenter />} />
        <Route path="/postdetail/:slug" element={<PostDetail />} />

        <Route path="/cinemainfo" element={<CinemaInfo/>} />

        <Route path="/cityform" element={<CityForm isVisible={false} onClose={function (): void {
            throw new Error("Function not implemented.");
          } }/>} />
            <Route path="/cinemalist/:id" element={<CinemaList/>} />

        <Route path="/movie/search/:movie_name" element={<SerachMovies />} />
        <Route path="/profile" element={
            <PrivateRoute>
              <Profile /> 
            </PrivateRoute>
          } />
        <Route path="/Personal" element={<PrivateRoute><Personal /></PrivateRoute>} />
       
 
        <Route path="/ticketcinema" element={ <PrivateRoute><OrderHistoryApp/></PrivateRoute>} />
        <Route path="/ChangePassword" element={ <PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/register" element={<RegisterCinema />} />
        
        <Route path="/login" element={<LoginCinema />} />
        <Route path="/movieshowing" element={<MovieShowing/>} />
        <Route path="/deponsit" element={<Deponsit/>} />
        <Route path="/forgetpass" element={<ForgetPass/>} />
        <Route path="/otp" element={<Otp/>} />
        <Route path="/resetPassword" element={<ResetPasswod/>} />
        <Route path="/upcoming-movies" element={<UpcomingMovies />} />
        <Route path="/movieshowing" element={<MovieShowing />} />
        <Route path="/deponsit" element={<Deponsit />} />
        <Route path="/seat" element={<CinemaSeatSelection />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/earlymovie" element={<EarlyMovie />} />
       
       
        





        {/* Phân quyền cho các route admin */}
        <Route path="/admin" element={<PrivateRoute allowedRoles={['admin','manager','staff']}><AdminLogin/></PrivateRoute>}/>
        <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin','manager']}><Dashboard /></PrivateRoute>} />
        <Route path="/admin/user" element={<PrivateRoute allowedRoles={['admin','manager']}><User /></PrivateRoute>} />
        <Route path="/admin/user/roles" element={<PrivateRoute allowedRoles={['admin','manager']}><UserAddManager /></PrivateRoute>} />
        <Route path="/admin/actor" element={<PrivateRoute allowedRoles={['manager']}><ActorManager/></PrivateRoute>} />
        <Route path="/admin/actor/add" element={<PrivateRoute allowedRoles={['manager']}><ActorForm/></PrivateRoute>} />
        <Route path="/admin/method" element={<PrivateRoute allowedRoles={['admin','manager']}><MethodManager/></PrivateRoute>} />
        <Route path="/admin/method/add" element={<PrivateRoute allowedRoles={['admin','manager']}><MethodFormManager/></PrivateRoute>} />
        <Route path="/admin/method/edit/:id" element={<PrivateRoute allowedRoles={['admin','manager']}><MethodFormManager/></PrivateRoute>} />
        <Route path="/admin/actor/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><ActorForm/></PrivateRoute>} />
        <Route path="/admin/promotions" element={<PrivateRoute allowedRoles={['manager']}><PromotionsManager/></PrivateRoute>} />
        <Route path="/admin/promotions/add" element={<PrivateRoute allowedRoles={['manager']}><PromotionsFormManager/></PrivateRoute>} />
        <Route path="/admin/promotions/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><PromotionsFormManager/></PrivateRoute>} />
        <Route path="/admin/director" element={<PrivateRoute allowedRoles={['manager']}><DirectorManager/></PrivateRoute>} />
        <Route path="/admin/director/add" element={<PrivateRoute allowedRoles={['manager']}><DirectorFormManager/></PrivateRoute>} />
        <Route path="/admin/director/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><DirectorFormManager/></PrivateRoute>} />
        <Route path="/admin/showtimes" element={<PrivateRoute allowedRoles={['manager']}><ShowtimesManager /></PrivateRoute>} />
        <Route path="/admin/showtimes/add" element={<PrivateRoute allowedRoles={['manager']}><ShowtimesFormManager /></PrivateRoute>} />
        <Route path="/admin/showtimesauto/add" element={<PrivateRoute allowedRoles={['manager']}><ShowtimesAuto /></PrivateRoute>} />
        <Route path="/admin/showtimes/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><ShowtimesFormManager /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute allowedRoles={['manager','staff']}><OrdersManager /></PrivateRoute>} />
        <Route path="/admin/ordersdetail/:id" element={<PrivateRoute allowedRoles={['staff','manager']}><OrdersDetailManager /></PrivateRoute>} />
        <Route path="/admin/orders/edit/:id" element={<PrivateRoute allowedRoles={['manager','staff']}><OrdersFormManager /></PrivateRoute>} />
        <Route path="/admin/seat-maps" element={<PrivateRoute allowedRoles={['manager']}><SeatMapManager /></PrivateRoute>} />
        <Route path="/admin/seat-maps/add" element={<PrivateRoute allowedRoles={['manager']}><SeatMapFormManager /></PrivateRoute>} />
        <Route path="/admin/seat-maps/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><SeatMapFormManager /></PrivateRoute>} />
        <Route path="/admin/rank" element={<PrivateRoute allowedRoles={['admin','manager']}><RankManager /></PrivateRoute>} />
        <Route path="/admin/rank/add" element={<PrivateRoute allowedRoles={['admin','manager']}><RankForm /></PrivateRoute>} />
        <Route path="/admin/rank/edit/:id" element={<PrivateRoute allowedRoles={['admin','manager']}><RankForm /></PrivateRoute>} />
        <Route path="/admin/website-settings" element={<PrivateRoute allowedRoles={['admin']}><WebsiteSettingsManager /></PrivateRoute>} />
        <Route path="/admin/website-settings/update/:id" element={<PrivateRoute allowedRoles={['admin']}><WebsiteSettingsManager /></PrivateRoute>} />
        <Route path="/admin//website-settings/reset" element={<PrivateRoute allowedRoles={['admin']}><WebsiteSettingsManager /></PrivateRoute>} />
    
        <Route path="/admin/posts" element={<PrivateRoute allowedRoles={['manager']}><PostsManager /></PrivateRoute>} />
        <Route path="/admin/posts/:postId" element={<PrivateRoute allowedRoles={['manager']}><PostDetailManager /></PrivateRoute>} />
        <Route path="/admin/posts/add" element={<PrivateRoute allowedRoles={['manager']}><PostsFormManager /></PrivateRoute>} />
        <Route path="/admin/posts/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><PostsFormManager /></PrivateRoute>} />
        <Route path="/admin/categories" element={<PrivateRoute allowedRoles={['manager']}><CategoriesManager /></PrivateRoute>} />
        <Route path="/admin/categories/add" element={<PrivateRoute allowedRoles={['manager']}><CategoriesFormManager /></PrivateRoute>} />
        <Route path="/admin/categories/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><CategoriesFormManager /></PrivateRoute>} />
        <Route path="/admin/countries" element={<PrivateRoute allowedRoles={['manager']}><CountriesManager /></PrivateRoute>} />
        <Route path="/admin/countries/add" element={<PrivateRoute allowedRoles={['manager']}><CountriesFormManager /></PrivateRoute>} />
        <Route path="/admin/countries/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><CountriesFormManager /></PrivateRoute>} />
        <Route path="/admin/combo" element={<PrivateRoute allowedRoles={['manager']}><ComboManager /></PrivateRoute>} />
        <Route path="/admin/combo/add" element={<PrivateRoute allowedRoles={['manager']}><ComboFormManager /></PrivateRoute>} />
        <Route path="/admin/combo/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><ComboFormManager /></PrivateRoute>} />

        <Route path="/admin/cinemas" element={<PrivateRoute allowedRoles={['manager','admin']}><CinemasManager /></PrivateRoute>} />
        <Route path="/admin/cinemas/add" element={<PrivateRoute allowedRoles={['manager','admin']}><CinemasFormManager /></PrivateRoute>} />
        <Route path="/admin/cinemas/edit/:id" element={<PrivateRoute allowedRoles={['manager','admin']}><CinemasFormManager /></PrivateRoute>} />
        <Route path="/admin/rooms" element={<PrivateRoute allowedRoles={['manager','admin']}><RoomsManager/></PrivateRoute>} />

        <Route path="/admin/cinemas" element={<PrivateRoute allowedRoles={['admin','manager']}><CinemasManager /></PrivateRoute>} />
        <Route path="/admin/cinemas/add" element={<PrivateRoute allowedRoles={['admin','manager']}><CinemasFormManager /></PrivateRoute>} />
        <Route path="/admin/cinemas/edit/:id" element={<PrivateRoute allowedRoles={['admin','manager']}><CinemasFormManager /></PrivateRoute>} />
        <Route path="/admin/rooms" element={<PrivateRoute allowedRoles={['manager']}><RoomsManager/></PrivateRoute>} />

        <Route path="/admin/rooms/add" element={<PrivateRoute allowedRoles={['manager']}><RoomsFormManager/></PrivateRoute>} />
        <Route path="/admin/rooms/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><RoomsFormManager/></PrivateRoute>} />
        <Route path="/admin/movies" element={<PrivateRoute allowedRoles={['manager','admin']}><MoviesManager /></PrivateRoute>} />
        <Route path="/admin/movies/add" element={<PrivateRoute allowedRoles={['manager']}><MoviesManagerForm /></PrivateRoute>} />
        <Route path="/admin/movies/edit/:id" element={<PrivateRoute allowedRoles={['manager']}><MoviesAddManager /></PrivateRoute>} />
        <Route path="/admin/schedules" element={<PrivateRoute allowedRoles={['admin','manager','staff']}><SchedulesManager /></PrivateRoute>} /> 
        <Route path="/admin/revenuebycinema" element={<PrivateRoute allowedRoles={['admin','manager','staff']}><RevenueByCinemaManager /></PrivateRoute>} />
        <Route path="/admin/moviestatistics/:movieId" element={<PrivateRoute allowedRoles={['admin','manager']}><MovieStatisticsManager/></PrivateRoute>} />
        <Route path="/admin/revenuebymovie" element={<PrivateRoute allowedRoles={['admin','manager','staff']}><RevenueByMoviesManager /></PrivateRoute>} />

        <Route path="/admin/movistatistics" element={<MovieStatistics />} />
      </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;