import React from 'react'
import Header from '../Header/Hearder'
import Footer from '../Footer/Footer'
import MovieBanner from '../Banner/MovieBanner'



const NotFound = () => {
    return (
       <>
       <Header/>
       <div>
       <div className="banner-movies">
              <h2>Nội dung bạn tìm kiếm không tồn tại!</h2>
              <div className="text-white mt-0 description">
              Hãy thử sử dụng chức năng tìm kiếm để tìm thông tin bạn cần.
              </div>
            </div>
       </div>
       <MovieBanner/>
       <Footer/>
       </>
    )
}

export default NotFound
