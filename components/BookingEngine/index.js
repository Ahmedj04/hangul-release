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

function BookingEngine({ allHotelDetails, rooms, display, setDisplay, checkinDate, checkoutDate }) {

    // const [basicDetails, setBasicDetails] = useState({})

    const [room, setRoom] = useState([])

    const [allRoomRateDetails, setAllRoomRateDetails] = useState([]);

    const [dataAsPerDate, setDataAsPerDate] = useState([]);

    useEffect(() => {
        getRoomDetails()

    }, [])

    useEffect(() => {
        getRatesForTheSelectedDate()
    }, [checkinDate, checkoutDate])

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

    function getRatesForTheSelectedDate() {
        let url2 = `/api/rates/t2k004/${checkinDate}/${checkoutDate}`
        console.log(url2)
        axios.get(url2).then((response) => {
            setDataAsPerDate(response.data)
            console.log("rooms as per date selected loaded successfully")

        }).catch((err) => {
            console.log(JSON.stringify(err))
        })
    }
    
    return (
        <>
            <Title name={`Engage | Booking Engine`} />

            {display === 0 ? <RoomCalenderView color={color} allRoomRateDetails={allRoomRateDetails} dataOfRoomsAsPerDateSelected={dataAsPerDate} rooms={rooms} setDisplay={(e) => setDisplay(e)} checkinDate={checkinDate} checkoutDate={checkoutDate} /> : undefined}
            {display === 1 ? <RoomPriceDetails setDisplay={(e) => setDisplay(e)} /> : undefined}
            {display === 2 ? <Reviewbooking setDisplay={(e) => setDisplay(e)} rooms={rooms}/> : undefined}\
            {display === 3 ? <RoomCalenderView color={color} allRoomRateDetails={allRoomRateDetails} dataOfRoomsAsPerDateSelected={dataAsPerDate} rooms={rooms} setDisplay={(e) => setDisplay(e)} checkinDate={checkinDate} checkoutDate={checkoutDate} /> : undefined}

            {/* {display===3?<payNow/>:undefined}  */}

        </>
    )
}

export default BookingEngine