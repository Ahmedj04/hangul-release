export default function validateGuestDetail(data) {
    var error = {};
    var flag = false;

    // validating if email is empty or not
    if (data?.guest_email === "" || data?.guest_email === undefined) {
        error.guest_email = "APP: Email field cannot be empty"
        flag = true
    }
    // validating if email typed is valid or not
    if (data?.guest_email !== "" && data?.guest_email !== undefined) {
        if ((!data?.guest_email?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))) {
            flag = true
            error.guest_email = "APP: The email is invalid."
        }
    }

    // validating if name is empty or not 
    if (data?.guest_name === "" || data?.guest_name === undefined) {
        error.guest_name = "APP: Name field cannot be empty"
        flag = true
    }

    // validating if phone number is empty or not
    if (data?.guest_phone === "" || data?.guest_phone === undefined) {
        error.guest_phone = "APP: Phone number field cannot be empty"
        flag = true
    }
    // validating if phone number entered is valid or not and also checking the length of the phone number
    if (data?.guest_phone !== "" && data?.guest_phone !== undefined) {
        if ((!data?.guest_phone?.match(/^([1-9]+[0-9]*)$/))) {
            error.guest_phone = "APP: Phone number entered is invalid"
            flag = true
        }
        if (data?.guest_phone?.length > 10) {
            error.guest_phone = "APP: Phone number cannot be greater then 10 digits"
            flag = true
        }

    }

    // validating if age is empty or not
    if (data?.guest_age === "" || data?.guest_age === undefined) {
        error.guest_age = "APP: Age field cannot be empty"
        flag = true
    }
    // validating if age is within 150
    if (data?.guest_age !== " " || data?.guest_age !== undefined) {
        if (data?.guest_age > 150) {
            error.guest_age = "APP: Age cannot be greater then 150"
            flag = true
        }

    }

    return flag === false ? true : error;
}
