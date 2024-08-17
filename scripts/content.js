main = async () => {
    const portalButton = document.querySelector('.portalModTd[title="Kết quả học tập"]');
    portalButton.addEventListener("click", () => {
            const iframe1 = document.querySelector('iframe');
            iframe1.addEventListener("load", () => {
                const iframe2 = iframe1.contentWindow.document.querySelector('iframe');
                iframe2.addEventListener("load", () => {
                    const subjects = iframe2.contentWindow.document.querySelectorAll('#divList3 > table > tbody tr');
                    subjects.forEach((subject) => {
                        const subjectInfo = subject.querySelectorAll('td');
                        if (subjectInfo.length < 7)
                            return;

                        for (let i = 4; i < 8; i++) {
                            subjectInfo[i].style.backgroundColor = "yellow";
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
