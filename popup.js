document.addEventListener(
  "DOMContentLoaded",
  function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function(
        response
      ) {
        if (response) {
          console.log("Already there");
        } else {
          console.log("Not there, inject contentscript");
        }
      });
    });
    console.log("WHOHO!");
    var calculateGradeButton = document.getElementById(
      "calculate-grade-button"
    );
    const children = document.getElementsByClassName("table-responsive");
    calculateGradeButton.addEventListener(
      "click",
      function() {
        const inputValue = document.getElementById("program").value;
        console.log(inputValue);
        const children = document.getElementsByClassName("table-responsive");
        console.log(children);
      },
      false
    );
  },
  false
);
