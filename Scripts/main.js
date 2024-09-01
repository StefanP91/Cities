const urlUsersAPI = "https://66c4b3dfb026f3cc6cf06240.mockapi.io/cities/Users"
let users = [];
console.log(users)

// Get Users API
async function getUsersAPI() {
    try {
    const response = await fetch(urlUsersAPI)
    const data = await response.json()
    users.push(...data)
    }

    catch(error) {
        console.log(error)
    }
}

getUsersAPI()

// register validation
function registerValidation(event) {
    event.preventDefault()

    // Values from input fields
    const firstName = document.getElementById("RegisterFirstName").value
    const lastName = document.getElementById("RegisterLastName").value
    const email = document.getElementById("RegisterEmail").value
    const password = document.getElementById("RegisterPassword").value
    const phoneNumber = document.getElementById("RegisterPhoneNumber").value

    // Error messages
    const firstNameError = document.getElementById("errorRegisterFirstName")
    const lastNameError = document.getElementById("errorRegisterLastName")
    const emailError = document.getElementById("errorRegisterEmail")
    const passwordError = document.getElementById("errorRegisterPassword")
    const phoneNumberError = document.getElementById("errorRegisterPhoneNumber")

    // Success message
    const successMessage = document.getElementById("registerSuccessMessage")

   let allInputsValid = true;

    // First name validation
    if (! (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i).test(firstName)) {
        firstNameError.style.display = "block"
        allInputsValid = false
    }

    // Check if user with this name already exists in fetched users array

    else if (users.some(user => user.name === firstName)) {
        alert("User with this first name already exists")
        allInputsValid = false
    }

    else {
        firstNameError.style.display = "none"
    }

    // Last name validation
    if (!(/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i).test(lastName)) {
        lastNameError.style.display = "block"
        allInputsValid = false
    }

    // Check if user with this last name already exists in fetched users array

    else if (users.some(user => user.lastName === lastName)) {
        alert("User with this last name already exists")
        allInputsValid = false
    }

    else {
        lastNameError.style.display = "none"
    }

    // Email validation
    if (email === "") {
        emailError.style.display = "block"
        allInputsValid = false
    }

    else if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)) {
        alert("Please enter a valid email address") 
        allInputsValid = false
    }

    // Check if user with this email already exists in fetched users array
    else if (users.some(user => user.email === email)) {
        alert("User with this email already exists")
        allInputsValid = false
    }

    else {
        emailError.style.display = "none"
    }

    // Password validation
    if (password === "") {
        passwordError.style.display = "block"
        allInputsValid = false
    }

    else if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).test(password)) {
       alert ("Password must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 or more characters")
       allInputsValid = false
    }

    // Check if user with this password already exists in fetched users array
    else if (users.some(user => user.password === password)) {
        alert("User with this password already exists")
        allInputsValid = false
    }

    else{
        passwordError.style.display = "none"
    }

    // Phone number validation
    if (phoneNumber === "") {
        phoneNumberError.style.display = "block"
        allInputsValid = false
    }

    else if(!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im).test(phoneNumber)) {
        alert("Your phone number should be in the following format: 123-456-7890 or (123) 456-7890 or 1234567890")
        allInputsValid = false
    }

    // Check if user with this phone number already exists in fetched users array
    else if (users.some(user => user.phoneNumber === phoneNumber)) {
        alert("User with this phone number already exists")
        allInputsValid = false
    }

    else {
        phoneNumberError.style.display = "none"
    }

    if (allInputsValid) {
        const userInput = {
            name: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phoneNumber: phoneNumber
        }

        fetch(urlUsersAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInput)
        })
        .then(response => response.json())
        successMessage.style.display = "block"
        document.getElementById("registerForm").reset()

        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById("registerModal"))
            document.querySelector(".modal-backdrop").style.display = "none"
            document.getElementById("registerModal").classList.remove("show")
            modal.hide()
            successMessage.style.display = "none"
            location.reload()
        }, 2000)
        
    }

  

}

// login btn on registration modal (closing )
document.getElementById("switchToLoginBtn").addEventListener("click", function(event) {
    event.preventDefault();
    
    // Hide the registration modal and then show the login modal
    const registerModalElement = document.getElementById("registerModal");
    const registerModal = bootstrap.Modal.getInstance(registerModalElement);
    
    registerModal.hide(); // Hide the registration modal
    
    registerModalElement.addEventListener('hidden.bs.modal', function () {
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
        loginModal.show(); // Show the login modal after registration modal is hidden
    }, { once: true }); // Ensure this event listener is only triggered once
});


// login validation
function loginValidation(event) {
    event.preventDefault()

    // Values from input fields
    const loginEmail = document.getElementById("loginEmail").value
    const loginPassword = document.getElementById("loginPassword").value

    // Error messages
    const errorLoginEmail = document.getElementById("errorLoginEmail")
    const errorLoginPassword = document.getElementById("errorLoginPassword")

    // Success messages
    const loginSuccessMessage = document.getElementById("loginSuccessMessage")

    let allInputsValid = true

    const loginUserEmail = users.find(user => user.email === loginEmail)
    const loginUserPassword = users.find(user => user.password === loginPassword)

    // Email validation
    if (loginEmail === "") {
        errorLoginEmail.style.display = "block"
        allInputsValid = false
    }

    else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(loginEmail))) {
        alert("Please enter a valid email address")
        allInputsValid = false
    }

    else if (!loginUserEmail) {
        alert("This email is not registered")
        allInputsValid = false
    }

    else {
        errorLoginEmail.style.display = "none"
    }
    

    // Password validation
    if ( loginPassword === "") {
        errorLoginPassword.style.display = "block"
        allInputsValid = false
    }

    else if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).test(loginPassword)) {
        alert("Password must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 or more characters")
        allInputsValid = false
    }

    else if (!loginUserPassword) {
        alert("Wrong password, please try again")
        allInputsValid = false
    }

    else {
        errorLoginPassword.style.display = "none"
    }


    if (allInputsValid) {
        loginSuccessMessage.style.display = "block"
        document.getElementById("loginForm").reset()
        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById("loginModal"))
            document.querySelector(".modal-backdrop").style.display = "none"
            document.getElementById("loginModal").classList.remove("show")
            loginSuccessMessage.style.display = "none"
            window.location.href = "cities.html"
        }, 2000)

        localStorage.setItem("loggedInUser", JSON.stringify(loginUserEmail, loginPassword))
    }
}

// Show hide password login

document.querySelector("#togglePasswordLogin").addEventListener("click", function() {
    const passwordInputLogin = document.querySelector("#loginPassword");
    const passwordIconLogin = document.querySelector("#togglePasswordIconLogin");

    const type = passwordInputLogin.getAttribute("type") === "password" ? "text" : "password";
    passwordInputLogin.setAttribute("type", type);

    passwordIconLogin.classList.toggle("bi-eye");
    passwordIconLogin.classList.toggle("bi-eye-slash");
});

// Show hide password register

document.querySelector("#togglePasswordRegister").addEventListener("click", function() {
    const passwordInputRegister = document.querySelector("#RegisterPassword");
    const passwordIconRegister = document.querySelector("#togglePasswordIconRegister");

    const type = passwordInputRegister.getAttribute("type") === "password" ? "text" : "password";
    passwordInputRegister.setAttribute("type", type);

    passwordIconRegister.classList.toggle("bi-eye");
    passwordIconRegister.classList.toggle("bi-eye-slash");
});






    


