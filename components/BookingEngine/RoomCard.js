// import { red } from '@mui/material/colors'

import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setRoomsSelected } from '../redux/hangulSlice';

function RoomCard({ filteredRoomData, roomImage, setDisplay, roomRates, checkinDate, checkoutDate }) {

  const dispatch = useDispatch();

  const startDate = new Date(checkinDate); // Booking start date
  const endDate = new Date(checkoutDate); // Booking end date

  // Calculate the number of days for the booking
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const numberOfDays = Math.round((endDate - startDate) / oneDay) + 1; // Add 1 to include the start date

  function redirectToRoom(room_data, room_rates) {
    localStorage.setItem('room_data', JSON.stringify(room_data))
    localStorage.setItem('temp_room_rate', JSON.stringify(room_rates))

    setDisplay(1)
  }

  function redirectToReviewPage(room_data, room_rates) {
    localStorage.setItem('room_data', JSON.stringify(room_data))
    // localStorage.setItem('room_rate', JSON.stringify(room_rates))

    // Get the existing 'room_rate' from local storage
    let existingData = localStorage.getItem('room_rates');

    // Check if there is existing data in local storage
    if (existingData) {
      // Parse the existing data from JSON
      existingData = JSON.parse(existingData);

      // Append the new data to the existing data (assuming 'room_id' is unique)
      existingData[room_rates.room_id] = room_rates;

    } else {
      // If there is no existing data, create a new object with the new data
      existingData = {
        [room_rates.room_id]: room_rates
      };
    }

    console.log("this is existing data", existingData)

    // Store the updated data back in local storage
    localStorage.setItem('room_rates', JSON.stringify(existingData));

    setDisplay(2)
    dispatch(setRoomsSelected([room_rates?.room_id]))
  }


  return (
    <div className=' w-100 h-1/4 text-black border border-gray-500 bg-white rounded-2xl p-4 m-4 flex flex-wrap justify-center items-center lg:flex-row md:flex-row flex-col'>
      <div className='lg:w-1/6 md:w-1/6'>
        <img
          className='lg:h-44 lg:w-44 w-fit'
          src={roomImage}
          alt="room-image" />
      </div>
      <div className='md:w-4/6 lg:w-4/6 w-fit md:px-3'>
        <h3 className='font-bold text-2xl'>{filteredRoomData?.room_name}</h3>
        <p className='text-base text-slate-500 font-semibold'>
          {filteredRoomData?.room_description}
        </p>
      </div>

      <div className='flex flex-col items-center justify-center w-fit lg:w-1/6 md:w-1/6'>
        <div className='py-2'>
          <h3 className='text-3xl font-bold  text-center'>₹ {roomRates.total_final_rate}</h3>
          <p className='text-xs py-1 text-center'>+ tax For {numberOfDays} Days</p>
        </div>


        <button
          onClick={() => {
            redirectToReviewPage(filteredRoomData, roomRates)
          }}
          style={{ fontSize: "14px" }}
          className='px-3 py-2 rounded-md  bg-green-700 hover:bg-green-900 text-white font-bold'
        >
          Book Now
        </button>

        <button
          onClick={() => redirectToRoom(filteredRoomData, roomRates)}
          style={{ fontSize: "11px" }}
          className='mt-2 px-2 py-1 rounded-md  bg-cyan-700 hover:bg-cyan-900 text-white'
        >
          Learn More
        </button>
      </div>


    </div>
  )
}

export default RoomCard