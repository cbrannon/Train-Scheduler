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
      var currentTime = moment();
      console.log(moment(firstTrain).isSameOrBefore(currentTime));
      // console.log(moment(firstTrain, 'HH:mm').format('h:mm A'));
      // console.log(moment(currentTime, 'HH:mm').format('h:mm A'));
  }, errData);

  function errData(data) {
    console.log(data);
  }

  function buildSchedule(name, destination, firstTrain, frequency) {
    var newRow = $("<tr>");
    var mdlCellClass = "mdl-data-table__cell--non-numeric";
    nextTrain = getNextTrain(firstTrain, frequency);

    // var nextTrain = moment(firstTrain, 'HH:mm').format('h:mm A');
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

  function getNextTrain(train, interval) {
    // while (moment(train).add(30, "minutes").isSameOrBefore(moment())) {

    // }
    return moment().add(interval,'minutes').format('hh:mm A')
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

