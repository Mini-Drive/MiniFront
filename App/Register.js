let enviar = document.getElementById('enviar');
let btnlogin = document.getElementById('btnlogin');

function register(event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    let lastName = document.getElementById('lastName').value;
    let firstName = document.getElementById('firstName').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let age = document.getElementById('age').value;
    let username = document.getElementById('username').value;

    let emailRegex = /.+@.+/;

    if (!emailRegex.test(email)) {
        console.error('Email must contain @');
        alert('Email must contain @'); // Muestra un mensaje de error al usuario
        return; 
    }

    fetch('http://datahive.somee.com/api/Users/Register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastName, firstName, email, password, age, userName: username })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Register successful");
            let registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
            registerModal.show();

            document.getElementById('modalCloseBtn').addEventListener('click', () => {
                location.href = "./login.html";
            });
        } else {
            console.log("Register failed:", data.message);
            if (data.message.includes("email") && data.message.includes("already exists")) {
                alert("This email is already in use. Please use a different email."); 
            } else if (data.message.includes("username") && data.message.includes("already exists")) {
                alert("This username is already taken. Please choose a different username."); 
            } else {
                alert("Registration failed: " + data.message); 
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.'); 
    });
}

enviar.addEventListener('click', register);

btnlogin.addEventListener('click', () => {  
    location.href = "./login.html";
});