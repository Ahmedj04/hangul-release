import React, { useState, useEffect } from 'react';
import CarousalComponent from "../NewTheme/CarousalComponent"
import { ButtonLoader } from './ButtonLoader';

import { english } from '../Languages/Languages';
import { BsFillPeopleFill } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";


import BedIcon from '@mui/icons-material/Bed';
import LandscapeIcon from '@mui/icons-material/Landscape';
import GroupsIcon from '@mui/icons-material/Groups';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

import axios from 'axios';
import formatDateToCustomFormat from '../generalUtility/timeStampMaker'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// redux imports
import { useDispatch, useSelector } from 'react-redux';
import { setRoomsSelected, setAddMoreRoom, clearRoomsSelected, setReserveRoom, setReservationIdentity } from '../redux/hangulSlice';

function RoomDetails2({ setDisplay, setShowModal, setSearched, checkinDate, checkoutDate }) {

  const [searchBookingInventory, setSearchBookingInventory] = useState(false)

  const [selectedRoom, setSelectedRoom] = useState({})
  const [rate, setRate] = useState({})

  const [lang, setLang] = useState(english)

  const dispatch = useDispatch();

  const roomsSelected = useSelector(state => state.roomsSelected)

  useEffect(() => {
    let room = localStorage.getItem("room_data")
    let room_rates = localStorage.getItem("temp_room_rate")
    setSelectedRoom(JSON.parse(room))
    setRate(JSON.parse(room_rates))

  }, []);

  function redirectToReviewPage(room_rates) {

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

    setDisplay(2);
  }

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
    // alert(JSON.stringify(roomdata))
    let url = "/api/reserve_rooms";
    axios.post(url, roomdata).then((response) => {
      // alert(response.data.message)
      toCheckForReservationIdInLocalStorage(response.data.reservation_id, roomId)
      dispatch(setReserveRoom(false))
      setSearchBookingInventory(false)

    }).catch((err) => {
      console.log(err)
    })

  }

  function generateBookingObjects(start_date, end_date, otherData) {
    const bookingObjects = [];
    let currentDate = new Date(start_date); // Start with the start_date

    while (currentDate <= new Date(end_date)) {
      const bookingDate = new Date(currentDate);
      const bookingDateString = bookingDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

      const bookingObject = {
        booking_date: bookingDateString,
        ...otherData
      };

      bookingObjects.push(bookingObject);

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return bookingObjects;
  }


  function Booknow() {
    return (<>
      <div className='flex justify-end'>
        <div className='w-96 h-full mr-3 py-6 px-5 flex flex-col bg-slate-100 shadow-2xl rounded-xl text-slate-600 font-semibold'>
          <h1 className='text-black-900 py-2 text-xl'>Price for {selectedRoom?.room_name}</h1>
          <h2 className='text-red-800 flex gap-2 py-3 items-center text-lg'>For {selectedRoom?.maximum_number_of_occupants} <BsFillPeopleFill /> <span className='text-xs'>Per Night</span></h2>

          <div className='flex justify-between border-t py-3 border-gray-300'><h2 className='text-black'>Base Amount</h2> <span className=''>₹ {rate?.total_final_rate}</span></div>
          <div className='flex justify-between border-t py-3 border-gray-300'><h2 className='text-black'>Tax Amount</h2> <span className=''>₹ {rate?.total_tax_amount}</span></div>
          <div className='flex justify-between border-t py-3 border-gray-300'><h2 className='text-black'>Other Fees</h2> <span className=''>₹ {rate?.total_otherfees_amount}</span></div>
          <div className='flex justify-between text-blue-900 text-xl font-bold border-t py-3 border-gray-300'><h2 className=''>Total Price</h2> <span className=''>₹ {rate?.total_final_rate + rate?.total_otherfees_amount + rate?.total_tax_amount}</span></div>

          <div className='border-t border-gray-300  md:pt-8 relative pt-4'>
            {searchBookingInventory === true ?
              <ButtonLoader
                classes="w-full mt-auto px-1 py-2 bg-green-700 hover:bg-green-900 text-white rounded-md"
                text="Book Now"
              /> :
              <button
                className='w-full mt-auto px-1 py-2 bg-green-700 hover:bg-green-900 text-white rounded-md'
                onClick={() => {
                  setSearchBookingInventory(true)
                  redirectToReviewPage(rate)
                  dispatch(setRoomsSelected([selectedRoom?.room_id]))

                  let reservationIdentity = {
                    room_id: selectedRoom?.room_id,
                    reservation_time: formatDateToCustomFormat(new Date())
                  }
                  dispatch(setReservationIdentity([reservationIdentity]))

                  reserveRoom({
                    // "reserve_rooms": generateBookingObjects(checkinDate, checkoutDate, { "room_id": selectedRoom?.room_id, "room_count": 1, "reservation_time": formatDateToCustomFormat(new Date()) })
                    "reserve_rooms": generateBookingObjects(checkinDate, checkoutDate, { "room_count": 1, ...reservationIdentity })
                  }, selectedRoom?.room_id)

                  dispatch(setReserveRoom(true))
                }}
              >
                Book Now
              </button>
            }

          </div>
        </div>
      </div>

    </>)
  }
  return (
    <section>

      {/* app bar */}
      <div className='flex justify-between pt-3'>
        <div className='flex cursor-pointer pr-10' onClick={() => { setDisplay(0) }}>
          <i className='my-auto pl-1'><BiArrowBack size={30} /></i>
          <span className='my-auto pl-1 font-medium'>Back</span>
        </div>

        <div className='my-auto mr-10 text-base italic flex gap-10'>
          {/* <p className='my-auto'>Available Inventory: {inventory_available}</p> */}
          <i className='cursor-pointer'
            onClick={() => {
              if (roomsSelected.length === 0) {
                toast.error("APP: Cart is Empty.");
              } else {
                setDisplay(2)
              }
            }}> <AiOutlineShoppingCart color='black' size={20} /> </i>
          <i className='cursor-pointer my-auto'
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
      </div>

      {/* room details div */}
      <div className='px-20 flex'>
        {/* left div */}
        <div className='w-7/12'>
          {/* brief property overview div */}
          <div className=' mt-5 mb-12'>
            <h1 className='text-4xl text-black'>{selectedRoom?.room_name}</h1>
            <div className='mt-6'>
              <ul className='flex gap-10'>
                <li className='text-slate-500 pb-2'><SquareFootIcon /> &nbsp; {selectedRoom.carpet_area} SQ.FT</li>
                <li className='text-slate-500 pb-2'><GroupsIcon />  &nbsp; {selectedRoom.room_capacity} Adults</li>
                <li className='text-slate-500 pb-2'>{selectedRoom?.views?.map((item, index) => {
                  return (
                    <span key={index} >{index === 0 ? <LandscapeIcon /> : ','} &nbsp; {item?.view}  </span>
                  );
                })}</li>
                {Object.keys(selectedRoom).includes("beds") ?
                  <li className='text-slate-500 pb-2'><BedIcon /> &nbsp; {selectedRoom.beds.length} {selectedRoom.beds.length > 1 ? "Beds" : "Bed"} <span> ({selectedRoom?.beds?.map((item, index) => {
                    return (
                      <span key={index}>{index === 0 ? '' : ' , '} {item?.bed_width} * {item?.bed_length}</span>

                    );
                  })}) cm</span>
                  </li> : <></>}
              </ul>
            </div>
          </div>

          {/* room pictures div */}
          <div className='lg:w-full'>{Object.keys(selectedRoom).includes('room_images') ?
            <CarousalComponent
              id="roomPhotos"
              type='room'
              data={selectedRoom?.room_images}
            />
            : <img className='rounded-md md:m-auto md:w-9/12' src="https://themewagon.github.io/sogo/images/slider-3.jpg" alt="image" />
          }
          </div>

          {/* room description */}
          <div>
            <p className='pt-10 pb-5 px-3 text-slate-800 leading-7 tracking-wide text-left'>{selectedRoom.room_description}</p>
          </div>

          {/* room amenities div */}
          <div>
            <div className='mb-5'>
              <div className='mt-10 mb-2'>
                <h4 className='text-3xl text-black font-light'>Room Amenities</h4>
              </div>
              {Object.keys(selectedRoom).includes("room_facilities") ?
                <div className="grid grid-flow-row-dense px-5 pt-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-3">
                  {selectedRoom?.room_facilities?.map((item, index) => {
                    return (
                      <span className='text-gray-700' key={index}>
                        {/* &#10004 is code for tick mark  */}
                        <span>&#10004;
                          {item?.service_name.replaceAll("_", " ")}
                        </span>
                      </span>
                    );
                  })}
                </div>
                : <></>}
            </div>
          </div>

        </div>

        {/* right div with price details */}
        <div className='w-5/12'>
          <div className='my-36 hidden lg:block md:hidden lg:w-full md:w-full'><Booknow /></div>

        </div>
      </div>

    </section>
  )
}

export default RoomDetails2