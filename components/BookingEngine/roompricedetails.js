import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import CarousalComponent from "../NewTheme/CarousalComponent"
import RoomDetails from '../NewTheme/Rooms/RoomDetails';
import RoomServices from '../NewTheme/Rooms/RoomServices';
import { english } from '../Languages/Languages';
import { BsFillPeopleFill } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";



function RoomPriceDetails({ setDisplay }) {

    const [selectedRoom, setSelectedRoom] = useState({})
    const [rate, setRate] = useState({})

    useEffect(() => {
        let room = localStorage.getItem("room_data")
        let room_rates = localStorage.getItem("room_rate")
        setSelectedRoom(JSON.parse(room))
        setRate(JSON.parse(room_rates))
    }, [])

    const [lang, setLang] = useState(english)

    function Booknow() {
        return (<><div className='w-full h-full mt-5  pt-4 px-3 flex flex-col gap-2 bg-slate-200 rounded-2xl text-slate-600 font-semibold'>
            <h1 className='text-black-800 text-xl'>Price for {selectedRoom?.room_name}</h1>
            <h2 className='text-red-800 flex gap-2 items-center'>For {selectedRoom?.maximum_number_of_occupants} <BsFillPeopleFill /> Per Night</h2>
            <h2 className='text-blue-900 border-t border-black'>Base Amount: ₹ {rate?.total_final_rate}</h2>
            <h2 className='text-blue-900 border-t border-black '>Tax Amount: ₹ {rate?.total_tax_amount}</h2>
            <h2 className='text-blue-900 border-t border-black '>Other Fees: ₹ {rate?.total_otherfees_amount}</h2>
            <h2 className='text-blue-900 border-t border-black '>Total Price: ₹ {rate?.total_final_rate + rate?.total_otherfees_amount + rate?.total_tax_amount}</h2>
            <div className='border-t-2 border-slate-500  lg:top-24 md:pt-8 relative pt-4'>
                <button onClick={() => { setDisplay(2) }} className='w-full mt-auto px-1 py-2 bg-cyan-700 text-white rounded-md'>
                    Book Now
                </button>
            </div>
        </div></>)
    }


    return (
        <div className="md:block lg:block md:-mx-auto md:mt-8 md:pt-5 md:mb-10 rounded shadow-lg bg-slate-100">

            <div className="flex px-1">

                <div className='flex cursor-pointer pr-10' onClick={() => setDisplay(0)}>
                    <i className='my-auto pl-1'><BiArrowBack size={30} /></i>
                    <span className='my-auto pl-1 font-medium'>Back</span>
                </div>

                <p className=' text-slate-500 font-semibold tracking-wide text-center text-2xl'>{selectedRoom?.room_name} - ({selectedRoom?.room_type?.replaceAll("_", " ")})</p>
                {/* {selectedRoom?.unconditional_rates?.map((resource, index) => {
                        return <p key={index} className="text-lg text-gray-500 font-medium">{resource?.baserate_currency.toUpperCase() + " " + resource?.baserate_amount}</p>
                    })} */}
            </div>

            <p className='py-5 px-3 text-slate-500 tracking-wide text-center'>{selectedRoom.room_description}</p>
            <div className='flex flex-wrap'>
                <div className='lg:w-3/4'>{Object.keys(selectedRoom).includes('room_images') ?
                    <CarousalComponent
                        id="roomPhotos"
                        type='room'
                        data={selectedRoom?.room_images}
                    />
                    : <img className='rounded-md md:m-auto md:w-5/12' src="https://themewagon.github.io/sogo/images/slider-3.jpg" alt="image" />
                }
                </div>
                <div className='my-4 hidden lg:block md:hidden lg:w-1/4 md:w-1/4'><Booknow /></div>
            </div>

            <RoomDetails
                room={selectedRoom}
                lang={lang}
            />

            {Object.keys(selectedRoom).includes("room_facilities") ?
                <RoomServices
                    room={selectedRoom}
                    lang={lang}
                />
                : <></>}
            <div className='block lg:hidden md:block'><Booknow /></div>
        </div>

    )
}

export default RoomPriceDetails