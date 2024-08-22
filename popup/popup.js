const showAllGrades = () => {
    console.log("show")
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'ACTION', payload: 'SHOW' });
    });
}

const hideAllGrades = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'ACTION', payload: 'HIDE' });
    });
}

const main = () => {
    document.querySelector(`.btn[data-action="show-grades"]`).addEventListener("click", showAllGrades);
    document.querySelector(`.btn[data-action="hide-grades"]`).addEventListener("click", hideAllGrades);
}

main();
