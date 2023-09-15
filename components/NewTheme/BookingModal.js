import React from 'react'

function BookingModal({ description, setShowModal }) {
    return (
        <div className="overflow-x-hidden  overflow-y-scroll fixed top-0 left-0 right-0 backdrop-blur-3xl h-screen bg-black/30 md:inset-0 z-50 flex justify-center items-center">

            <div className="relative w-full max-w-full px-4 h-auto mt-0 md:pt-0 md:h-auto ">
                <div className='bg-white rounded shadow relative'>
                    <div className=''>
                        <p className='text-sm text-slate-500 '>
                            {description}
                        </p>
                    </div>
                    <div className='flex'>
                        <div className="items-start p-5 border-t border-gray-200 rounded-b">
                            <button onClick={() => setShowModal(0)} className="text-white bg-slate-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-0">Close</button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default BookingModal