firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
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

document.addEventListener("DOMContentLoaded", function () {
  // Initialize charts
  //#region Initialize Heart Rate Chart
  initializeHeartRateChart();
  function initializeHeartRateChart() {
    const heartRateChart = document.getElementById("heart-rate-chart");
    if (heartRateChart) {
      const chart = echarts.init(heartRateChart);
      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderColor: "#ddd",
          textStyle: {
            color: "#1f2937",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "00:00",
            "03:00",
            "06:00",
            "09:00",
            "12:00",
            "15:00",
            "18:00",
            "21:00",
          ],
          axisLine: {
            lineStyle: {
              color: "#ddd",
            },
          },
          axisLabel: {
            color: "#1f2937",
          },
        },
        yAxis: {
          type: "value",
          min: 50,
          max: 100,
          axisLine: {
            lineStyle: {
              color: "#ddd",
            },
          },
          axisLabel: {
            color: "#1f2937",
          },
          splitLine: {
            lineStyle: {
              color: "#f0f0f0",
            },
          },
        },
        series: [
          {
            name: "Detak Jantung",
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              width: 3,
              color: "rgba(252, 141, 98, 1)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(252, 141, 98, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(252, 141, 98, 0)",
                },
              ]),
            },
            data: [65, 62, 58, 72, 78, 82, 75, 68],
          },
        ],
      };
      chart.setOption(option);

      window.addEventListener("resize", function () {
        chart.resize();
      });
    }
  }

  //#region Initialize SpO2 Chart
  initializeSpO2Chart();
  function initializeSpO2Chart() {
    const spo2Chart = document.getElementById("spo2-chart");
    if (spo2Chart) {
      const chart = echarts.init(spo2Chart);
      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderColor: "#ddd",
          textStyle: {
            color: "#1f2937",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "00:00",
            "03:00",
            "06:00",
            "09:00",
            "12:00",
            "15:00",
            "18:00",
            "21:00",
          ],
          axisLine: {
            lineStyle: {
              color: "#ddd",
            },
          },
          axisLabel: {
            color: "#1f2937",
          },
        },
        yAxis: {
          type: "value",
          min: 90,
          max: 100,
          axisLine: {
            lineStyle: {
              color: "#ddd",
            },
          },
          axisLabel: {
            color: "#1f2937",
          },
          splitLine: {
            lineStyle: {
              color: "#f0f0f0",
            },
          },
        },
        series: [
          {
            name: "SpO2",
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              width: 3,
              color: "rgba(87, 181, 231, 1)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(87, 181, 231, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(87, 181, 231, 0)",
                },
              ]),
            },
            data: [97, 96, 95, 96, 98, 97, 96, 97],
          },
        ],
      };
      chart.setOption(option);

      window.addEventListener("resize", function () {
        chart.resize();
      });
    }
  }


});
