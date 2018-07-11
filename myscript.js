class CheckBoxHandler {
  static addCheckboxes() {
    const courseContainerList = document.getElementsByTagName(
      "ladok-avslutad-kurs"
    );

    for (let i = 0; i < courseContainerList.length; i++) {
      const cardBody = courseContainerList
        .item(i)
        .getElementsByClassName("card-body")[0];
      this._addCheckbox(cardBody);
    }
  }

  static _addCheckbox(cardBody) {
    let checkBox = document.createElement("INPUT");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "average-grade-checkbox");
    checkBox.checked = true;
    cardBody.appendChild(checkBox);
  }

  static isMarked(cardBody) {
    const checkBox = cardBody.getElementsByClassName(
      "average-grade-checkbox"
    )[0];
    return checkBox.checked;
  }
}

// Retrives the average grade for the courses.
// Formula used for calculating the average grade: sum(hp * grade)/sum(hp)
var getAverageGrade = function() {
  let sumHpTimesGrade = 0;
  let totalHp = 0;
  // All courses as their squared box
  const courseContainerList = document.getElementsByTagName(
    "ladok-avslutad-kurs"
  );
  for (let i = 0; i < courseContainerList.length; i++) {
    const cardBody = courseContainerList
      .item(i)
      .getElementsByClassName("card-body")[0];
    let obj = getHpAndGrade(cardBody);
    totalHp += obj.hp;
    sumHpTimesGrade += obj.hp * obj.grade;
  }
  return totalHp === 0
    ? "You need to pick courses to get a value..."
    : sumHpTimesGrade / totalHp;
};

// Retrives the hp and grade for a course.
var getHpAndGrade = function(cardBody) {
  if (!CheckBoxHandler.isMarked(cardBody)) {
    return { grade: 0, hp: 0 };
  }
  const hpStr = getHpStr(cardBody);
  // There might be things like teknisk basår which should not be counted.
  if (hpStr === null) {
    return { grade: 0, hp: 0 };
  }
  const hp = parseFloat(hpStr);

  // Grade found after ':' the +1 is because the index is inclusive
  const gradeStr = getGradeStr(cardBody);
  // If you have a grade of G that should not be counted in to the end result.
  if (["3", "4", "5"].indexOf(gradeStr) === -1) {
    return { grade: 0, hp: 0 };
  }
  const grade = parseInt(gradeStr);
  return { grade, hp };
};

// Retrieves the hp str from a cardbody html object.
var getHpStr = function(cardBody) {
  const desktopElem = cardBody.getElementsByClassName("ldk-visa-desktop")[0];
  const linkElem = desktopElem.getElementsByTagName("a")[0];
  const courseInfo = linkElem.textContent;
  const firstSplitterIdx = courseInfo.indexOf("|");
  const secondSplitterIdx = courseInfo.lastIndexOf("|");
  // HP found in between '|' the + 1 is because the index is inclusive
  let hpStr = courseInfo.substring(firstSplitterIdx + 1, secondSplitterIdx);
  if (hpStr.indexOf("hp") === -1) {
    return null;
  }
  return hpStr.replace("hp", "").trim();
};

// Retrieves the grade string from a cardbody html object
var getGradeStr = function(cardBody) {
  const strongElem = cardBody.getElementsByTagName("strong")[0];
  const gradeInfo = strongElem.textContent;
  const gradeColonIdx = gradeInfo.indexOf(":");
  // Grade found after ':' the +1 is because the index is inclusive
  const gradeStr = gradeInfo.substring(gradeColonIdx + 1).trim();
  return gradeStr;
};

// Observes the dom for changes to "ladok-avslutade-kurser" and then updates the last mutationTime
class Observer {
  constructor() {
    this.config = {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    };
    this.targetNode = document.getElementsByTagName("ng-component")[0];
    this.lastMutationTime = null;
    this.observer = null;
  }
  start() {
    this.observer = new MutationObserver(mut => {
      this.lastMutationTime = new Date();
    });
    this.observer.observe(this.targetNode, this.config);
  }
  stop() {
    if (this.observer !== null) {
      this.observer.disconnect();
    }
  }
  getLastMutationTime() {
    if (this.lastMutationTime === null) {
      return null;
    } else {
      return this.lastMutationTime.getTime();
    }
  }
}

// Startup
function init() {
  const obs = new Observer();
  obs.start();
  let interval = setInterval(function() {
    lastMutationTime = obs.getLastMutationTime();
    if (
      lastMutationTime !== null &&
      lastMutationTime < new Date().getTime() - 100
    ) {
      obs.stop();
      clearInterval(interval);
      // Add the checkboxes since the dom is now loaded.
      CheckBoxHandler.addCheckboxes();
    }
  }, 200);
}

if (performance.navigation.type == 1) {
  init();
}

// Message handling from popup.js and background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case "getAverageGrade":
      sendResponse({ average: getAverageGrade() });
      break;
    case "urlChange":
      urlHandler(request.url);
      break;
  }
});

var urlHandler = function(url) {
  if (url === "https://www.student.ladok.se/student/#/avslutade") {
    init();
  }
};
