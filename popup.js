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
              "Your average grade is: " + response.average;
          }
        );
      });
    });

    const link = document.getElementById("start-page-link");
    link.addEventListener("click", function() {
      chrome.tabs.update({
        url: "https://www.student.ladok.se/student/#/avslutade"
      });
    });
  },
  false
);
