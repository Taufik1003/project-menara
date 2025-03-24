var firebaseConfig = {
    apiKey: "AIzaSyANOjOqIpVDCr1LJtOixOu9oc8E9Wswg40",
    authDomain: "project-menara-6dec8.firebaseapp.com",    
    databaseURL: "https://project-menara-6dec8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "project-menara-6dec8",
    storageBucket: "project-menara-6dec8.firebasestorage.app",
    messagingSenderId: "283139904832",
    appId: "1:283139904832:web:23863d9c8016b312be56a5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function(){
    var database = firebase.database();
    var Led1Status;
    var Led2Status;
    var buzzStatus;
    
    // Chart initialization
    var ctx = document.getElementById('sensorChart').getContext('2d');
    var sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.3,
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.3,
                    borderWidth: 2,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#fff'
                    }
                },
                title: {
                    display: true,
                    text: 'Temperature & Humidity',
                    color: '#fff',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
    
    // Function to update the chart
    function updateChart(label, tempValue, humValue) {
        // Limit to 10 data points
        if (sensorChart.data.labels.length > 10) {
            sensorChart.data.labels.shift();
            sensorChart.data.datasets[0].data.shift();
            sensorChart.data.datasets[1].data.shift();
        }
        
        sensorChart.data.labels.push(label);
        sensorChart.data.datasets[0].data.push(tempValue);
        sensorChart.data.datasets[1].data.push(humValue);
        sensorChart.update();
    }
    
    // Listen for changes in sensor data
    database.ref('/sensorData').on('value', function(snapshot) {
        var sensorData = snapshot.val();
        if (sensorData) {
            var temperature = sensorData.temperature;
            var humidity = sensorData.humidity;
            
            // Update HTML
            $('#temperature-value').text(temperature.toFixed(1) + ' °C');
            $('#humidity-value').text(humidity.toFixed(1) + ' %');
            
            // Update chart with current time as label
            var now = new Date();
            var timeLabel = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
            updateChart(timeLabel, temperature, humidity);
        }
    });
    
    // Load last 10 history records for chart initialization
    database.ref('/sensorHistory').limitToLast(10).once('value', function(snapshot) {
        var historyData = snapshot.val();
        if (historyData) {
            var labels = [];
            var temperatures = [];
            var humidities = [];
            
            // Convert object to array and sort by time
            var historyArray = [];
            snapshot.forEach(function(childSnapshot) {
                historyArray.push({
                    key: childSnapshot.key,
                    value: childSnapshot.val()
                });
            });
            
            historyArray.sort(function(a, b) {
                return parseInt(a.key) - parseInt(b.key);
            });
            
            // Extract data for chart
            historyArray.forEach(function(item) {
                var data = item.value;
                labels.push(new Date(parseInt(data.time)).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}));
                temperatures.push(data.temperature);
                humidities.push(data.humidity);
            });
            
            // Update chart with historical data
            sensorChart.data.labels = labels;
            sensorChart.data.datasets[0].data = temperatures;
            sensorChart.data.datasets[1].data = humidities;
            sensorChart.update();
        }
    });
    
    // Original toggle button logic
    database.ref().on("value", function(snap){
        Led1Status = snap.val().Led1Status;
        Led2Status = snap.val().Led2Status;
        buzzStatus = snap.val().buzzStatus;
        if(Led1Status == "1"){
            document.getElementById("unact").style.display = "none";
            document.getElementById("act").style.display = "block";
        } else {
            document.getElementById("unact").style.display = "block";
            document.getElementById("act").style.display = "none";
        }
        if(Led2Status == "1"){
            document.getElementById("unact1").style.display = "none";
            document.getElementById("act1").style.display = "block";
        } else {
            document.getElementById("unact1").style.display = "block";
            document.getElementById("act1").style.display = "none";
        }
        if(buzzStatus == "1"){
            document.getElementById("unact2").style.display = "none";
            document.getElementById("act2").style.display = "block";
        } else {
            document.getElementById("unact2").style.display = "block";
            document.getElementById("act2").style.display = "none";
        }
    });

    $(".toggle-btn").click(function(){
        var firebaseRef = firebase.database().ref().child("Led1Status");
        if(Led1Status == "1"){
            firebaseRef.set("0");
            Led1Status = "0";
        } else {
            firebaseRef.set("1");
            Led1Status = "1";
        }
    });
    
    $(".toggle-btn1").click(function(){
        var firebaseRef = firebase.database().ref().child("Led2Status");
        if(Led2Status == "1"){
            firebaseRef.set("0");
            Led2Status = "0";
        } else {
            firebaseRef.set("1");
            Led2Status = "1";
        }
    });
    
    $(".toggle-btn2").click(function(){
        var firebaseRef = firebase.database().ref().child("buzzStatus");
        if(buzzStatus == "1"){
            firebaseRef.set("0");
            buzzStatus = "0";
        } else {
            firebaseRef.set("1");
            buzzStatus = "1";
        }
    });
});