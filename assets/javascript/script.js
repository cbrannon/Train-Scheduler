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

  trains.on("child_added", function (childSnapshot) {
      var trainData = childSnapshot.val();
      var name = trainData.name;
      var destination = trainData.destination;
      var firstTrain = trainData.first_train;
      var frequency = trainData.frequency;
      buildSchedule(name, destination, firstTrain, frequency);
  }, errData);
  function errData(data) {
    console.log(data);
  }

  function buildSchedule(name, destination, firstTrain, frequency) {
    var newRow = $("<tr>");
    var mdlCellClass = "mdl-data-table__cell--non-numeric";

    // var nextTrain = getNextTrain(firstTrain, frequency);
    var nextTrain = getNextTrain(firstTrain, frequency);
    console.log(getNextTrain(firstTrain, frequency));

    var nameCell = $("<td>").addClass(mdlCellClass).html(name);
    var destCell = $("<td>").addClass(mdlCellClass).html(destination);
    var freqCell = $("<td>").addClass(mdlCellClass).html(frequency);
    var nextCell = $("<td>").addClass(mdlCellClass).html(nextTrain);
    var awayCell = $("<td>").addClass(mdlCellClass).html(moment(nextTrain, 'h:mm A').fromNow());

    newRow
      .append(nameCell)
      .append(destCell)
      .append(freqCell)
      .append(nextCell)
      .append(awayCell);
    
    $("#schedule").append(newRow);
  }

// The first train of the day comes in at 3:00 AM.
// The train runs every 17 minutes
// The current time is 7:12 PM.
// There have been no delays and will be no delays.

// currentTime - startTime = Total minutes between
// totalMinutes % interval = minutes into next train
// interval - minutes into gives us time of next train  

  function getNextTrain(firstTrain, interval) {
    var now = moment();
    var hours = firstTrain.substr(0, 2);
    var minutes = firstTrain.substr(3, 4);
    var train = moment().startOf('day').hour(parseInt(hours)).minute(parseInt(minutes));
    var duration = moment.duration(now.diff(train)).asMinutes();
    var minutesUntil = duration % interval;
    var nextTrain = interval - minutesUntil;
    var newTrain = now.add(nextTrain, "minutes").format("HH:MM");
    
    // return train.format("HH:MM");
    return moment(now).format("h:mm a");
  }

  function resetFields() {
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  }

  $("#submit").on("click", function () {
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var first_train = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    if (trainName != "" || destination != "" || first_train != "" || frequency != "") {

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

