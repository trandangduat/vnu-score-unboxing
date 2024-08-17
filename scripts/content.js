main = async () => {
    const portalButton = document.querySelector('.portalModTd[title="Kết quả học tập"]');
    portalButton.addEventListener("click", () => {
            const iframe1 = document.querySelector('iframe');
            iframe1.addEventListener("load", () => {
                const iframe2 = iframe1.contentWindow.document.querySelector('iframe');

                iframe2.addEventListener("load", () => {
                    const subjects = iframe2.contentWindow.document.querySelectorAll('#divList3 > table > tbody tr');

                    subjects.forEach((subject) => {
                        const subjectInfoDOM = subject.querySelectorAll('td');
                        const subjectInfo = [];

                        if (subjectInfoDOM.length < 7)
                            return;

                        for (let i = 0; i < subjectInfoDOM.length; i++) {
                            subjectInfo.push(subjectInfoDOM[i].innerHTML);
                        }

                        for (let i = 4; i < 8; i++) {
                            subjectInfoDOM[i].style.backgroundColor = "#f0f0f0";
                            subjectInfoDOM[i].innerHTML = `<p style="cursor:pointer;">🔑 unlock</p>`;
                        }
                        for (let i = 4; i < 8; i++) {
                            subjectInfoDOM[i].addEventListener("click", () => {
                                for (let j = 4; j < 8; j++) {
                                    subjectInfoDOM[j].style.backgroundColor = "white";
                                    subjectInfoDOM[j].innerHTML = subjectInfo[j];
                                }
                            });
                        }

                        // const subjectName = subjectInfo[1].innerText;
                        // const subjectMark = subjectInfo[6].innerText;
                        // console.log(subjectName, subjectMark);
                    });
                });
            });
    });
}

main();
