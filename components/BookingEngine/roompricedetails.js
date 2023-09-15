import React, { useState } from 'react';
import Router from 'next/router';
import CarousalComponent from "../../../components/NewTheme/CarousalComponent"
import RoomDetails from '../../../components/NewTheme/Rooms/RoomDetails';
import RoomServices from '../../../components/NewTheme/Rooms/RoomServices';
import { english } from '../../../components/Languages/Languages';
import { BsFillPeopleFill } from "react-icons/bs";
function RoomPriceDetails({ selectedRoom = {
    "room_name": "The Grey Stone",
    "room_type": "King",
    "room_description": "Room with Lake and Mountain View.View Refreshes Guests.",
    "room_capacity": "4",
    "maximum_number_of_occupants": "4",
    "minimum_number_of_occupants": "1",
    "minimum_age_of_occupants": "18",
    "room_length": "20.0",
    "room_width": "20.0",
    "room_height": "12.0",
    "carpet_area": "400.0",
    "room_volume": "4800.0",
    "room_style": "western",
    "is_room_sharing": "private",
    "is_room": "outdoor",
    "status": true,
    "room_facilities": [
        {
            "service_name": "Air_Condition",
            "service_id": "ser0031",
            "service_value": true
        },
        {
            "service_name": "Balcony",
            "service_id": "ser0032",
            "service_value": true
        },
        {
            "service_name": "Bath_And_Toilet",
            "service_id": "ser0025",
            "service_value": true
        },
        {
            "service_name": "Bath_Tub",
            "service_id": "ser0026",
            "service_value": false
        },
        {
            "service_name": "Mobility_Accessible",
            "service_id": "ser0023",
            "service_value": false
        },
        {
            "service_name": "Open_Air_Bath",
            "service_id": "ser0030",
            "service_value": false
        },
        {
            "service_name": "Shower",
            "service_id": "ser0027",
            "service_value": false
        },
        {
            "service_name": "Smoking",
            "service_id": "ser0024",
            "service_value": false
        },
        {
            "service_name": "Toilet_Electric_Bidet",
            "service_id": "ser0028",
            "service_value": false
        },
        {
            "service_name": "Toilet_Mobility_Accessiblity",
            "service_id": "ser0029",
            "service_value": false
        }
    ],
    "room_images": [
        {
            "image_link": "https://res.cloudinary.com/dvczoayyw/image/upload/v1689767373/x0emu0wcrev5w6f5br2w.avif",
            "image_title": "Image For Room",
            "image_id": "img0035",
            "image_description": "Full room image"
        }
    ],
    "unconditional_rates": [
        {
            "un_rate_id": "ura005",
            "baserate_currency": "inr",
            "baserate_amount": 6254,
            "tax_currency": "inr",
            "tax_amount": 1000,
            "otherfees_currency": "inr",
            "otherfees_amount": 330,
            "room_id": "r0012"
        }
    ],
    "beds": [
        {
            "bed_id": "bed008",
            "bed_width": 180,
            "bed_length": 180,
            "unit": "cm",
            "room_id": "r0012"
        }
    ],
    "views": [
        {
            "view_id": "view0017",
            "view": "LakeView",
            "room_id": "r0012"
        },
        {
            "view_id": "view0018",
            "view": "MountainView",
            "room_id": "r0012"
        }
    ]
}, rate = {
    "room_id": "r004",
    "property_id": "t2k004",
    "rate_date": "2023-09-11",
    "final_rate": 1499.0,
    "tax_amount": 248.0,
    "otherfees_amount": 209.0
} }) {

    const [lang, setLang] = useState(english)

    function Booknow(){
        return(<><div className='w-full h-full mt-5  pt-4 px-3 flex flex-col gap-2 bg-slate-200 rounded-2xl text-slate-600 font-semibold'>
        <h1 className='text-black-800 text-xl'>Price for {selectedRoom?.room_name}</h1>
        <h2 className='text-red-800 flex gap-2 items-center'>For {selectedRoom?.maximum_number_of_occupants} <BsFillPeopleFill/> Per Night</h2>
        <h2 className='text-blue-900 border-t border-black '>Base Amount:{rate?.final_rate} Rupees</h2>
        <h2 className='text-blue-900 border-t border-black '>Tax Amount:{rate?.tax_amount} Rupees</h2>
        <h2 className='text-blue-900 border-t border-black '>Other Fees:{rate?.otherfees_amount} Rupees</h2>
        <h2 className='text-blue-900 border-t border-black '>Total Price Per Day:{rate?.final_rate + rate?.otherfees_amount + rate?.tax_amount} Rupees</h2>
        <div className='border-t-2 border-slate-500  lg:top-24 md:pt-8 relative pt-4'>
            <button onClick={()=>{alert('final booking re-direction'); Router.push('./reviewbooking')}} className='w-full mt-auto px-1 py-2 bg-cyan-700 text-white rounded-md'>
            Book Now
        </button>
        </div>
    </div></>)
    }
    return (
        <div className="md:block lg:block md:-mx-auto md:mt-8 md:pt-5 md:mb-10 rounded shadow-lg bg-slate-100">
            <div className="flex justify-between px-5">
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
               <div className='my-4 hidden lg:block md:hidden lg:w-1/4 md:w-1/4'><Booknow/></div>
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
                <div className='block lg:hidden md:block'><Booknow/></div>
        </div>

    )
}

export default RoomPriceDetails