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

  var database = firebase.database(),
      trains = database.ref("trains");
  
   var trainData = '',
        name = '',
        destination = '',
        firstTrain = '',
        frequency = '';

  trains.on("child_added", function (childSnapshot) {
    trainData = childSnapshot.val(),
    name = trainData.name,
    destination = trainData.destination,
    firstTrain = trainData.first_train,
    frequency = trainData.frequency;
    
    buildSchedule(name, destination, firstTrain, frequency);
    
  }, errData);
  function errData(data) {
    console.log(data);
  }

  function buildSchedule(name, destination, firstTrain, frequency) {
    var newRow = $("<tr>"),
        mdlCellClass = "mdl-data-table__cell--non-numeric",
        nextTrain = getNextTrain(firstTrain, frequency);

    console.log(getNextTrain(firstTrain, frequency));

    var nameCell = $("<td>").addClass(mdlCellClass).html(name),
        destCell = $("<td>").addClass(mdlCellClass).html(destination),
        freqCell = $("<td>").addClass(mdlCellClass).html(frequency),
        nextCell = $("<td>").addClass(mdlCellClass).html(nextTrain),
        awayCell = $("<td>").addClass(mdlCellClass).html(moment(nextTrain, 'h:mm A').fromNow());

    newRow
      .append(nameCell)
      .append(destCell)
      .append(freqCell)
      .append(nextCell)
      .append(awayCell);
    
    $("#schedule").append(newRow);
  }

  function getNextTrain(firstTrain, interval) {
    var now = moment(),
        hours = firstTrain.substr(0, 2),
        minutes = firstTrain.substr(3, 4),
        train = moment().startOf('day').hour(parseInt(hours)).minute(parseInt(minutes)),
        duration = moment.duration(now.diff(train)).asMinutes(),
        minutesUntil = duration % interval,
        nextTrain = interval - minutesUntil,
        newTrain = now.add(nextTrain, "minutes").format("HH:MM");
    
    return moment(now).format("h:mm a");
  }

  function resetFields() {
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  }

  $("#submit").on("click", function (event) {
    event.preventDefault();
    var trainName = $("#train-name-input").val().trim(),
        destination = $("#destination-input").val().trim(),
        first_train = $("#first-train-input").val().trim(),
        frequency = $("#frequency-input").val().trim();

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

