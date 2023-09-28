import React, { useState, useEffect } from 'react';
import InputText from '../utils/InputText';
import Color from '../colors/Color';
import Modal from "../NewTheme/modal";
import { RxCross2 } from "react-icons/rx";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";


// redux libraries
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { removeRoomFromSelected, clearRoomsSelected, setAddMoreRoom } from '../redux/hangulSlice';


function Reviewbooking({ setDisplay, rooms, setShowModal, setSearched}) {

    let guestTemplate = {
        "guest_name": "",
        "guest_email": "",
        "phone_number": ""
    }
    const [error, setError] = useState({})
    const [guest, setGuest] = useState([{ ...guestTemplate, index: 0 }]);
    // const [guest, setGuest] = useState([guestTemplate]?.map((i, id) => { return { ...i, index: id } }))
    const [addGst, setAddGst] = useState(false);
    const [gstDetails, setGstDetails] = useState({ "registation_number": "", "company_name": "", "company_address": "" })
    const [addNewUser, setAddNewUser] = useState(0)
    const [guestIndex, setGuestIndex] = useState(0)


    const [rate, setRate] = useState({})
    const [selectedRoom, setSelectedRoom] = useState({})


    const roomsSelected = useSelector(state => new Set(state.roomsSelected))
    console.log("this is roomSelected array using redux", roomsSelected)

    // Create an array of rooms that match the room_ids in roomsSelected
    const selectedRoomsArray = rooms.filter((room) => roomsSelected.has(room.room_id));
    console.log("Selected rooms:", selectedRoomsArray);

    const inventoryDetail = useSelector(state => state.inventoryDetail)
    // console.log("available inventory using  redux :", inventoryDetail)

    let inventory_available = inventoryDetail?.[0]?.inventory_available;

    const dispatch = useDispatch();

    useEffect(() => {
        let room = localStorage.getItem("room_data")
        let room_rates = localStorage.getItem("room_rate")
        setSelectedRoom(JSON.parse(room))
        setRate(JSON.parse(room_rates))
    }, [])

    // to add guest in ui view 
    const addGuest = () => {
        setGuestIndex(guestIndex + 1);
        setGuest([...guest, { ...guestTemplate, index: guestIndex + 1 }])
    }

    // to handle changes in data
    const handleChangeInGuest = (e, index, i) => {
        setGuest(guest?.map((item, id) => {
            if (item.index === index) {
                item[i] = e.target.value
            }
            return item
        }))
    }

    // to remove guest from ui
    const removeGuest = (indexToRemove) => {
        const updatedGuests = guest.filter((i, index) => i.index !== indexToRemove);
        setGuest(updatedGuests); //list of guest not removed
    };

    // ui of add gst form 
    function AddGstForm() {
        return (<><div className="flex flex-wrap border-2 border-white rounded-xl p-2 m-2">
            {/* GST Registration Number  */}
            <InputText
                label={'GST Registration Number'}
                visible={1}
                defaultValue={``}
                onChangeAction={(e) =>
                    setGstDetails({ ...gstDetails, registation_number: e.target.value })
                }
                error={error?.guest_phone}
                color={Color?.light}
                req={true}
                title={'registration number'}
                tooltip={true}
            />

            {/* Registered company name  */}
            <InputText
                label={'Registered Company Name'}
                visible={1}
                defaultValue={``}
                onChangeAction={(e) =>
                    setGstDetails({ ...gstDetails, company_name: e.target.value })
                }
                error={error?.guest_phone}
                color={Color?.light}
                req={true}
                title={'name of company'}
                tooltip={true}
            />
            {/* Registered company address  */}
            <InputText
                label={'Registered Company Address'}
                visible={1}
                defaultValue={``}
                onChangeAction={(e) =>
                    setGstDetails({ ...gstDetails, company_address: e.target.value })
                }
                error={error?.guest_phone}
                color={Color?.light}
                req={true}
                title={'Address of company'}
                tooltip={true}
            />


        </div></>)
    }


    return (
        <div className='min-h-screen'>
            
            {/* app bar  */}
            <div className='flex py-5 border-b-2  bg-slate-100'>
                <div className='flex cursor-pointer pl-2 pr-10 my-auto' onClick={() => setDisplay(1)}>
                    <i className='my-auto'><BiArrowBack size={30} /></i>
                    <span className='my-auto pl-1 font-medium'>Back</span>
                </div>

                <div className='flex justify-between w-full'>
                    <h1 className='text-xl my-auto font-bold'>Review Booking</h1>
                    <i className='cursor-pointer my-auto mr-5'
                        onClick={() => {
                            setDisplay(0)
                            setShowModal(0)
                            setSearched(false)
                            dispatch(setAddMoreRoom(false))
                            dispatch(clearRoomsSelected())
                        }}>
                        <AiOutlineClose color='red' size={20} /> </i>
                </div>
            </div>

            <div id="main-content" className='h-fit text-white flex flex-wrap justify-around gap-2 mx-4 mt-10'>

                {/* left side div  */}
                <div id="guest-detail-review" className='bg-white border border-gray-300 text-black h-fit w-full lg:w-6/12  rounded-2xl'>
                    
                    {/* rooms summary section */}
                    <div className=' border-b-2 border-gray justify-start mt-2 p-4'>
                        <div className='flex justify-between'>
                            <h6 className={`text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
                                Rooms Summary
                            </h6>
                            <button
                                className='my-2 ml-auto px-4 py-1 bg-cyan-700 hover:bg-cyan-900 rounded-md text-white'
                                onClick={() => {
                                    setDisplay(0);
                                    dispatch(setAddMoreRoom(true))
                                }}

                            >Add More Rooms</button>

                        </div>

                        <table className='mx-4 w-full' cellPadding={15}>
                            <thead>
                                <th className='text-start'>Room Name</th>
                                <th className='text-start'>Room Type</th>
                                <th className='text-start'>Number Of Rooms</th>

                            </thead>

                            {selectedRoomsArray?.map((room, index) => {
                                return <tr key={index}>
                                    <td>{room?.room_name}</td>
                                    <td>{room?.room_type}</td>
                                    <td className=' text-black '>
                                        <select
                                            className=' pl-3 pr-10'
                                        // value={room?.selectedQuantity || 1}
                                        // onChange={(e) => {
                                        //     const selectedQuantity = parseInt(e.target.value);
                                        //     // You can handle the selected quantity here as needed
                                        //     // For example, you can update it in your state or dispatch an action
                                        // }}
                                        >
                                            {/* Generate options for the dropdown based on inventory_available */}
                                            {Array.from({ length: inventory_available || 1 }, (_, index) => index + 1).map((quantity) => (
                                                <option key={quantity} value={quantity}>
                                                    {quantity}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className='text-red-800 '>
                                        <button
                                            className="text-white bg-red-500 border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded text-md"
                                            onClick={() => {
                                                dispatch(removeRoomFromSelected(room?.room_id))
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                />
                                            </svg>
                                        </button></td>
                                </tr>
                            })}
                        </table>
                    </div>

                    {/* guests summary section */}
                    <div className='flex justify-start mt-2 p-4'>
                        <h6
                            className={` text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}
                        >
                            Guest Details
                        </h6>
                        <button onClick={() => { addGuest() }} className='ml-auto px-4 py-1 bg-cyan-700 hover:bg-cyan-900 rounded-md text-white'>Add Guests</button>

                    </div>
                    <div className="pt-6">
                        <div className="md:px-4 mx-auto w-full">

                            {guest.map((i, loopIndex) => (
                                <div className='border-2 border-white rounded-xl p-2 m-2' key={i.index}>
                                    {loopIndex != 0 ? <div className='flex justify-end'><button onClick={() => removeGuest(i.index)}><RxCross2 /></button></div> : <></>}
                                    <div className="flex flex-wrap ">

                                        {/* guest name  */}
                                        <InputText
                                            label={'Guest Name'}
                                            visible={1}
                                            defaultValue={``}
                                            onChangeAction={(e) => {
                                                handleChangeInGuest(e, i.index, "guest_name")
                                            }
                                            }
                                            error={error?.guest_name}
                                            color={Color?.light}
                                            req={true}
                                            title={'Guest Name'}
                                            tooltip={true}
                                        />

                                        {/* guest email  */}
                                        <InputText
                                            label={'Guest Email'}
                                            visible={1}
                                            defaultValue={``}
                                            onChangeAction={(e) =>
                                                handleChangeInGuest(e, i.index, "guest_email")
                                            }
                                            error={error?.guest_email}
                                            color={Color?.light}
                                            req={true}
                                            title={'Guest email'}
                                            tooltip={true}
                                        />

                                        {/* guest phone  */}
                                        <InputText
                                            label={'Guest Phone'}
                                            visible={1}
                                            defaultValue={``}
                                            onChangeAction={(e) =>
                                                handleChangeInGuest(e, i.index, "guest_phone")
                                            }
                                            error={error?.guest_phone}
                                            color={Color?.light}
                                            req={true}
                                            title={'Guest Phone'}
                                            tooltip={true}
                                        />
                                    </div>
                                </div>

                            ))}
                            <input type="checkbox" name="add_gst" onClick={() => setAddGst(!addGst)} />
                            <span className='font-semibold text-base mx-2'>Add GST Details (optional)</span>
                            {addGst === true ? <AddGstForm /> : <></>}

                        </div>
                        
                        {/* buttons  */}
                        <div className='flex flex-wrap w-full gap-2 p-2'>
                            <button className='my-2 px-4 py-3 bg-green-700 hover:bg-green-900 rounded-md text-white w-full'>Submit</button>
                        </div>
                    </div>



                </div>

                {/* right side div  */}
                <div id="price-breakup" className='border border-gray-300 bg-white p-4 text-black h-fit w-full lg:w-4/12  rounded-2xl' >
                    <div className='border-b border-gray rounded-lgg w-full h-1/2 my-2'>
                        <h1 className="font-extrabold p-2 text-xl">Price Breakup</h1>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5 font-semibold'>1 Room x for 1 Night<br /> <div className='text-sm font-normal px-3'>base price</div></div> <div className='mx-2 flex justify-end w-full'>₹ {rate?.total_final_rate}</div></div>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5 font-semibold'>Taxes</div> <div className='mx-2 flex justify-end w-full'>₹ {rate?.total_tax_amount}</div></div>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5 font-semibold'>Other Fees</div> <div className='mx-2 flex justify-end w-full'>₹ {rate?.total_otherfees_amount}</div></div>
                        <div className='flex  items-start my-4  border-b-2'> <div className='p-2 w-4/5 font-semibold'>Coupon Discounts</div> <div className='mx-2 flex justify-end w-full'>200.00 Rupees</div></div>
                        <div className='flex justify-start items-start my-4'> <div className='p-2 w-4/5 font-bold'>Total Amount To Be Paid</div> <div className='mx-2 flex justify-end w-full text-2xl font-bold'>₹ {rate?.total_final_rate + rate?.total_otherfees_amount + rate?.total_tax_amount}</div></div>
                    </div>
                    <div className='border border-gray rounded-lg w-full h-1/2 my-2 py-2 px-4'>
                        <h2 className='h-12 w-fit mx-3 p-2 font-semibold'>Coupon Codes</h2>
                        <input className='my-1 border border-gray h-12 w-fit mx-4 p-2' onChange={(e) => console.log(e.target.value)} placeholder='Have Coupon Code' />

                    </div>
                    <button className='px-4 py-2 bg-green-700 hover:bg-green-900 text-white rounded-lg w-full'>Pay Now</button>
                </div>
            </div>

        </div>
    )
}

export default Reviewbooking