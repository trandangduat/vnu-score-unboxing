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

let unboxContainer, unboxBackdrop, unboxSlider, unboxSegment1, unboxSegment2;
let unboxItems1 = [], unboxItems2 = [];
const UNBOX_SLIDER_ITEMS = 5;
const UNBOX_SLIDER_ITEMS_GAP = 15;
const SLIDER_DURATION = 5000;

const initUnboxContainer = () => {
    unboxContainer = document.createElement('div');
    unboxContainer.classList.add('unbox-container');
    unboxContainer.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;');

    unboxBackdrop = document.createElement('div');
    unboxBackdrop.classList.add('backdrop');
    unboxBackdrop.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5);');

    unboxSlider = document.createElement('div');
    unboxSlider.classList.add('slider');
    unboxSlider.setAttribute('style', 'position: fixed; top: 50%; left: 0; transform: translate(0, -50%); width: 100%; height: 30%; overflow: hidden;');

    unboxSegment1 = document.createElement('div');
    unboxSegment1.setAttribute('style', `position: fixed; display: flex; gap: ${UNBOX_SLIDER_ITEMS_GAP}px; width: 100%; height: 100%; left: 0;`);
    unboxSegment2 = document.createElement('div');
    unboxSegment2.setAttribute('style', `position: fixed; display: flex; gap: ${UNBOX_SLIDER_ITEMS_GAP}px; width: 100%; height: 100%; left: calc(100% + ${UNBOX_SLIDER_ITEMS_GAP}px);`);
    unboxSlider.appendChild(unboxSegment1);
    unboxSlider.appendChild(unboxSegment2);

    for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
        unboxItems1[i] = document.createElement('div');
        unboxItems1[i].classList.add('item');
        unboxItems1[i].setAttribute('style', 'background-color: black; width: 100%;');
        unboxSegment1.appendChild(unboxItems1[i]);
    }

    for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
        unboxItems2[i] = document.createElement('div');
        unboxItems2[i].classList.add('item');
        unboxItems2[i].setAttribute('style', 'background-color: blue; width: 100%;');
        unboxSegment2.appendChild(unboxItems2[i]);
    }

    const verticalLine = document.createElement('div');
    verticalLine.classList.add('vertical-line');
    verticalLine.setAttribute('style', 'position: fixed; top: 0; left: 50%; transform: translate(-50%, 0); width: 2px; height: 100%; background-color: yellow; box-shadow: 0 0 10px yellow;');
    unboxSlider.appendChild(verticalLine);

    unboxContainer.appendChild(unboxBackdrop);
    unboxContainer.appendChild(unboxSlider);

    document.body.appendChild(unboxContainer);
}

const SLIDER_INITIAL_SPEED = 80;

const startUnboxSlider = () => {
    let currentTime = 0;
    let speed = SLIDER_INITIAL_SPEED;
    let offset = 0;
    let switchSegment = true;
    const slideInterval = setInterval(() => {
        for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
            unboxItems1[i].style.transform = `translateX(-${offset}px)`;
            unboxItems2[i].style.transform = `translateX(-${offset}px)`;
        }
        if (switchSegment && unboxItems2[0].getBoundingClientRect().left <= 0) {
            unboxSegment1.style.left = `calc(100% + ${UNBOX_SLIDER_ITEMS_GAP}px)`;
            unboxSegment2.style.left = `0px`;
            for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
                unboxItems2[i].style.transform = `translateX(0)`;
                unboxItems1[i].style.transform = `translateX(0)`;
            }
            switchSegment = false;
            offset = 0;
        }
        if (!switchSegment && unboxItems1[0].getBoundingClientRect().left <= 0) {
            unboxSegment2.style.left = `calc(100% + ${UNBOX_SLIDER_ITEMS_GAP}px)`;
            unboxSegment1.style.left = `0px`;
            for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
                unboxItems1[i].style.transform = `translateX(0)`;
                unboxItems2[i].style.transform = `translateX(0)`;
            }
            switchSegment = true;
            offset = 0;
        }
        offset += speed;
        speed = speed - SLIDER_INITIAL_SPEED / (SLIDER_DURATION / 16);
        currentTime += 16;
        if (currentTime >= SLIDER_DURATION) {
            clearInterval(slideInterval);
        }
    }, 16);
}

const main = async () => {
    getLocalStorage();

    const portalButton = document.querySelector('.portalModTd[title="Kết quả học tập"]');
    if (portalButton === null) {
        return;
    }
    portalButton.addEventListener("click", () => {
        initUnboxContainer();
        setTimeout(() => {
            startUnboxSlider();
        }, 1000);

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
