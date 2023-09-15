import React, { useState, useEffect } from 'react';
import InputText from '../../../components/utils/InputText';
import Color from '../../../components/colors/Color';
import Modal from "../../../components/NewTheme/modal";
import { RxCross2 } from "react-icons/rx";

function Reviewbooking() {
    let guestTemplate = {
        "guest_name": "",
        "guest_email": "",
        "phone_number": ""
    }
    const [error, setError] = useState({})
    const [guest, setGuest] = useState([guestTemplate]?.map((i, id) => { return { ...i, index: id } }))
    const [addGst, setAddGst] = useState(false);
    const [gstDetails, setGstDetails] = useState({ "registation_number": "", "company_name": "", "company_address": "" })
    const [addNewUser, setAddNewUser] = useState(0)

    // to add guest in ui view 
    const addGuest = () => {
        setGuest([...guest, { ...guestTemplate, index: guest.length }])
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
    const removeGuest = (index) => {
        let temp = guest.filter(i => i.index != index)
        setGuest(temp)
    }

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

    // ui of add guest form 

    function AddGuestForm({ index }) {
        return (<>
            <button onClick={() => removeGuest(index)}><RxCross2 /></button>
            <div className="flex flex-wrap border-2 border-white rounded-xl p-2 m-2">

                {/* guest name  */}
                <InputText
                    label={'Guest Name'}
                    visible={1}
                    defaultValue={``}
                    onChangeAction={(e) => {
                       handleChangeInGuest(e, index, "guest_name")
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
                        handleChangeInGuest(e, index, "guest_email")
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
                        handleChangeInGuest(e, index, "guest_phone")
                    }
                    error={error?.guest_phone}
                    color={Color?.light}
                    req={true}
                    title={'Guest Phone'}
                    tooltip={true}
                />
            </div></>)
    }
    return (
        <div className='bg-slate-300 h-screen'>
            <div className='flex  justify-center items-end py-12 bg-gray-600 h-32 w-screen text-white text-3xl font-extrabold -z-20'>
                <h1>Review Booking</h1>
            </div>
            <div id="main-content" className='h-screen flex flex-wrap justify-around gap-2 -mt-10 z-10 mx-4'>
                <div id="guest-detail-review" className='bg-gray-400 h-full w-full lg:w-7/12 border-white rounded-2xl'>
                    <h6
                        className={`text-gray-900 text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}
                    >
                        Guest Details
                    </h6>


                    <div className="pt-6">
                        <div className=" md:px-4 mx-auto w-full">

                            {guest.map((i, index) => (
                                <>
                                    <button onClick={() => removeGuest(index)}><RxCross2 /></button>
                                    <div className="flex flex-wrap border-2 border-white rounded-xl p-2 m-2">

                                        {/* guest name  */}
                                        <InputText
                                            label={'Guest Name'}
                                            visible={1}
                                            defaultValue={``}
                                            onChangeAction={(e) => {
                                                alert(index);
                                                handleChangeInGuest(e, index, "guest_name")
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
                                                handleChangeInGuest(e, index, "guest_email")
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
                                                handleChangeInGuest(e, index, "guest_phone")
                                            }
                                            error={error?.guest_phone}
                                            color={Color?.light}
                                            req={true}
                                            title={'Guest Phone'}
                                            tooltip={true}
                                        />
                                    </div>
                                </>

                            ))}
                            <input type="checkbox" name="add_gst" onClick={() => setAddGst(!addGst)} />
                            <span className='font-semibold text-base mx-2'>Add GST Details</span>
                            {addGst === true ? <AddGstForm /> : <></>}

                        </div>
                        {/* buttons  */}
                        <div className='flex flex-wrap w-full gap-2 p-2'>
                            <button onClick={() => { addGuest() }} className='px-4 py-1 bg-cyan-700 rounded-md text-white'>Add Guests</button>
                            <button className='px-4 py-1 bg-cyan-700 rounded-md text-white'>Submit</button>
                        </div>
                    </div>



                </div>
                <div id="price-breakup" className='bg-gray-400 h-full w-full lg:w-4/12 border-white rounded-2xl' >
                    {JSON.stringify(guest)}
                </div>
            </div>

        </div>
    )
}

export default Reviewbooking