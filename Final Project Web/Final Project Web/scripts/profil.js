firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const uid = user.uid;
    const db = firebase.firestore();

    db.collection("users").doc(uid).get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();

          // Tampilkan nama pengguna di pojok kanan atas
          const displayNameSpan = document.getElementById("user-display-name");
          if (displayNameSpan) {
            displayNameSpan.innerText = data.name || "Pengguna";
          }

          // Atas: nama & email header
          document.getElementById("display-name").innerText = data.name || "-";
          document.getElementById("display-email").innerText = data.email || "-";

          // Informasi Pribadi
          document.getElementById("nama-lengkap").value = data.name || "-";
          document.getElementById("email").value = data.email || "-";
          document.getElementById("telepon").value = data.phone || "-";
          document.getElementById("tanggal-lahir").value = data.birthdate || "-";
          document.getElementById("jenis-kelamin").value = data.gender || "-";

          // Informasi Medis
          document.getElementById("golongan-darah").value = data.bloodType || "-";
          document.getElementById("tinggi-badan").value = data.height ? `${data.height} cm` : "";
          document.getElementById("berat-badan").value = data.weight ? `${data.weight} kg` : "";
          document.getElementById("alergi").value = data.allergy || "-";
          document.getElementById("kondisi-medis").value = data.medicalCondition || "-";

          // Kontak Darurat
          document.getElementById("emergency-nama").value = data.emergencyName || "-";
          document.getElementById("emergency-hubungan").value = data.emergencyRelation || "-";
          document.getElementById("emergency-telepon").value = data.emergencyPhone || "-";
          document.getElementById("emergency-email").value = data.emergencyEmail || "-";
        } else {
          console.log("Data user tidak ditemukan di Firestore.");
        }
      })
      .catch((error) => {
        console.error("Error mengambil data profil:", error);
      });
  }
});

// User menu dropdown
const userMenuButton = document.getElementById("user-menu-button");
const userMenu = document.getElementById("user-menu");
const userMenuButton2 = document.getElementById("user-menu-button-2");
const userMenu2 = document.getElementById("user-menu-2");
const userMenuButton3 = document.getElementById("user-menu-button-3");
const userMenu3 = document.getElementById("user-menu-3");

if (userMenuButton && userMenu) {
  userMenuButton.addEventListener("click", function () {
    userMenu.classList.toggle("hidden");
  });
}

if (userMenuButton2 && userMenu2) {
  userMenuButton2.addEventListener("click", function () {
    userMenu2.classList.toggle("hidden");
  });
}

if (userMenuButton3 && userMenu3) {
  userMenuButton3.addEventListener("click", function () {
    userMenu3.classList.toggle("hidden");
  });
}

// Device selector dropdown
const deviceSelector = document.getElementById("device-selector");
const deviceMenu = document.getElementById("device-menu");
if (deviceSelector && deviceMenu) {
  deviceSelector.addEventListener("click", function () {
    deviceMenu.classList.toggle("hidden");
  });
}

// Close dropdowns when clicking outside
document.addEventListener("click", function (e) {
  if (
    userMenuButton &&
    userMenu &&
    !userMenuButton.contains(e.target) &&
    !userMenu.contains(e.target)
  ) {
    userMenu.classList.add("hidden");
  }
  if (
    userMenuButton2 &&
    userMenu2 &&
    !userMenuButton2.contains(e.target) &&
    !userMenu2.contains(e.target)
  ) {
    userMenu2.classList.add("hidden");
  }
  if (
    userMenuButton3 &&
    userMenu3 &&
    !userMenuButton3.contains(e.target) &&
    !userMenu3.contains(e.target)
  ) {
    userMenu3.classList.add("hidden");
  }
  if (
    deviceSelector &&
    deviceMenu &&
    !deviceSelector.contains(e.target) &&
    !deviceMenu.contains(e.target)
  ) {
    deviceMenu.classList.add("hidden");
  }
});


// Logout button
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert("Logout berhasil!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        // An error happened.
      });
  });
}

const editBtn = document.getElementById("edit-profil-btn");
const saveBtn = document.getElementById("simpan-profil-btn");

const inputIds = [
  "nama-lengkap", "email", "telepon", "tanggal-lahir", "jenis-kelamin",
  "golongan-darah", "tinggi-badan", "berat-badan", "alergi", "kondisi-medis",
  "emergency-nama", "emergency-hubungan", "emergency-telepon", "emergency-email"
];

// Mode Edit
editBtn.addEventListener("click", () => {
  inputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.disabled = false;
  });
  saveBtn.classList.remove("hidden");
  editBtn.classList.add("hidden");
});

// Simpan ke Firestore
saveBtn.addEventListener("click", () => {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const updatedData = {
    name: document.getElementById("nama-lengkap").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("telepon").value,
    birthdate: document.getElementById("tanggal-lahir").value,
    gender: document.getElementById("jenis-kelamin").value,
    bloodType: document.getElementById("golongan-darah").value,
    height: document.getElementById("tinggi-badan").value.replace(" cm", "").trim(),
    weight: document.getElementById("berat-badan").value.replace(" kg", "").trim(),
    allergy: document.getElementById("alergi").value,
    medicalCondition: document.getElementById("kondisi-medis").value,
    emergencyName: document.getElementById("emergency-nama").value,
    emergencyRelation: document.getElementById("emergency-hubungan").value,
    emergencyPhone: document.getElementById("emergency-telepon").value,
    emergencyEmail: document.getElementById("emergency-email").value,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  firebase.firestore().collection("users").doc(user.uid).update(updatedData)
    .then(() => {
      alert("Profil berhasil diperbarui!");

      // Tambahkan satuan cm dan kg ke tampilan input (hanya visual, tidak masuk ke Firestore)
      const tinggiInput = document.getElementById("tinggi-badan");
      const beratInput = document.getElementById("berat-badan");

      if (tinggiInput && !tinggiInput.value.includes("cm")) {
        tinggiInput.value += " cm";
      }

      if (beratInput && !beratInput.value.includes("kg")) {
        beratInput.value += " kg";
      }

      inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.disabled = true;
      });
      saveBtn.classList.add("hidden");
      editBtn.classList.remove("hidden");
    })
    .catch((error) => {
      console.error("Gagal menyimpan profil:", error);
      alert("Gagal menyimpan profil: " + error.message);
    });
});
