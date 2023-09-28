import React from 'react'
import { useDispatch } from 'react-redux';
import { clearRoomsSelected,setAddMoreRoom } from '../redux/hangulSlice'

function BookingModal({ title, description, setShowModal, setDisplay, setSearched }) {

    const dispatch = useDispatch();

    return (
        // <div className="overflow-x-hidden  overflow-y-scroll fixed top-0 left-0  right-0 backdrop-blur-3xl h-screen bg-black/30 md:inset-0 z-50 flex justify-center items-center">
        // <div className=" overflow-y-scroll overflow-x-hidden fixed top-0 left-0 right-0 backdrop-blur-3xl  bg-black/30 h-screen z-50 ">
        <div className=" overflow-y-scroll overflow-x-hidden fixed top-0 left-0 right-0 backdrop-blur-3xl  bg-white h-screen z-50 ">

            <div
                // className="relative w-full max-w-full px-0  mt-0 md:pt-0 md:h-auto "
                className="relative w-full max-w-full px-0"
            >
                {/* <div className="bg-white flex items-start justify-between p-5 border-b rounded-t">
                    <h3 className='text-black text-xl font-semibold'>{title}</h3>
                    <button
                        type="button"
                        onClick={() => {
                            setShowModal(0)
                        }}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div> */}
                <div className='bg-white rounded shadow relative'>
                    <div>
                        <p className='text-sm text-slate-500'>
                            {description}
                        </p>
                    </div>
                    {/* <div className='flex'> */}
                    <div
                        // className="items-start p-5 border-t border-gray-200 rounded-b">
                        className=" p-5">
                        <button
                            className="text-white bg-slate-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-0"
                            onClick={() => {
                                setShowModal(0)
                                setDisplay(0)
                                dispatch(setAddMoreRoom(false))
                                dispatch(clearRoomsSelected())
                                setSearched(false)
                            }}
                        >
                            Close
                        </button>
                    </div>
                    {/* </div> */}
                </div>

            </div>

        </div>
    )
}

export default BookingModal