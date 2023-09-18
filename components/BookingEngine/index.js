import React, { useEffect, useState } from 'react';
import Title from '../title';
import Header from '../Header';
import Sidebar from '../Sidebar';
import RoomCard from '../BookingEngine/RoomCard';
import Color from '../colors/Color';
import { english } from '../Languages/Languages';
import Headloader from '../loaders/headloader';
import Link from 'next/link';
import axios from 'axios';
import Carousel from 'better-react-carousel';
import RoomCalenderView from './RoomCalenderView';
import RoomPriceDetails from './roompricedetails';
import Reviewbooking from './reviewbooking';

const color = Color?.dark;
let currentLogged;
let language = english;
let visible = 1;

function BookingEngine({ allHotelDetails, rooms }) {

    // const [basicDetails, setBasicDetails] = useState({})
    const [display,setDisplay]=useState(0);

    const[room, setRoom] = useState([])

    const [allRoomRateDetails, setAllRoomRateDetails] = useState([]);

    useEffect(() => {
        getRoomDetails()
    }, [])

    function getRoomDetails() {
        let url = "/api/rates/t2k004";
        axios.get(url)
            .then((response) => {
                setAllRoomRateDetails(response.data)
                console.log("room rate details loaded successfully")

            }).catch((err) => {
                console.log(JSON.stringify(err))
            })
    }
    console.log("room rate details:- ", allRoomRateDetails)
    
    

    
    return (
        <>
            <Title name={`Engage | Booking Engine`} />
            
             {display===0?<RoomCalenderView color={color} allRoomRateDetails={allRoomRateDetails} rooms={rooms} setDisplay={(e)=>setDisplay(e)}/>:undefined}
             {display===1?<RoomPriceDetails setDisplay={(e)=>setDisplay(e)}/>:undefined}
             {display===2?<Reviewbooking setDisplay={(e)=>setDisplay(e)}/>:undefined}
             {/* {display===3?<payNow/>:undefined}  */}

        </>
    )
}

export default BookingEngine