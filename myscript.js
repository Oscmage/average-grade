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
  let sumHpTimeGrade = 0;
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
    sumHpTimeGrade += obj.hp * obj.grade;
  }
  return totalHp === 0
    ? "You need to pick courses to get a value..."
    : sumHpTimeGrade / totalHp;
};

// Retrives the hp and grade for a course.
var getHpAndGrade = function(cardBody) {
  if (!CheckBoxHandler.isMarked(cardBody)) {
    return { grade: 0, hp: 0 };
  }
  const hpStr = getHpStr(cardBody);
  // There might be things like teknisk basår which should not be counted.
  if (hpStr.indexOf("fup") !== -1) {
    return { grade: 0, hp: 0 };
  }
  const hp = parseFloat(hpStr);

  // Grade found after ':' the +1 is because the index is inclusive
  const gradeStr = getGradeStr(cardBody);
  // If you have a grade of G that should not be counted in to the end result.
  if (gradeStr.indexOf("G") !== -1) {
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
  const hpStr = courseInfo
    .substring(firstSplitterIdx + 1, secondSplitterIdx)
    .replace("hp", "")
    .trim();
  return hpStr;
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

// Message handling from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case "getAverageGrade":
      sendResponse({ average: getAverageGrade() });
      break;
  }
});

// Observes the dom for changes to "ladok-avslutade-kurser" and then updates the last mutationTime
class Observer {
  constructor() {
    this.config = { attributes: false, childList: true, subtree: true };
    this.targetNode = document.getElementsByTagName(
      "ladok-avslutade-kurser"
    )[0];
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
  }, 100);
}

init();
