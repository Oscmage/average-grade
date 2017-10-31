var bigTable = document.getElementsByClassName("table-responsive");

var tables = document.getElementsByClassName("table-bordered");

var addCheckboxesForProgram = () => {
  for (let i = 0; i < tables.length; i++) {
    const trArray = tables[i].children[0].children[0];
    const sp2 = trArray.children[0];

    const sp1 = document.createElement("input");
    sp1.type = "checkbox";
    sp1.checked = true;
    sp1.class = "id";

    // Get a reference to the parent element
    const parentTr = sp2.parentNode;

    // Insert the new element into the DOM before sp2
    parentTr.insertBefore(sp1, sp2);

    sp1.addEventListener("click", evt => {
      const toElement = evt.toElement;
      const relatedCheckboxes = tables[i].children[1].getElementsByTagName(
        "input"
      );

      for (let j = 0; j < relatedCheckboxes.length; j++) {
        relatedCheckboxes[j].checked = toElement.checked;
      }
    });
  }
};

addCheckboxesForProgram();

function addCheckboxesForCourses() {
  for (var i = 0; i < tables.length; i++) {
    var trArray = tables[i].children[1].children;
    for (var j = 0; j < trArray.length; j++) {
      var tr = trArray[j];
      var trChildren = tr.children;

      var sp1 = document.createElement("input");
      sp1.type = "checkbox";
      sp1.checked = true;
      sp1.class = "id";

      // Get a reference to the element, before we want to insert the element
      var sp2 = trChildren[0];
      // Get a reference to the parent element
      var parentTr = sp2.parentNode;

      // Insert the new element into the DOM before sp2
      parentTr.insertBefore(sp1, sp2);
    }
  }
}

function getAllCourses() {
  var allCourses = new Array();
  // Loop through the seperate tables to get all allCourses for calculation.
  for (var x = 0; x < tables.length; x++) {
    var allCourses = [].concat.apply(
      allCourses,
      tables[x].getElementsByTagName("tbody")[0].getElementsByTagName("tr")
    );
  }
  return allCourses;
}

function getCheckedCourses() {
  var allCourses = getAllCourses();

  // Within each table loop through the allCourses and calculate the total grade times points.
  for (var i = 0; i < allCourses.length; i++) {
    var inputField = allCourses[i].getElementsByTagName("input")[0];
    var course = allCourses[i].cells;

    if (inputField.checked === false) {
      allCourses.splice(i, 1); // Remove the elements, it should not affect the whole calculation.
    }
  }

  return allCourses;
}

function getAverageGrade() {
  var tot = 0;
  var totalCredits = 0;

  var checkedCourses = getCheckedCourses();

  for (var i = 0; i < checkedCourses.length; i++) {
    var course = checkedCourses[i].cells;
    if (course[3].outerText === "G") {
      checkedCourses.splice(i, 1); // Remove the elements, it should not affect the whole calculation.
    } else {
      var grade = parseFloat(course[3].outerText.replace(",", "."));
      var credits = parseFloat(course[2].outerText.replace(",", "."));

      totalCredits = totalCredits + credits;
      tot = tot + grade * credits;
    }
  }
  return tot / totalCredits;
}

function init() {
  addCheckboxesForCourses();
}

init();

console.log("Your average grade is: " + getAverageGrade());

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "getAverageGrade":
      sendResponse(getAverageGrade());
      break;
  }
});
