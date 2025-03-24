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
	})
	$(".toggle-btn1").click(function(){
		var firebaseRef = firebase.database().ref().child("Led2Status");
		if(Led2Status == "1"){
			firebaseRef.set("0");
			Led2Status = "0";
		} else {
			firebaseRef.set("1");
			Led2Status = "1";
		}
	})
	$(".toggle-btn2").click(function(){
		var firebaseRef = firebase.database().ref().child("buzzStatus");
		if(buzzStatus == "1"){
			firebaseRef.set("0");
			buzzStatus = "0";
		} else {
			firebaseRef.set("1");
			buzzStatus = "1";
		}
	})
});