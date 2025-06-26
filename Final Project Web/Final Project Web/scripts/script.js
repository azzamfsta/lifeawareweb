const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', () => {
    logregBox.classList.add('active');
});

loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active');
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {    
    console.log("User login:", user.email);
  }
});

const loginForm = document.querySelector('.form-box.login form');
const registerForm = document.querySelector('.form-box.register form');

//LOGIN
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();    
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Login berhasil!');
            window.location.href = "dashboard.html";            
        })
        .catch((error) => {
            alert(error="the password is invalid or the user does not have a password.");
        });
});

// REGISTER (REVISI)
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Ambil nilai input
    const username = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    // Buat akun di Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Simpan data pengguna ke Firestore
            return firebase.firestore().collection("users").doc(user.uid).set({
                name: username,
                email: email,
                phone: "",
                birthdate: "",
                gender: "",
                bloodType: "",
                height: "",
                weight: "",
                allergy: "",
                medicalCondition: "",
                emergencyName: "",
                emergencyRelation: "",
                emergencyPhone: "",
                emergencyEmail: "",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            alert("Registrasi berhasil!");
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            alert("Gagal mendaftar: " + error.message);
        });
});