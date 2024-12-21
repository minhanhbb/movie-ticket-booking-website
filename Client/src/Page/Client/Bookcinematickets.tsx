import React from 'react'
import Header from '../../component/Header/Hearder'

import CinemaSelector from '../../component/CinemaSelector/CinemaSelector'
import Footer from '../../component/Footer/Footer'
import MovieBanner from '../../component/Banner/MovieBanner'



interface Props {
    
}

const Bookcinematickets = (props: Props) => {
    return (
        <div>
            <Header/>
            <MovieBanner/>
            <CinemaSelector/>
            <Footer/>
        </div>
    )
}

export default Bookcinematickets
