import React, { useEffect, useState } from 'react';
import Title from '../../../components/title';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import RoomCard from '../../../components/BookingEngine/RoomCard';
import Color from '../../../components/colors/Color';
import { english } from '../../../components/Languages/Languages';
import Headloader from '../../../components/loaders/headloader';
import Link from 'next/link';
import axios from 'axios';
import Carousel from 'better-react-carousel';

const color = Color?.dark;
let currentLogged;
let language = english;
let visible = 1;

function index() {

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
            console.log("The date from the first array is:", firstDate);
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
    console.log("basic details:- ", basicDetails)


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

    console.log("returning first date ", findingLowestRate())

    return (
        <>
            <Title name={`Engage | Booking Engine`} />
            <Header
                color={Color?.dark}
                Primary={english.Side}
            />
            {/* <Sidebar
                color={Color?.dark}
                Primary={english.Side}
            // Type={currentLogged?.user_type}
            /> */}

            <div
                id="main-content"
                className={`${color?.greybackground} px-4 pt-24 pb-2 relative overflow-y-auto `}
            >
                {/* bread crumb */}
                <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <div
                                className={`${color?.text} text-base font-medium  inline-flex items-center`}
                            >
                                <svg
                                    className="w-5 h-5 mr-2.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                <Link
                                    href={
                                        currentLogged?.id.match(/admin.[0-9]*/)
                                            ? "../admin/adminlanding"
                                            : "./landing"
                                    }
                                    className={`${color?.text} text-base font-medium  inline-flex items-center`}
                                >
                                    <a>{language?.home}</a>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <div
                                    className={`${color?.text} text-base font-medium  inline-flex items-center`}
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <div className={visible === 0 ? "block w-16" : "hidden"}>
                                        <Headloader />
                                    </div>
                                    <div className={visible === 1 ? "block" : "hidden"}>
                                        {" "}
                                        <Link
                                            href="./propertysummary"
                                            className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2"
                                        >
                                            <a>{basicDetails?.property_name}</a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <div
                                    className={`${color?.textgray} text-base font-medium  inline-flex items-center`}
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span
                                        className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  "
                                        aria-current="page"
                                    >
                                        Booking Engine
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ol>
                </nav>


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

                <Carousel cols={10} rows={1} gap={0} autoPlay={false} loop={false}
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
                            cols: 5,
                            rows: 1,
                            gap: 0,
                            loop: false,
                            autoplay: false
                        },
                        {
                            breakpoint: 1020,
                            cols: 6,
                            rows: 1,
                            gap: 0,
                            loop: false,
                            autoplay: false
                        },
                        {
                            breakpoint: 1024,
                            cols: 8,
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


                {console.log("this is selected date ", selectedDate)}

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


                        <RoomCard roomImage={`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                            roomName={`King's Room`}
                            roomDescription={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam quibusdam sed animi saepe reprehenderit? Magnam quibusdam qui libero modi dicta quo omnis temporibus, eum neque?`}
                            roomRate={`2000+ tax and other fees`} />
                        <RoomCard roomImage={`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                            roomName={`King's Room`}
                            roomDescription={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam quibusdam sed animi saepe reprehenderit? Magnam quibusdam qui libero modi dicta quo omnis temporibus, eum neque?`}
                            roomRate={`2000+ tax and other fees`} />
                        <RoomCard roomImage={`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                            roomName={`King's Room`}
                            roomDescription={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam quibusdam sed animi saepe reprehenderit? Magnam quibusdam qui libero modi dicta quo omnis temporibus, eum neque?`}
                            roomRate={`2000+ tax and other fees`} />

                    </div>

                    : <> </>
                }


            </div>

        </>
    )
}

export default index