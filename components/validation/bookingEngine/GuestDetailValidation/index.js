export default function validateGuestDetail(data) {
    // var error = {};
    var error = [];

    for (let i = 0; i < data.length; i++) {
        error.push({})
    }
    // [{},{}]  error array with error objects
    // alert(JSON.stringify(data))
    // alert(error)

    var flag = false;


    data.map((guest, index) => {
        // validating if email is empty or not
        if (guest?.guest_email === "" || guest?.guest_email === undefined) {
            error[index].guest_email = "APP: Email field cannot be empty"
            flag = true
        }
        // validating if email is empty or not
        if (guest?.guest_email === "" || guest?.guest_email === undefined) {
            error[index].guest_email = "APP: Email field cannot be empty"
            flag = true
        }
        // validating if email typed is valid or not
        if (guest?.guest_email !== "" && guest?.guest_email !== undefined) {
            if ((!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(guest?.guest_email))) {
                flag = true
                error[index].guest_email = "APP: The email is invalid."
            }

        }

        // validating if name is empty or not 
        if (guest?.guest_name === "" || guest?.guest_name === undefined) {
            error[index].guest_name = "APP: Name field cannot be empty"
            flag = true
        }

        // validating if phone number is empty or not
        if (guest?.guest_phone_number === "" || guest?.guest_phone_number === undefined) {
            error[index].guest_phone_number = "APP: Phone number field cannot be empty"
            flag = true
        }
        // validating if phone number entered is valid  or not (including country code) and also checking the length of the phone number
        if (guest?.guest_phone_number !== "" && guest?.guest_phone_number !== undefined) {
            if ((!guest?.guest_phone_number?.match(/^(\+\d{1,4})?(\d{10}|\d{1,9})$/))) {
                error[index].guest_phone_number = "APP: Phone number entered is invalid"
                flag = true
            }
        }

        // validating if age is empty or not
        if (guest?.guest_age === "" || guest?.guest_age === undefined) {
            error[index].guest_age = "APP: Age field cannot be empty"
            flag = true
        } else {
            // validating if age is within 150
            // if (data?.guest_age !== "" || data?.guest_age !== undefined) {
            if ((!guest?.guest_age?.match(/^([1-9]+[0-9]*)$/))) {
                error[index].guest_age = "APP: Age entered is invalid"
                flag = true
            }
            if (guest?.guest_age > 150) {
                error[index].guest_age = "APP: Age cannot be greater then 150"
                flag = true
            }
            // }
        }
    })




    return flag === false ? true : error;
}
