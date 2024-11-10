window.addEventListener('DOMContentLoaded',()=>{
    const replaceText = (selector, text)=>{
        const element = document.getElementById(selector)
        if (element) {
            element.innerText = text
        }
        for (const dependency of ['chrome','node', 'electron']) {
            replaceText(`${dependency}-version`,process.versions[dependency])
        }
    }
    let counter = 0
    // document.getElementById('add').addEventListener('click',()=>{
    //     counter++;
    //     document.getElementById('spanLabel').innerText = counter
    // })
})