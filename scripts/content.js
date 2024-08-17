const GRADES_START_COLUMN = 4;
const GRADES_END_COLUMN = 8;
let subjectsRevealedState = {};

const getLocalStorage = () => {
    if (localStorage.getItem('subjectsRevealedState')) {
        subjectsRevealedState = JSON.parse(localStorage.getItem('subjectsRevealedState'));
    }
}

const updateLocalStorage = () => {
    localStorage.setItem('subjectsRevealedState', JSON.stringify(subjectsRevealedState));
}

const removeLocalStorage = () => {
    localStorage.removeItem('subjectsRevealedState');
}

const showSubjectGrades = (subject, subjectGrades) => {
    const subjectGradesDOM = subject.querySelectorAll('td');
    const subjectName = subjectGradesDOM[1].innerText;

    subjectsRevealedState[subjectName] = true;
    updateLocalStorage();

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

    const subjectName = subjectGradesDOM[1].innerText;

    if (subjectsRevealedState[subjectName] === true) {
        showSubjectGrades(subject, subjectGrades);
        return;
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

let unboxContainer, unboxBackdrop, unboxSlider, unboxItems = [];

const initUnboxContainer = () => {
    unboxContainer = document.createElement('div');
    unboxContainer.classList.add('unbox-container');
    unboxContainer.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;');

    unboxBackdrop = document.createElement('div');
    unboxBackdrop.classList.add('backdrop');
    unboxBackdrop.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5);');

    unboxSlider = document.createElement('div');
    unboxSlider.classList.add('slider');
    unboxSlider.setAttribute('style', 'position: fixed; top: 50%; left: 0; transform: translate(0, -50%); width: 100%; height: 30%; display: flex;gap: 15px;');

    for (let i = 0; i < 5; i++) {
        unboxItems[i] = document.createElement('div');
        unboxItems[i].classList.add('item');
        unboxItems[i].setAttribute('style', 'background-color: black; width: 100%;');
        unboxSlider.appendChild(unboxItems[i]);
    }

    const verticalLine = document.createElement('div');
    verticalLine.classList.add('vertical-line');
    verticalLine.setAttribute('style', 'position: fixed; top: 0; left: 50%; transform: translate(-50%, 0); width: 2px; height: 100%; background-color: yellow; box-shadow: 0 0 10px yellow;');
    unboxSlider.appendChild(verticalLine);

    unboxContainer.appendChild(unboxBackdrop);
    unboxContainer.appendChild(unboxSlider);

    document.body.appendChild(unboxContainer);
}

const main = async () => {
    getLocalStorage();

    const portalButton = document.querySelector('.portalModTd[title="Kết quả học tập"]');
    portalButton.addEventListener("click", () => {
        initUnboxContainer();

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
