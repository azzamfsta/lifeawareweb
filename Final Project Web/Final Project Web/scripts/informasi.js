firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // FUNGSI UNTUK MENGISI NAMA PENGGUNA DAN FOTO PROFIL DI HEADER
    const headerUserNameSpan = document.getElementById("header-user-display-name");
    const headerProfilePicture = document.getElementById("header-profile-picture");

    if (headerUserNameSpan || headerProfilePicture) {
      const db = firebase.firestore();
      db.collection("users").doc(user.uid).get()
        .then((doc) => {
          const defaultProfilePic = "https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg"; // Updated default to generic user icon from profile.html

          if (doc.exists) {
            const data = doc.data();
            if (headerUserNameSpan) {
              headerUserNameSpan.innerText = data.name || user.email || "Pengguna";
            }
            if (headerProfilePicture) {
              headerProfilePicture.src = data.photoURL || defaultProfilePic;
            }
          } else {
            if (headerUserNameSpan) {
              headerUserNameSpan.innerText = user.email || "Pengguna";
            }
            if (headerProfilePicture) {
              headerProfilePicture.src = user.photoURL || defaultProfilePic;
            }
          }
        })
        .catch((error) => {
          console.error("Error mengambil data pengguna untuk header:", error);
          if (headerUserNameSpan) {
            headerUserNameSpan.innerText = user.email || "Pengguna";
          }
          if (headerProfilePicture) {
            headerProfilePicture.src = user.photoURL || defaultProfilePic;
          }
        });
    }

    // Panggil fungsi untuk memuat artikel saat halaman dimuat
    // Awalnya tanpa query pencarian dan di halaman 1
    fetchAndDisplayHealthArticles();
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
        window.location.href = "#";
      })
      .catch((error) => {
        // An error happened.
      });
  });
}

// --- Variabel untuk Paginasi dan Pencarian ---
let currentPage = 1;
const articlesPerPage = 9; // 1 featured + 8 grid articles, ideal for 10 per page
let currentSearchQuery = ''; // Menyimpan query pencarian saat ini

// --- Fungsi untuk mengambil dan menampilkan artikel kesehatan ---
// Parameter 'query' ditambahkan untuk pencarian, 'page' untuk paginasi
async function fetchAndDisplayHealthArticles(query = currentSearchQuery, page = currentPage) {
  const apiKey = "f9189a2016c54c97bc65dbe94fd03dc1";
  let apiUrl = `https://newsapi.org/v2/top-headlines?category=health&pageSize=${articlesPerPage}&page=${page}&apiKey=${apiKey}`;

  if (query) {
    apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=id&sortBy=relevancy&pageSize=${articlesPerPage}&page=${page}&apiKey=${apiKey}`;
  }

  const featuredArticleContainer = document.getElementById("featured-article-container");
  const articlesGridContainer = document.getElementById("articles-grid-container");
  const pageNumbersContainer = document.getElementById("page-numbers-container");
  const prevPageBtn = document.getElementById("prev-page-btn");
  const nextPageBtn = document.getElementById("next-page-btn");

  // Tampilkan pesan loading
  if (featuredArticleContainer) featuredArticleContainer.innerHTML = '<p class="p-6 text-center text-gray-500">Memuat artikel unggulan...</p>';
  if (articlesGridContainer) articlesGridContainer.innerHTML = '<p class="p-6 text-center text-gray-500 col-span-full">Memuat artikel lainnya...</p>';
  if (pageNumbersContainer) pageNumbersContainer.innerHTML = ''; // Clear pagination numbers
  if (prevPageBtn) prevPageBtn.classList.add('pointer-events-none', 'opacity-50');
  if (nextPageBtn) nextPageBtn.classList.add('pointer-events-none', 'opacity-50');


  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const articles = data.articles;
    const totalResults = data.totalResults;
    const totalPages = Math.min(Math.ceil(totalResults / articlesPerPage), 5); // News API top-headlines often limit to ~100 results, so cap pages

    // Update current page
    currentPage = page;

    if (articles && articles.length > 0) {
      // Tampilkan Artikel Unggulan (artikel pertama dari halaman)
      const featuredArticle = articles[0];
      if (featuredArticleContainer) {
        featuredArticleContainer.innerHTML = `
          <div class="md:flex">
            <div class="md:w-1/2 h-64 md:h-auto">
              <img src="${featuredArticle.urlToImage || 'https://via.placeholder.com/800x500?text=Gambar+Tidak+Tersedia'}" alt="${featuredArticle.title}" class="w-full h-full object-cover object-top" />
            </div>
            <div class="md:w-1/2 p-6 md:p-8">
              <div class="flex items-center mb-2">
                <span class="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">${featuredArticle.source.name || 'Umum'}</span>
                <span class="text-gray-500 text-xs ml-2">${new Date(featuredArticle.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">${featuredArticle.title}</h2>
              <p class="text-gray-600 mb-6">${featuredArticle.description || 'Tidak ada deskripsi.'}</p>
              <a href="${featuredArticle.url}" target="_blank" class="bg-primary text-white px-6 py-2 !rounded-button hover:bg-blue-600 whitespace-nowrap">Baca Selengkapnya</a>
            </div>
          </div>
        `;
      }

      // Tampilkan Artikel Lainnya (mulai dari artikel kedua hingga articlesPerPage)
      if (articlesGridContainer) {
        articlesGridContainer.innerHTML = '';
        // Mulai dari indeks 1 karena artikel 0 adalah featured
        for (let i = 1; i < articles.length && i < articlesPerPage; i++) {
          const article = articles[i];
          const articleCard = document.createElement('div');
          articleCard.className = 'bg-white rounded shadow-md overflow-hidden';
          articleCard.innerHTML = `
            <div class="h-48">
              <img src="${article.urlToImage || 'https://via.placeholder.com/400x250?text=Gambar+Tidak+Tersedia'}" alt="${article.title}" class="w-full h-full object-cover object-top" />
            </div>
            <div class="p-6">
              <div class="flex items-center mb-2">
                <span class="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">${article.source.name || 'Umum'}</span>
                <span class="text-gray-500 text-xs ml-2">${new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">${article.title}</h3>
              <p class="text-gray-600 mb-4">${article.description || 'Tidak ada deskripsi.'}</p>
              <a href="${article.url}" target="_blank" class="text-primary hover:text-blue-700 text-sm flex items-center">
                <span>Baca Selengkapnya</span>
                <i class="ri-arrow-right-s-line ml-1"></i>
              </a>
            </div>
          `;
          articlesGridContainer.appendChild(articleCard);
        }
      }
    } else {
      if (featuredArticleContainer) featuredArticleContainer.innerHTML = '<p class="p-6 text-center text-gray-500">Tidak ada artikel kesehatan yang ditemukan.</p>';
      if (articlesGridContainer) articlesGridContainer.innerHTML = '';
    }

    // --- Generate Pagination Buttons ---
    if (pageNumbersContainer) {
      pageNumbersContainer.innerHTML = ''; // Bersihkan tombol halaman yang lama
      for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = "#";
        pageLink.className = `px-4 py-2 rounded ${i === currentPage ? 'text-white bg-primary' : 'text-gray-700 bg-white hover:bg-gray-100'}`;
        pageLink.dataset.page = i; // Simpan nomor halaman di data attribute
        pageLink.innerText = i;
        pageLink.addEventListener('click', (e) => {
          e.preventDefault();
          fetchAndDisplayHealthArticles(currentSearchQuery, i); // Panggil ulang dengan halaman baru
        });
        pageNumbersContainer.appendChild(pageLink);
      }
    }

    // Atur status tombol Prev/Next
    if (prevPageBtn) {
      if (currentPage > 1) {
        prevPageBtn.classList.remove('pointer-events-none', 'opacity-50');
        prevPageBtn.addEventListener('click', (e) => {
          e.preventDefault();
          fetchAndDisplayHealthArticles(currentSearchQuery, currentPage - 1);
        }, { once: true }); // Use once:true to prevent multiple listeners
      } else {
        prevPageBtn.classList.add('pointer-events-none', 'opacity-50');
      }
    }

    if (nextPageBtn) {
      if (currentPage < totalPages) {
        nextPageBtn.classList.remove('pointer-events-none', 'opacity-50');
        nextPageBtn.addEventListener('click', (e) => {
          e.preventDefault();
          fetchAndDisplayHealthArticles(currentSearchQuery, currentPage + 1);
        }, { once: true }); // Use once:true to prevent multiple listeners
      } else {
        nextPageBtn.classList.add('pointer-events-none', 'opacity-50');
      }
    }


  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil artikel:", error);
    if (featuredArticleContainer) featuredArticleContainer.innerHTML = '<p class="p-6 text-center text-red-500">Gagal memuat artikel. Silakan coba lagi nanti.</p>';
    if (articlesGridContainer) articlesGridContainer.innerHTML = '';
    if (pageNumbersContainer) pageNumbersContainer.innerHTML = '';
    if (prevPageBtn) prevPageBtn.classList.add('pointer-events-none', 'opacity-50');
    if (nextPageBtn) nextPageBtn.classList.add('pointer-events-none', 'opacity-50');
  }
}

// --- Penanganan Pencarian Artikel ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    if (searchButton && searchInput) {
        searchButton.addEventListener("click", () => {
            const query = searchInput.value.trim();
            currentSearchQuery = query; // Simpan query pencarian
            currentPage = 1; // Reset ke halaman 1 setiap kali mencari
            fetchAndDisplayHealthArticles(query, currentPage);
        });

        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const query = searchInput.value.trim();
                currentSearchQuery = query; // Simpan query pencarian
                currentPage = 1; // Reset ke halaman 1 setiap kali mencari
                fetchAndDisplayHealthArticles(query, currentPage);
            }
        });
    }

    // Logika untuk tombol kategori (jika ingin diimplementasikan nanti)
});