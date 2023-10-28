// import { red } from '@mui/material/colors'

import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setRoomsSelected, setReserveRoom, addInventoryDetail } from '../redux/hangulSlice';
import axios from 'axios';
import formatDateToCustomFormat from '../generalUtility/timeStampMaker'

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


  // get inventory details for the rooms between the checkin and checkout date
  function getInventoryDetail() {
    let roomID = roomRates?.room_id;
    let url = `/api/inv_data/${roomID}/${checkinDate}/${checkoutDate}`;
    axios.get(url).then((response) => {
      // setting value to inventory detail using redux reducer function
      dispatch(addInventoryDetail(response.data))
      console.log("inventory data loaded successfully")
    }).catch((err) => {
      console.log("error in loading inventory data", err)
    })
  }

  function toCheckForReservationIdInLocalStorage(reservation_id, roomId) {
    // Get the existing 'reservation_id's' from local storage
    let existingData = localStorage.getItem('reservation_ids');

    // Check if there is existing data in local storage
    if (existingData) {
      // Parse the existing data from JSON
      existingData = JSON.parse(existingData);

      // Update the reservation ID for the specific room ID
      existingData[roomId] = reservation_id;

    } else {
      // If there is no existing data, create a new object with the new data
      existingData = {
        // [reservation_id]: 'reservation_id'
        [roomId]: reservation_id
      };
    }

    console.log("this is reservation data", existingData)

    // Store the updated data back in local storage
    localStorage.setItem('reservation_ids', JSON.stringify(existingData));
  }

  function reserveRoom(roomdata, roomId) {
    let url = "/api/reserve_rooms";
    axios.post(url, roomdata).then((response) => {
      // alert(response.data.message)
      // alert(response.data.reservation_id)
      toCheckForReservationIdInLocalStorage(response.data.reservation_id, roomId)
      dispatch(setReserveRoom(false))

    }).catch((err) => {
      console.log(err)
    })

  }

  console.log(roomRates)


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
            reserveRoom({ "reserve_rooms": [{ "room_id": roomRates?.room_id, "room_count": 1, "reservation_time": formatDateToCustomFormat(new Date()) }] }, roomRates?.room_id)
            dispatch(setReserveRoom(true))
            getInventoryDetail()

          }}
          style={{ fontSize: "14px" }}
          className='px-3 py-2 rounded-md  bg-green-700 hover:bg-green-900 text-white font-bold'
        >
          Book Now
        </button>

        <button
          onClick={() => {
            redirectToRoom(filteredRoomData, roomRates)
            getInventoryDetail()
          }}
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