import { red } from '@mui/material/colors'
import React from 'react'

function RoomCard({ filteredRoomData, roomImage, setDisplay, roomRates }) {
  
  function redirectToRoom(room_data, room_rates) {
    localStorage.setItem('room_data', JSON.stringify(room_data))
    localStorage.setItem('room_rate', JSON.stringify(room_rates))

    setDisplay(1)
  }

  return (
    <div className=' w-100 h-1/4 border border-white rounded-2xl p-4 m-4 flex flex-wrap justify-center items-center bg-gray-800 text-white lg:flex-row md:flex-row flex-col'>
      <div className='lg:w-1/6 md:w-1/6'>
        <img
          className='lg:h-44 lg:w-44 w-fit'
          src={roomImage}
          alt="room-image" />
      </div>
      <div className='md:w-4/6 lg:w-4/6 w-fit md:px-3'>
        <h3 className='font-bold text-2xl'>{filteredRoomData?.room_name}</h3>
        <p className='text-base font-semibold'>
          {filteredRoomData?.room_description}
        </p>
      </div>

      <div className='flex flex-col items-center justify-center w-fit lg:w-1/6 md:w-1/6'>
        <button
          onClick={() => redirectToRoom(filteredRoomData, roomRates)}
          className='px-4 py-2 bg-cyan-700 hover:bg-cyan-900 text-white'
        >Learn More</button>
        <h3 className='text-sm py-2'>{roomRates.final_rate}+ tax and other fees</h3>
      </div>


    </div>
  )
}

export default RoomCard