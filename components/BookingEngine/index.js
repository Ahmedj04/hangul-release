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

const color = Color?.dark;
let currentLogged;
let language = english;
let visible = 1;

function BookingEngine({allHotelDetails , rooms}) {

    const [basicDetails, setBasicDetails] = useState({})

    const [roomDetails, setRoomDetails] = useState([]);

    const [selectedDate, setSelectedDate] = useState([]);

    useEffect(() => {
        getRoomDetails()
    }, [])

    useEffect(() => {
        findingLowestRate()
        // Check if resultArray has at least one element
        if(findingLowestRate().length > 0){
            const firstDate = findingLowestRate()[0][0];
            setSelectedDate(firstDate)
            // console.log("The date from the first array is:", firstDate);
         } else {
            console.log("The array is empty.");
        }
    }, [roomDetails])

    function getRoomDetails() {
        let url = "/api/rates/t2k004";
        axios.get(url)
            .then((response) => {
                setRoomDetails(response.data)
                console.log("room details loaded successfully")

            }).catch((err) => {
                console.log(JSON.stringify(err))
            })

    }
    console.log("room details:- ", roomDetails)
    // console.log("basic details:- ", basicDetails)


    // Create an object to store room details grouped by rate_date
    const groupedByDate = {};

    const lowestRatesByDate = {};

    function findingLowestRate() {

        // Loop through the roomDetails array
        roomDetails.forEach((room) => {
            const rate_date = room.rate_date;

            // If the rate_date is not in groupedByDate, create an empty array for it
            if (!groupedByDate[rate_date]) {
                groupedByDate[rate_date] = [];
            }
            // Push the room details into the corresponding rate_date array
            groupedByDate[rate_date].push(room);
        });

        // Now, groupedByDate will contain separate arrays for each rate_date
        console.log("grouped by date:- ", groupedByDate);

        // Loop through the grouped data
        for (const rate_date in groupedByDate) {
            const roomsForDate = groupedByDate[rate_date];

            // Find the room with the lowest final_rate for the current date
            const lowestRoom = roomsForDate.reduce((lowest, room) => {
                return room.final_rate < lowest.final_rate ? room : lowest;
            });

            // Store the lowest rate for the current date
            lowestRatesByDate[rate_date] = lowestRoom.final_rate;
        }

        // Now, lowestRatesByDate will contain the lowest rate for each date
        console.log("lowest rate by date:- ", lowestRatesByDate);

        const lowestRatesArray = Object.entries(lowestRatesByDate);

        return lowestRatesArray;
    }

    // console.log("returning first date ", findingLowestRate())

    return (
        <>
            <Title name={`Engage | Booking Engine`} />
            {/* <Header
                color={Color?.dark}
                Primary={english.Side}
            /> */}

            <div
                id="main-content"
                className={`${color?.greybackground} px-4 pt-24 pb-2 relative overflow-y-auto `}
            >
        
                {/* price info */}
                {/* <div className='flex flex-wrap'>
                    {
                        findingLowestRate().map(([date,rate]) => {
                            return <div className='text-white border h-14 w-32 text-center'>
                                <h4 className='font-bold'>{date}</h4>
                                <p>₹ {rate}</p>
                            </div>
                        })
                    }
                </div>
                <br /><br /><br /> */}

                <Carousel cols={9} rows={1} gap={0} autoPlay={false} loop={false}
                    responsiveLayout={[
                        {
                            breakpoint: 480,
                            cols: 5,
                            rows: 1,
                            gap: 0,
                            loop: false,
                            autoplay: false
                        },
                        {
                            breakpoint: 810,
                            cols: 4,
                            rows: 1,
                            gap: 0,
                            loop: false,
                            autoplay: false
                        },
                        {
                            breakpoint: 980,
                            cols: 4,
                            rows: 1,
                            gap: 0,
                            loop: false,
                            autoplay: false
                        },
                        // {
                        //     breakpoint: 1020,
                        //     cols: 4,
                        //     rows: 1,
                        //     gap: 0,
                        //     loop: false,
                        //     autoplay: false
                        // },
                        {
                            breakpoint: 1024,
                            cols: 7,
                            rows: 1,
                            gap: 0,
                            loop: false,
                            autoplay: false
                        },
                        {
                            breakpoint: 1280,
                            cols: 8,
                            rows: 1,
                            gap: 0,
                            loop: false,
                            autoplay: false
                        },
                    ]}
                >
                    {findingLowestRate()?.map(([date, rate], index) => {
                        return (
                            <Carousel.Item key={index} >
                                <div
                                    onClick={() => {
                                        setSelectedDate(date)
                                    }}
                                    className='text-white border h-14 w-32 text-center'>
                                    <h4 className='font-bold text-white'>{date}</h4>
                                    <p>₹ {rate}</p>
                                </div>
                            </Carousel.Item>
                        )
                    })}
                </Carousel>


                {/* {console.log("this is selected date ", selectedDate)} */}

                {/* Basic Details Form */}
                {selectedDate.length != 0 ?
                    <div
                        className={`${color?.whitebackground} shadow rounded-lg px-12  sm:p-6 xl:p-8  2xl:col-span-2`}
                    >
                        <h6
                            className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}
                        >
                            Rooms For Booking
                        </h6>

                        {/* {rooms?.map((room)=>{
                            return <RoomCard roomImage={`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                            roomName={room?.room_name}
                            roomDescription={room?.room_description}
                            roomRate={`2000+ tax and other fees`} />
                        })} */}
                        <RoomCard roomImage={`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                            roomName={`king`}
                            roomDescription={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam quibusdam sed animi saepe reprehenderit? Magnam quibusdam qui libero modi dicta quo omnis temporibus, eum neque?`}
                            roomRate={`2000+ tax and other fees`} />
                            <RoomCard roomImage={`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                            roomName={`king`}
                            roomDescription={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam quibusdam sed animi saepe reprehenderit? Magnam quibusdam qui libero modi dicta quo omnis temporibus, eum neque?`}
                            roomRate={`2000+ tax and other fees`} />
                            <RoomCard roomImage={`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                            roomName={`king`}
                            roomDescription={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam quibusdam sed animi saepe reprehenderit? Magnam quibusdam qui libero modi dicta quo omnis temporibus, eum neque?`}
                            roomRate={`2000+ tax and other fees`} />
                            <RoomCard roomImage={`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                            roomName={`king`}
                            roomDescription={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam quibusdam sed animi saepe reprehenderit? Magnam quibusdam qui libero modi dicta quo omnis temporibus, eum neque?`}
                            roomRate={`2000+ tax and other fees`} />

                       

                    </div>

                    : <> </>
                }


            </div>

        </>
    )
}

export default BookingEngine