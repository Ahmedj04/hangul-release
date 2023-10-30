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
import { removeRoomFromSelected, clearRoomsSelected, setAddMoreRoom, setGuestDetails, clearReservationIdentity } from '../redux/hangulSlice';

// validation
import GuestDetailValidation from '../validation/bookingEngine/GuestDetailValidation'
import GstValidation from '../validation/bookingEngine/GstDetailValidation'

// timestamp
import formatDateToCustomFormat from '../generalUtility/timeStampMaker'


import axios from 'axios';

function Reviewbooking({ setDisplay, rooms, setShowModal, setSearched, checkinDate, checkoutDate }) {

    let guestTemplate = {
        "guest_name": "",
        "guest_email": "",
        "guest_phone_number": "",
        "guest_age": ""

    }
    const [guestDetailerror, setGuestDetailError] = useState({})
    const [gstDetailerror, setGstDetailError] = useState({})
    const [guest, setGuest] = useState([{ ...guestTemplate, index: 0 }]);
    // const [guest, setGuest] = useState([guestTemplate]?.map((i, id) => { return { ...i, index: id } }))
    const [addGst, setAddGst] = useState(false);
    // const [gstDetails, setGstDetails] = useState({ "registation_number": "", "company_name": "", "company_address": "" })
    const [gstDetails, setGstDetails] = useState({})
    const [addNewUser, setAddNewUser] = useState(0)
    const [guestIndex, setGuestIndex] = useState(0)
    const [rate, setRate] = useState({})
    const [selectedRoom, setSelectedRoom] = useState({})
    const [disabled, setDisabled] = useState(false)

    const [totals, setTotals] = useState({
        totalFinalRate: 0,
        totalTaxAmount: 0,
        totalOtherFees: 0,
    });
    const { totalFinalRate, totalTaxAmount, totalOtherFees } = totals;
    const couponDiscount = 0;

    const startDate = new Date(checkinDate); // Booking start date
    const endDate = new Date(checkoutDate); // Booking end date

    // Calculate the number of days for the booking
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const numberOfNights = Math.round((endDate - startDate) / oneDay);



    const roomsSelected = useSelector(state => new Set(state.roomsSelected))
    console.log("this is roomSelected set using redux", roomsSelected)

    // Create an array of rooms that match the room_ids in roomsSelected
    const selectedRoomsArray = rooms.filter((room) => roomsSelected.has(room.room_id));
    console.log("Selected rooms:", selectedRoomsArray);


    const inventoryDetail = useSelector(state => state.inventoryDetail)

    //  stored the lowest inventory available in the inventory_available variable.
    const inventory_available = inventoryDetail && Math.min(...inventoryDetail.map((item) => item.available_inventory))

    const dispatch = useDispatch();

    // Create a state variable for the Map
    const [selectedQuantitiesMap, setSelectedQuantitiesMap] = useState(new Map());

    // Calculate the total sum of selected rooms
    const totalSelectedQuantities = [...selectedQuantitiesMap.values()].reduce((acc, quantity) => acc + quantity, 0);

    // Now, totalSelectedQuantities contains the total sum of selected quantities
    console.log("Total Selected Quantities:", totalSelectedQuantities);

    // check the boolean value of reserveRoom state and based on this changed the css of payNow button
    const reserveRoom = useSelector(state => state.reserveRoom);

    const reservationIdentity = useSelector(state => state.reservationIdentity)

    // for getting the data from the local storage and setting the data
    useEffect(() => {
        let room = localStorage.getItem("room_data")
        setSelectedRoom(JSON.parse(room))

        let room_rates = localStorage.getItem("room_rates")
        setRate(JSON.parse(room_rates))

        // Calculate the total final rate
        const calculatedTotals = calculateTotalFinalRate(rate, selectedQuantitiesMap);

        // Update the state with the new totals
        setTotals(calculatedTotals);

    }, [rate])

    console.log("total ye hai", totals)

    // to check for selected rooms whenever the page renders
    useEffect(() => {
        // Create a new Map with keys from roomsSelected and values as 1
        const newSelectedQuantitiesMap = new Map(selectedQuantitiesMap);
        roomsSelected.forEach(roomId => {
            newSelectedQuantitiesMap.set(roomId, 1);
        });
        // Update the selectedQuantitiesMap state
        setSelectedQuantitiesMap(newSelectedQuantitiesMap);
    }, [])

    // Function to update the selected quantity for a room
    const updateSelectedQuantity = (room_id, quantity) => {
        const newMap = new Map(selectedQuantitiesMap);
        newMap.set(room_id, quantity);
        setSelectedQuantitiesMap(newMap);
    };

    console.log("number of rooms selected", selectedQuantitiesMap)

    // Function to calculate the total final rate from multiple objects
    function calculateTotalFinalRate(rate, selectedQuantitiesMap) {
        let totalFinalRate = 0;
        let totalTaxAmount = 0;
        let totalOtherFees = 0;

        // Loop through the objects and accumulate the total_final_rate values
        for (const roomKey in rate) {
            if (rate.hasOwnProperty(roomKey)) {
                const room = rate[roomKey];
                const selectedQuantity = selectedQuantitiesMap.get(roomKey) || 1; // Default to 1 if no quantity is selected

                // Calculate the updated total final rate, total tax amount, and total other fees
                totalFinalRate += room.total_final_rate * selectedQuantity;
                totalTaxAmount += room.total_tax_amount * selectedQuantity;
                totalOtherFees += room.total_otherfees_amount * selectedQuantity;
            }
        }

        // Return the values as an object
        return {
            totalFinalRate: totalFinalRate,
            totalTaxAmount: totalTaxAmount,
            totalOtherFees: totalOtherFees,
        };
    }

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

    // Function to remove data from 'room_data' in local storage based on room_id
    function removeRoomRateByRoomId(roomIdToRemove) {
        // Get the existing 'room_data' from local storage
        let existingData = localStorage.getItem('room_rates');

        // Check if there is existing data in local storage
        if (existingData) {
            // Parse the existing data from JSON
            existingData = JSON.parse(existingData);

            // Check if the room_id to remove exists in the data
            if (existingData[roomIdToRemove]) {
                // Remove the entry with the specified room_id
                delete existingData[roomIdToRemove];

                // Store the updated data back in local storage
                localStorage.setItem('room_rates', JSON.stringify(existingData));

            } else {
                // Handle the case where the specified room_id doesn't exist in the data
                console.log(`Room with room_id ${roomIdToRemove} not found.`);
            }
        } else {
            // Handle the case where there is no existing data in local storage
            console.log('No existing room data found in local storage.');
        }

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

    // function to delete the reservation id of the room from the local storage
    function removeReservationIdFromLocalStorage(roomId) {
        // Get the existing 'reservation_ids' from local storage
        let existingData = localStorage.getItem('reservation_ids');

        if (existingData) {
            // Parse the existing data from JSON
            existingData = JSON.parse(existingData);

            // Remove the reservation ID for the specific room ID
            delete existingData[roomId];

            // Store the updated data back in local storage
            localStorage.setItem('reservation_ids', JSON.stringify(existingData));

            console.log("Reservation ID for room", roomId, "has been removed.");
        } else {
            console.log("No reservation IDs found in local storage.");
        }
    }

    function updateReserveRoom(roomdata) {
        let url = "/api/reserve_rooms";
        axios.put(url, roomdata).then((response) => {
            setDisabled(false)  // this state is used to manage the css of paynow button
            console.log(response)
        }).catch((err) => {
            console.log(err)
        })
    }

    function fetchReservationid(roomId) {
        // Get the existing 'reservation_ids' from local storage
        let data = localStorage.getItem("reservation_ids");

        // Check if there is existing data in local storage
        if (data) {
            // Parse the existing data from JSON
            let existingData = JSON.parse(data);

            // Access the reservation ID for the specific room ID
            let reservationId = existingData[roomId];

            // Check if the room ID exists in the local storage
            if (reservationId) {
                // console.log("Reservation ID for room " + roomId + ": " + reservationId);
                return reservationId;
            } else {
                console.log("No reservation ID found for room " + roomId);
            }
        } else {
            alert("No reservation IDs found in local storage.");
        }
    }


    // these below functions will work when the pay now button is clicked
    function SubmitGuestDetails() {
        // let isGuestDetailsValid = GuestDetailValidation(guestDetail);
        let isGuestDetailsValid = GuestDetailValidation(guest);

        // isGuestDetailsValid can be either true or an error object
        if (isGuestDetailsValid !== true) {
            // Guest details are invalid, you can handle the error here
            setGuestDetailError(isGuestDetailsValid);
        }
        else {
            setGuestDetailError({})
            dispatch(setGuestDetails(guest))
            //network call
            bookingRoom()
            setDisplay(3)

        }

        if (addGst) {
            let isGstDetailsValid = GstValidation(gstDetails);
            // Step 2: Validate GST if GST is true
            if (isGstDetailsValid !== true) {
                // GST details are invalid, you can handle the error here
                setGstDetailError(isGstDetailsValid);

            } else {
                setGstDetailError({})
                //network call
            }
        }
    }

    function bookingRoom() {

        let roomBookingData = {
            "bookings": [
                {
                    "booking_date_from": checkinDate,
                    "booking_date_to": checkoutDate,
                    "total_rooms_booked": 1,
                    "is_cancelled": false,
                    "booking_time": formatDateToCustomFormat(new Date())
                }
            ]
        }
        let guestsForThisBooking = {
            "guest_booking_link": guest.map((guestdetail) => {
                return ({
                    "guest_name": guestdetail.guest_name,
                    "guest_email": guestdetail.guest_email,
                    "guest_age": guestdetail.guest_age,
                    "guest_phone_number": guestdetail.guest_phone_number,
                    "booking_id": ""
                })
            }
            )
        }
        let invoiceForThisBooking = {
            "booking_invoice_link": [
                {
                    "base_price": totalFinalRate,
                    "taxes": totalTaxAmount,
                    "other_fees": totalOtherFees,
                    "coupon_discount": couponDiscount,
                    "total_price": totalFinalRate + totalOtherFees + totalTaxAmount - couponDiscount,
                    // "transaction_refrence_no": "tid123",
                    "invoice_time": formatDateToCustomFormat(new Date()),
                    "booking_id": ""
                }
            ]

        }

        //multiple api call's will be performed in this bookRoom function so that is why it is divided in multiple functions.
        bookRoom(roomBookingData, guestsForThisBooking, invoiceForThisBooking)

        // axios.post(roomBookingUrl, roomBookingData).then((responseFromRoomBookingUrl) => {
        //     // alert(responseFromRoomBookingUrl.data.message)

        //     // Update the booking_id property
        //     guestsForThisBooking.guest_booking_link = guestsForThisBooking.guest_booking_link.map(item => {
        //         item.booking_id = responseFromRoomBookingUrl.data.booking_id;
        //         return item;
        //     });
        //     invoiceForThisBooking.booking_invoice_link = invoiceForThisBooking.booking_invoice_link.map(item => {
        //         item.booking_id = responseFromRoomBookingUrl.data.booking_id;
        //         return item;
        //     });

        //     // Now guestsForThisBooking is updated and you can use it for another post request if needed
        //     axios.post(bookingLinkUrl, guestsForThisBooking).then((responseFromBookingLinkUrl) => {
        //         // handle the second post response
        //         // alert(responseFromBookingLinkUrl.data.message)

        //         axios.post(invoiceLinkUrl, invoiceForThisBooking).then((responseFromInvoiceLinkUrl) => {
        //             // handle the third post response
        //             // alert(responseFromInvoiceLinkUrl.data.message)


        //         }).catch((err) => {
        //             console.log(err)
        //         })

        //     }).catch((err) => {
        //         console.log(err)
        //     });

        // }).catch((err) => {
        //     console.log(err)
        // })
    }

    function bookRoom(roomBookingData, guestsForThisBooking, invoiceForThisBooking) {
        let roomBookingUrl = "/api/room_bookings";
        axios.post(roomBookingUrl, roomBookingData).then((responseFromRoomBookingUrl) => {
            // Update the booking_id property
            guestsForThisBooking.guest_booking_link = guestsForThisBooking.guest_booking_link.map(item => {
                item.booking_id = responseFromRoomBookingUrl.data.booking_id;
                return item;
            });
            invoiceForThisBooking.booking_invoice_link = invoiceForThisBooking.booking_invoice_link.map(item => {
                item.booking_id = responseFromRoomBookingUrl.data.booking_id;
                return item;
            });

            // Now guestsForThisBooking is updated and you can use it for another post request if needed
            linkBookingWithGuest(guestsForThisBooking, invoiceForThisBooking)

        }).catch((err) => {
            console.log(err)
        })
    }

    function linkBookingWithGuest(guestsForThisBooking, invoiceForThisBooking) {
        let bookingLinkUrl = "/api/guest_booking_link";
        axios.post(bookingLinkUrl, guestsForThisBooking).then((responseFromBookingLinkUrl) => {
            // handle the second post response
            linkInvoiceWithBooking(invoiceForThisBooking)

        }).catch((err) => {
            console.log(err)
        });
    }

    function linkInvoiceWithBooking(invoiceForThisBooking) {
        let invoiceLinkUrl = "/api/booking_invoice_link";
        axios.post(invoiceLinkUrl, invoiceForThisBooking).then((responseFromInvoiceLinkUrl) => {
            // handle the third post response

        }).catch((err) => {
            console.log(err)
        })
    }


    return (
        <div className='min-h-screen'>

            {/* app bar  */}
            <div className='flex py-5 border-b-2  bg-slate-100'>
                <div className='flex cursor-pointer pl-2 pr-10 my-auto'
                    onClick={() => {
                        if (localStorage.getItem("temp_room_rate") === null) {
                            setDisplay(0)

                        } else {
                            setDisplay(1)

                        }
                    }}>
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
                            dispatch(clearReservationIdentity())
                            deleteRoomDetails()
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
                                            value={selectedQuantitiesMap?.get(room?.room_id) || "1"} // Use selected quantity from the Map
                                            onChange={(e) => {
                                                const newQuantity = parseInt(e.target.value);
                                                updateSelectedQuantity(room?.room_id, newQuantity); // Update selected quantity in the Map
                                                // updateReserveRoom({ "reserve_rooms": [{ "reservation_id": fetchReservationid(room?.room_id), "room_count": newQuantity }] })
                                                let reservationData = reservationIdentity.filter((item) => item.room_id === room?.room_id)[0]
                                                updateReserveRoom({ "reserve_rooms": [{ "room_count": newQuantity, ...reservationData }] })
                                                setDisabled(true)
                                            }}
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
                                                removeRoomRateByRoomId(room?.room_id)  //remove room_rate from local storage
                                                removeReservationIdFromLocalStorage(room?.room_id)
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
                    <div className="pt-6 pb-4">
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
                                            error={guestDetailerror[loopIndex]?.guest_name}
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
                                            onChangeAction={(e) => {
                                                handleChangeInGuest(e, i.index, "guest_email")
                                            }
                                            }
                                            error={guestDetailerror[loopIndex]?.guest_email}
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
                                            onChangeAction={(e) => {
                                                handleChangeInGuest(e, i.index, "guest_phone_number")
                                            }}
                                            error={guestDetailerror[loopIndex]?.guest_phone_number}
                                            color={Color?.light}
                                            req={true}
                                            title={'Guest Phone'}
                                            tooltip={true}
                                        />
                                        <InputText
                                            label={'Guest Age [in years] '}
                                            visible={1}
                                            defaultValue={``}
                                            onChangeAction={(e) => {
                                                handleChangeInGuest(e, i.index, "guest_age")
                                            }}
                                            error={guestDetailerror[loopIndex]?.guest_age}
                                            color={Color?.light}
                                            req={true}
                                            title={'Guest Age'}
                                            tooltip={true}
                                        />
                                    </div>
                                </div>

                            ))}
                            <input type="checkbox" name="add_gst" onClick={() => setAddGst(!addGst)} />
                            <span className='font-semibold text-base mx-2'>Add GST Details (optional)</span>
                            {addGst === true ?
                                <div className="flex flex-wrap border-2 border-white rounded-xl p-2 m-2">
                                    {/* GST Registration Number  */}
                                    <InputText
                                        label={'GST Registration Number'}
                                        visible={1}
                                        defaultValue={``}
                                        onChangeAction={(e) =>
                                            setGstDetails({ ...gstDetails, gst_registration_no: e.target.value })
                                        }
                                        error={gstDetailerror?.gst_registration_no}
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
                                            setGstDetails({ ...gstDetails, gst_company_name: e.target.value })
                                        }
                                        error={gstDetailerror?.gst_company_name}
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
                                            setGstDetails({ ...gstDetails, gst_company_address: e.target.value })
                                        }
                                        error={gstDetailerror?.gst_company_address}
                                        color={Color?.light}
                                        req={true}
                                        title={'Address of company'}
                                        tooltip={true}
                                    />


                                </div>

                                : <></>}

                        </div>

                        {/* buttons  */}
                        {/* <div className='flex flex-wrap w-full gap-2 p-2'>
                            <button className='my-2 px-4 py-3 bg-green-700 hover:bg-green-900 rounded-md text-white w-full'>Submit</button>
                        </div> */}
                    </div>



                </div>

                {/* right side div  */}
                <div id="price-breakup" className='border border-gray-300 bg-white p-4 text-black h-fit w-full lg:w-4/12  rounded-2xl' >
                    <div className='border-b border-gray rounded-lgg w-full h-1/2 my-2'>
                        <h1 className="font-extrabold p-2 text-xl">Price Breakup</h1>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5 font-semibold'>{totalSelectedQuantities} Room for {numberOfNights === 0 ? '1 Day' : numberOfNights === 1 ? '1 Night' : `${numberOfNights} Nights`}<br /> <div className='text-sm font-normal px-3'>base price</div></div> <div className='mx-2 my-auto flex justify-end w-full'>₹ {totalFinalRate}</div></div>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5 font-semibold'>Taxes</div> <div className='mx-2 my-auto flex justify-end w-full'>₹ {totalTaxAmount}</div></div>
                        <div className='flex justify-start items-start my-4  border-b-2'> <div className='p-2 w-4/5 font-semibold'>Other Fees</div> <div className='mx-2 my-auto flex justify-end w-full'>₹ {totalOtherFees}</div></div>
                        <div className='flex  items-start my-4  border-b-2'> <div className='p-2 w-4/5 font-semibold'>Coupon Discounts</div> <div className='mx-2 my-auto flex justify-end w-full'>₹ {couponDiscount}.00</div></div>
                        <div className='flex justify-start items-start my-4'> <div className='p-2 w-4/5 font-bold'>Total Amount To Be Paid</div> <div className='mx-2 flex justify-end w-full text-2xl font-bold'>₹ {(totalFinalRate + totalTaxAmount + totalOtherFees) - couponDiscount}</div></div>
                    </div>

                    <div className='border border-gray rounded-lg w-full h-1/2 my-2 py-2 px-4'>
                        <h2 className='h-12 w-fit mx-3 p-2 font-semibold'>Coupon Codes</h2>
                        <div className='flex justify-between'>
                            <input className='my-1 border border-gray h-12 w-full mx-4 p-2' onChange={(e) => console.log(e.target.value)} placeholder='Have Coupon Code' />
                            <button className='bg-blue-600 rounded-lg text-white px-4 h-9 my-auto font-medium'>Apply</button>
                        </div>

                    </div>

                    <button
                        disabled={reserveRoom || disabled}
                        onClick={() => {
                            SubmitGuestDetails()
                        }}
                        className={`px-4 py-2 ${reserveRoom === true ? "bg-gray-500" : disabled === true ? 'bg-gray-500' : 'bg-green-700 hover:bg-green-900'}   text-white rounded-lg w-full`}>Pay Now</button>
                </div>
            </div>

        </div>
    )
}

export default Reviewbooking