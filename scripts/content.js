const GRADES_START_COLUMN = 4;
const GRADES_END_COLUMN = 8;
const UNBOX_SLIDER_ITEMS = 5;
const UNBOX_SLIDER_ITEMS_GAP = 15;
const SLIDER_DURATION = 5000;
const SLIDER_INITIAL_SPEED = 69;
const SLIDER_ACCERALATION = SLIDER_INITIAL_SPEED / (SLIDER_DURATION / 16);
const NUMBER_OF_GRADES = 9;
const gradesLetters = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
const gradesClasses = ['grade-a-plus', 'grade-a', 'grade-b-plus', 'grade-b', 'grade-c-plus', 'grade-c', 'grade-d-plus', 'grade-d', 'grade-f'];
const gradesAppearanceOdds = [0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.2, 0.1, 0.02];

let subjectsRevealedState = {};
let unboxContainer, unboxBackdrop, unboxSubject, unboxSlider, unboxSegment1, unboxSegment2;
let unboxItems1 = [], unboxItems2 = [];

const getRand = (l, r) => {
    return Math.floor(Math.random() * (r - l + 1) + l);
}

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
    const subjectCode = subjectGrades[1];

    subjectsRevealedState[subjectCode] = true;
    updateLocalStorage();

    for (let j = GRADES_START_COLUMN; j < GRADES_END_COLUMN; j++) {
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
        subjectGrades[i] = subjectGrades[i].replace(/&nbsp;/g, '');
    }

    const subjectCode = subjectGrades[1];
    const subjectName = subjectGrades[2];

    if (subjectsRevealedState[subjectCode] === true) {
        showSubjectGrades(subject, subjectGrades);
        return;
    }

    for (let i = GRADES_START_COLUMN; i < GRADES_END_COLUMN; i++) {
        subjectGradesDOM[i].style.backgroundColor = "#f0f0f0";
        subjectGradesDOM[i].innerHTML = `<p style="cursor:pointer;">🔑 unlock</p>`;
    }

    for (let i = GRADES_START_COLUMN; i < GRADES_END_COLUMN; i++) {
        subjectGradesDOM[i].addEventListener("click", () => {
            if (subjectsRevealedState[subjectCode] === true)
                return;

            showUnboxContainer(subjectCode, subjectName, subjectGrades[5]);

            setTimeout(() => {
                alert("Congrats you have unlocked " + subjectName + " with grade " + subjectGrades[5]);
                hideUnboxContainer();
                showSubjectGrades(subject, subjectGrades);
            }, SLIDER_DURATION + 500);
        });
    }
}

const domManipulation = (subjects) => {
    subjects.forEach((subject) => {
        hideSubjectGrades(subject);
    });
}

const onAnimation = () => {
    unboxSlider.style.height = '250px';
}

const offAnimation = () => {
    unboxSlider.style.height = '0px';
}

const showUnboxContainer = (subjectCode, subjectName, subjectGrade) => {
    unboxContainer.style.display = 'block';
    unboxSubject.innerText = subjectName;
    unboxSegment1.style.left = `0px`;
    unboxSegment2.style.left = `calc(100% + ${UNBOX_SLIDER_ITEMS_GAP}px)`;
    resetUnboxItems(unboxItems1);
    resetUnboxItems(unboxItems2);
    setTimeout(() => {
        onAnimation();
        startUnboxSlider(subjectGrade);
    }, 200);
}

const hideUnboxContainer = () => {
    offAnimation();
    setTimeout(() => {
        unboxContainer.style.display = 'none';
    }, 250);
}

const resetUnboxItems = (items) => {
    for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
        unboxItems1[i].style.transform = `translateX(0)`;
        unboxItems2[i].style.transform = `translateX(0)`;
        // get grade based on appearance odds (could be optimized)
        let rand = getRand(0, 100);
        let sum = 0;
        for (let j = 0; j < NUMBER_OF_GRADES; j++) {
            sum += gradesAppearanceOdds[j] * 100;
            if (rand <= sum) {
                rand = j;
                break;
            }
        }
        items[i].classList.remove(...gradesClasses)
        items[i].classList.add(gradesClasses[rand]);
        items[i].innerText = gradesLetters[rand];
    }
}

const initUnboxContainer = () => {
    unboxContainer = document.createElement('div');
    unboxContainer.classList.add('unbox-container');
    unboxContainer.style.display = 'none';

    unboxBackdrop = document.createElement('div');
    unboxBackdrop.classList.add('backdrop');

    unboxSubject = document.createElement('div');
    unboxSubject.classList.add('subject');
    unboxSubject.innerText = '😭😭😭';

    unboxSlider = document.createElement('div');
    unboxSlider.classList.add('slider');
    unboxSlider.style.height = '0px';
    unboxSlider.style.transition = `height 250ms ease-out`;

    unboxSegment1 = document.createElement('div');
    unboxSegment1.classList.add('segment');
    unboxSegment1.setAttribute('style', `gap: ${UNBOX_SLIDER_ITEMS_GAP}px; left: 0;`);

    unboxSegment2 = document.createElement('div');
    unboxSegment2.classList.add('segment');
    unboxSegment2.setAttribute('style', `gap: ${UNBOX_SLIDER_ITEMS_GAP}px; left: calc(100% + ${UNBOX_SLIDER_ITEMS_GAP}px);`);

    unboxSlider.appendChild(unboxSegment1);
    unboxSlider.appendChild(unboxSegment2);

    for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
        unboxItems1[i] = document.createElement('div');
        unboxItems1[i].classList.add('item');
        unboxSegment1.appendChild(unboxItems1[i]);
    }

    for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
        unboxItems2[i] = document.createElement('div');
        unboxItems2[i].classList.add('item');
        unboxSegment2.appendChild(unboxItems2[i]);
    }

    resetUnboxItems(unboxItems1);
    resetUnboxItems(unboxItems2);

    const verticalLine = document.createElement('div');
    verticalLine.classList.add('vertical-line');

    unboxSlider.appendChild(verticalLine);

    unboxContainer.appendChild(unboxBackdrop);
    unboxContainer.appendChild(unboxSubject);
    unboxContainer.appendChild(unboxSlider);

    document.body.appendChild(unboxContainer);
}

// check if there is a possibility to switch to the next segment
const checkRemainingSegmentSwitch = (currentSpeed, totalLength) => {
    let k = currentSpeed / SLIDER_ACCERALATION;
    return (totalLength - (k + 1) * currentSpeed + k * (k + 1) / 2 * SLIDER_ACCERALATION) > 0;
}

const startUnboxSlider = (subjectGrade) => {
    let currentTime = 0;
    let speed = SLIDER_INITIAL_SPEED;
    let offset = 0;
    let switchSegment = true;
    const slideInterval = setInterval(() => {
        for (let i = 0; i < UNBOX_SLIDER_ITEMS; i++) {
            unboxItems1[i].style.transform = `translateX(-${offset}px)`;
            unboxItems2[i].style.transform = `translateX(-${offset}px)`;
        }
        if (switchSegment && unboxItems2[0].getBoundingClientRect().left <= unboxSlider.getBoundingClientRect().left) {
            unboxSegment1.style.left = `calc(100% + ${UNBOX_SLIDER_ITEMS_GAP}px)`;
            unboxSegment2.style.left = `0px`;
            resetUnboxItems(unboxItems1);
            switchSegment = false;
            offset = 0;
        }
        if (!switchSegment && unboxItems1[0].getBoundingClientRect().left <= unboxSlider.getBoundingClientRect().left) {
            unboxSegment2.style.left = `calc(100% + ${UNBOX_SLIDER_ITEMS_GAP}px)`;
            unboxSegment1.style.left = `0px`;
            resetUnboxItems(unboxItems2);
            if (checkRemainingSegmentSwitch(speed, unboxSlider.getBoundingClientRect().width)) {
                unboxItems2[0].innerHTML = subjectGrade;
                unboxItems2[0].classList.remove(...gradesClasses);
                unboxItems2[0].classList.add(gradesClasses[gradesLetters.indexOf(subjectGrade)]);
                console.log('GOLD');
            }
            switchSegment = true;
            offset = 0;
        }
        offset += speed;
        speed = speed - SLIDER_ACCERALATION;
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
