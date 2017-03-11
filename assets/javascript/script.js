$(document).ready(function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDoIRkcr0PK-Kwt3BttSU8E6r24k7LBvEA",
    authDomain: "train-scheduler-52c20.firebaseapp.com",
    databaseURL: "https://train-scheduler-52c20.firebaseio.com",
    storageBucket: "train-scheduler-52c20.appspot.com",
    messagingSenderId: "353670936457"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var trains = database.ref("trains");

  trains.on("value", getData, errData);

  function getData(data) {
    console.log(data.val());
    var schedules = data.val();
    var keys = Object.keys(schedules);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var name = schedules[key].name;
      var destination = schedules[key].destination;
      var frequency = schedules[key].frequency;
      var firstTrain = schedules[key].first_train;

      buildSchedule(name, destination, frequency);
    }
  }

  function errData(data) {
    console.log(data);
  }

  function buildSchedule(name, destination, frequency) {
    var newRow = $("<tr>");
    var mdlCellClass = "mdl-data-table__cell--non-numeric";
    var nameCell = $("<td>").addClass(mdlCellClass).html(name);
    var destCell = $("<td>").addClass(mdlCellClass).html(destination);
    var freqCell = $("<td>").addClass(mdlCellClass).html(frequency);
    var nextCell = $("<td>").addClass(mdlCellClass).html("05:02 PM");
    var awayCell = $("<td>").addClass(mdlCellClass).html("30");

    newRow
      .append(nameCell)
      .append(destCell)
      .append(freqCell)
      .append(nextCell)
      .append(awayCell);
    
    $("#schedule").append(newRow);
  }

  function resetFields() {
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  }

  $("#submit").on("click", function () {
    $("#schedule").empty();
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var first_train = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    if (trainName != "" && destination != "" && first_train != "" && frequency != "") {

      var data = {
        name: trainName,
        destination: destination,
        first_train: first_train,
        frequency: frequency,
      }

      trains.push(data);
      resetFields();
    }
  });
});

