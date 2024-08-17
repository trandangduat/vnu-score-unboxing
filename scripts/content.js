const GRADES_START_COLUMN = 4;
const GRADES_END_COLUMN = 8;

const showSubjectGrades = (subject, subjectGrades) => {
    const subjectGradesDOM = subject.querySelectorAll('td');

    for (let j = 0; j < subjectGradesDOM.length; j++) {
        subjectGradesDOM[j].style.backgroundColor = "white";
        subjectGradesDOM[j].innerHTML = subjectGrades[j];
    }
}

const hideSubjectGrades = (subject) => {
    const subjectGradesDOM = subject.querySelectorAll('td');
    const subjectGrades = [];

    if (subjectGradesDOM.length < 7)
        return;

    for (let i = 0; i < subjectGradesDOM.length; i++) {
        subjectGrades.push(subjectGradesDOM[i].innerHTML);
    }

    for (let i = GRADES_START_COLUMN; i < GRADES_END_COLUMN; i++) {
        subjectGradesDOM[i].style.backgroundColor = "#f0f0f0";
        subjectGradesDOM[i].innerHTML = `<p style="cursor:pointer;">🔑 unlock</p>`;
    }

    for (let i = GRADES_START_COLUMN; i < GRADES_END_COLUMN; i++) {
        subjectGradesDOM[i].addEventListener("click", () => {
            showSubjectGrades(subject, subjectGrades);
        });
    }
}

const domManipulation = (subjects) => {
    subjects.forEach((subject) => {
        hideSubjectGrades(subject);
    });
}

const main = async () => {
    const portalButton = document.querySelector('.portalModTd[title="Kết quả học tập"]');
    portalButton.addEventListener("click", () => {
            const iframe1 = document.querySelector('iframe');
            iframe1.addEventListener("load", () => {
                const iframe2 = iframe1.contentWindow.document.querySelector('iframe');
                iframe2.addEventListener("load", () => {
                    // done iframe drilling (2 levels)
                    const subjects = iframe2.contentWindow.document.querySelectorAll('#divList3 > table > tbody tr');
                    domManipulation(subjects);
                });
            });
    });
}

main();
