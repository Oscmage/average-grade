document.addEventListener(
  "DOMContentLoaded",
  function() {
    var button = document.getElementById("calculate-grade-button");
    button.addEventListener("click", function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: "getAverageGrade"
          },
          function(response) {
            document.getElementById("grade").textContent =
              "Your average grade is: " + response;
          }
        );
      });
    });
  },
  false
);
