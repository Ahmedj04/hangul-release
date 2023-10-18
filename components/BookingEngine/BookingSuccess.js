import React from 'react'

import { AiOutlineClose } from "react-icons/ai";

import { useDispatch, useSelector } from 'react-redux';
import { clearRoomsSelected, setAddMoreRoom } from '../redux/hangulSlice';

function BookingSuccess({ setDisplay, setShowModal, setSearched, rooms, checkinDate, checkoutDate }) {

    let dispatch = useDispatch();

    const roomsSelected = useSelector(state => new Set(state.roomsSelected))
    console.log("this is roomSelected set using redux", roomsSelected)

    // Create an array of rooms that match the room_ids in roomsSelected
    const selectedRoomsArray = rooms.filter((room) => roomsSelected.has(room.room_id));
    console.log("Selected rooms:", selectedRoomsArray);


    // Function to delete room_rates and room_data from local storage
    function deleteRoomDetails() {
        // Remove the room_rates key from local storage
        localStorage.removeItem('room_rates');
        localStorage.removeItem('temp_room_rate');

        // Remove the room_data key from local storage
        localStorage.removeItem('room_data');

        // Remove the room reservation_ids key from local storage
        localStorage.removeItem('reservation_ids');

    }

    return (
        <section className=''>
            {/* app bar */}
            {/* <div className='pt-3'>
                <div className='flex justify-end'>
                    <i className='cursor-pointer my-auto mr-5'
                        onClick={() => {
                            setDisplay(0)
                            setShowModal(0)
                            setSearched(false)
                            dispatch(setAddMoreRoom(false))
                            dispatch(clearRoomsSelected())
                            deleteRoomDetails()
                        }}>
                        <AiOutlineClose color='red' size={20} /> </i>
                </div>
            </div> */}

            <div className='h-screen flex'>
                <div className='my-auto w-6/12'>
                    <div className='pl-32 pr-10 '>
                        <div>
                            <h2 className='text-5xl text-cyan-700'> BOOKING SUCCESSFULL</h2>
                            <p className='pt-8 text-lg'>The hotel booking has been successfully completed for :</p>
                            <div className='pt-5'>
                                <p>{selectedRoomsArray?.map((room, index) => {
                                    return <p key={index} className='text-lg font-medium'>{room?.room_name}</p>
                                })}</p>
                            </div>
                            <div className='flex pt-5'>
                                <div className='pr-20'>
                                    <p> Check-In date</p>
                                    <p className='font-medium text-lg'>{checkinDate}</p>
                                </div>
                                <div>
                                    <p> Check-Out date</p>
                                    <p className='font-medium text-lg'>{checkoutDate}</p>
                                </div>

                            </div>

                            <div className='pt-10'>
                                <button
                                    onClick={() => {
                                        setDisplay(0)
                                        setShowModal(0)
                                        setSearched(false)
                                        dispatch(setAddMoreRoom(false))
                                        dispatch(clearRoomsSelected())
                                        deleteRoomDetails()
                                    }}
                                    className='bg-blue-600 py-3 px-2 text-white rounded-xl'> Go to Home</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-auto w-6/12'>
                    <img src='/payment_done.jpg' className='h-96 mx-auto'></img>
                </div>



            </div>
        </section>
    )
}

export default BookingSuccess