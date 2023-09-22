import React, { useState, useEffect } from 'react';
import InputText from '../utils/InputText';
import Color from '../colors/Color';
import Modal from "../NewTheme/modal";
import { RxCross2 } from "react-icons/rx";
import { BiArrowBack } from "react-icons/bi";



function Reviewbooking({ setDisplay }) {
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
                color={Color?.dark}
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
                color={Color?.dark}
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
                color={Color?.dark}
                req={true}
                title={'Address of company'}
                tooltip={true}
            />


        </div></>)
    }


    return (
        <div className=' min-h-screen'>
            <div className='flex py-12 border-b-2 border-black bg-gray-700  h-32 w-screen text-white font-extrabold '>
                <div className='flex cursor-pointer pl-2 pr-10 my-auto ' onClick={() => setDisplay(1)}>
                    <i className='my-auto'><BiArrowBack size={30} color='white' /></i>
                    <span className='my-auto pl-1 font-medium'>Back</span>
                </div>
                <h1 className=' pb-4 text-3xl'>Review Booking</h1>
            </div>
            <div id="main-content" className='h-fit text-white flex flex-wrap justify-around gap-2 mx-4 mt-10'>
                {/* left side div  */}
                <div id="guest-detail-review" className='bg-gray-700 h-fit w-full lg:w-7/12 border-white rounded-2xl'>
                    <div className=' border-b-2 border-white justify-start mt-2 p-4'>

                        <div className='flex justify-between'>
                            <h6 className={`text-white text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
                                Rooms Summary
                            </h6>
                            <button onClick={() => { alert('Add Rooms') }} className='my-2 ml-auto px-4 py-1 bg-cyan-700 rounded-md text-white'>Add More Rooms</button>

                        </div>

                        <table className='mx-4' cellPadding={15}>
                            <thead>
                                <th>Room Name</th>
                                <th>Room Type</th>
                                <th>Number Of Rooms</th>
                            </thead>
                            <tr>
                                <td>{selectedRoom?.room_name}</td>
                                <td>{selectedRoom?.room_type}</td>
                                <td className='text-center'>1</td>
                            </tr>
                           
                        </table>



                    </div>


                    <div className='flex justify-start mt-2 p-4'>
                        <h6
                            className={`text-white text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}
                        >
                            Guest Details
                        </h6>
                        <button onClick={() => { addGuest() }} className='ml-auto px-4 py-1 bg-cyan-700 rounded-md text-white'>Add Guests</button>

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
                                            color={Color?.dark}
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
                                            color={Color?.dark}
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
                                            color={Color?.dark}
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

                            <button className='my-2 px-4 py-1 bg-cyan-600 rounded-md text-white w-full'>Submit</button>
                        </div>
                    </div>



                </div>

                {/* right side div  */}
                <div id="price-breakup" className=' bg-gray-700 p-4 text-white h-fit w-full lg:w-4/12 border-white rounded-2xl' >
                    <div className='border border-white rounded-lg w-full h-1/2 my-2'>
                        <h1 className="font-extrabold p-2 text-xl">Price Breakup</h1>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5'>1 Room x for 1 Night<br /> <div className='text-sm font-extralight px-3'>base price</div></div> <div className='mx-2 flex justify-end w-full'>₹ {rate?.total_final_rate}</div></div>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5'>Taxes</div> <div className='mx-2 flex justify-end w-full'>₹ {rate?.total_tax_amount}</div></div>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5'>Other Fees</div> <div className='mx-2 flex justify-end w-full'>₹ {rate?.total_otherfees_amount}</div></div>
                        <div className='flex  items-start my-4  border-b-2'> <div className='p-2 w-4/5'>Coupon Discounts</div> <div className='mx-2 flex justify-end w-full'>200.00 Rupees</div></div>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5'>Total Amount To Be Paid</div> <div className='mx-2 flex justify-end w-full'>₹ {rate?.total_final_rate + rate?.total_otherfees_amount + rate?.total_tax_amount}</div></div>
                    </div>
                    <div className='border border-white rounded-lg w-full h-1/2 my-2 py-2 px-4'>
                        <h2 className='h-12 w-fit mx-3 p-2'>Coupon Codes</h2>
                        <input className='my-1 h-12 w-fit mx-4 p-2' onChange={(e) => console.log(e.target.value)} placeholder='Have Coupon Code' />

                    </div>
                    <button className='px-4 py-2 bg-cyan-600 text-white rounded-lg w-full'>Pay Now</button>
                </div>
            </div>

        </div>
    )
}

export default Reviewbooking