var bigTable = document.getElementsByClassName("table-responsive");

var children = bigTable[0].children;
var h2Text = [];

for (var i = 0; i < children.length; i = i + 2) {
  //Take only the h2s
  h2Text.push(children[i].outerText);
}

var CHANGETHISVARIABLE = "TKITE";
var correctTableAtIndex = -1;

for (var j = 0; j < h2Text.length; j++) {
  if (h2Text[j].includes(CHANGETHISVARIABLE)) {
    correctTableAtIndex = j;
  }
}

var courses = children[2 * correctTableAtIndex + 1]
  .getElementsByTagName("tbody")[0]
  .getElementsByTagName("tr");

var tot = 0;
for (var i = 0; i < courses.length; i++) {
  var course = courses[i].cells;
  var credits = parseFloat(course[2].outerText.replace(",", "."));
  var grade = parseFloat(course[3].outerText.replace(",", "."));
  tot = tot + grade * credits;
}

console.log("Your average grade is: " + tot / courses.length / 7.5);
