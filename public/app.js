function getResults() {
  // Empty any results currently on the page
  $("#results").empty();
  // Grab all of the current notes
  $.getJSON("/articles", function(data) {
    // For each note...
    for (var i = 0; i < data.length; i++) {
      // ...populate #results with a p-tag that includes the note's title and object id
      $("#results").prepend("<p class='data-entry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
        data[i]._id + ">" + data[i].title + "</span><span class=delete>X</span></p>");
    }// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<h6 data-id='" + data[i]._id + "'>" + data[i].title +"</h6>" + "<a href="+data[i].link+">Read more</a><hr>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "h6", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' placeholder='Title' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<input id='bodyinput' name='body' placeholder='Note...'></input>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button class='right-align' data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

  });
}


getResults();

$(document).on("click", "#make-new", function () {

  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      title: $("#title").val(),
      note: $("#note").val(),
      created: Date.now()
    }
  })
    .then(function (data) {
      $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
        data._id + ">" + data.title + "</span><span class=delete>X</span></p>");
      $("#note").val("");
      $("#title").val("");
    });
});

$("#clear-all").on("click", function () {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clearall",
    success: function (response) {
      $("#results").empty();
    }
  });
});

$(document).on("click", ".delete", function () {
  var selected = $(this).parent();
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),

    success: function (response) {
      selected.remove();
      $("#note").val("");
      $("#title").val("");
      $("#action-button").html("<button id='make-new'>Submit</button>");
    }
  });
});

$(document).on("click", ".dataTitle", function () {
  var selected = $(this);
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function (data) {
      $("#note").val(data.note);
      $("#title").val(data.title);
      $("#action-button").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
    }
  });
});

$(document).on("click", "#updater", function () {
  var selected = $(this);
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#title").val(),
      note: $("#note").val()
    },
    success: function (data) {
      $("#note").val("");
      $("#title").val("");
      $("#action-button").html("<button id='make-new'>Submit</button>");
      getResults();
    }
  });
});

$(document).on("click", "#deletenote", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: "",
      body: ""
    }
  })
    .then(function (data) {
      console.log(data);
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

window.sr = ScrollReveal();
sr.reveal('h1', {
  duration: 2000,
  origin: 'top'
});
sr.reveal('.l6', {
  duration: 3000,
  origin: 'bottom'
});
