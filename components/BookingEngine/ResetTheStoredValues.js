import { useDispatch, useSelector } from "react-redux";

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

const reservationIdentity = useSelector(state => state.reservationIdentity)

function ResetTheStoredValues() {
    if (reservationIdentity.length > 0) {
        reservationIdentity?.map((room) => {
            removeReservationFromDB(room?.room_id, room?.reservation_time)
        })
    } else {
        setDisplay(0)
        setShowModal(0)
        setSearched(false)
        dispatch(setAddMoreRoom(false))
        dispatch(clearRoomsSelected())
        dispatch(clearReservationIdentity())
        dispatch(clearGuestDetails())
        dispatch(clearInventoryDetail())
        deleteRoomDetails()
    }
}

export default ResetTheStoredValues;



