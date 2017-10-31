var bigTable = document.getElementsByClassName("table-responsive");

var children = bigTable[0].children;
console.log(children);
var h2Text = [];

for (var i = 0; i < children.length; i = i + 2) {
  //Take only the h2s
  h2Text.push(children[i].outerText);
}

var CHANGETHISVARIABLE = "TKITE";
var programs = [];
programs.push(CHANGETHISVARIABLE);

var correctTableAtIndex = -1;
var correctTableAtIndexes = [];

//Add the indexes for the different tables to the correctTableAtIndexes variable.
for (var j = 0; j < h2Text.length; j++) {
  for (var i = 0; i < programs.length; i++) {
    if (h2Text[j].includes(programs[i])) {
      correctTableAtIndex = j;
      correctTableAtIndexes.push(j);
    }
  }
}

var tot = 0;
var courses = new Array();
var totalCredits = 0;

// Loop through the seperate tables to get all courses for calculation.
for (var x = 0; x < correctTableAtIndexes.length; x++) {
  var courses = [].concat.apply(
    courses,
    children[2 * correctTableAtIndexes[x] + 1]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr")
  );
}

console.log(courses);
// Within each table loop through the courses and calculate the total grade times points.
for (var i = 0; i < courses.length; i++) {
  var course = courses[i].cells;
  if (course[3].outerText === "G") {
    courses.splice(i, 1); // Remove the elements, it should not affect the whole calculation.
  } else {
    var grade = parseFloat(course[3].outerText.replace(",", "."));
    var credits = parseFloat(course[2].outerText.replace(",", "."));
    totalCredits = totalCredits + credits;
    tot = tot + grade * credits;
  }
}

console.log("Your average grade is: " + tot / totalCredits);
