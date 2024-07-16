// initialization

const RESPONSIVE_WIDTH = 1024

let headerWhiteBg = false
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH
const collapseBtn = document.getElementById("collapse-btn")
const collapseHeaderItems = document.getElementById("collapsed-header-items")

const toastAlert = document.querySelector("#toast-alert")
let toastAlertTimeout = null

let dbCache = []

/**
 * Fetches the json db
 * @returns JS object
 */
async function fetchDB(){

    try{
        const response = await fetch(`/src/db/data.json`)

        return await response.json()
    }catch(e){
        toastAlert("Failed to fetch DB, please reload or try again later")
        return 
    }
}

fetchDB().then((data) => {
    dbCache = data
})

function onHeaderClickOutside(e) {

    if (!collapseHeaderItems.contains(e.target)) {
        toggleHeader()
    }

}


function toggleHeader() {
    if (isHeaderCollapsed) {
        // collapseHeaderItems.classList.remove("max-md:tw-opacity-0")
        collapseHeaderItems.classList.add("opacity-100",)
        collapseHeaderItems.style.width = "60vw"
        collapseBtn.classList.remove("bi-list")
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed")
        isHeaderCollapsed = false

        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1)

    } else {
        collapseHeaderItems.classList.remove("opacity-100")
        collapseHeaderItems.style.width = "0vw"
        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed")
        collapseBtn.classList.add("bi-list")
        isHeaderCollapsed = true
        window.removeEventListener("click", onHeaderClickOutside)

    }
}

function responsive() {
    if (window.innerWidth > RESPONSIVE_WIDTH) {
        collapseHeaderItems.style.width = ""

    } else {
        isHeaderCollapsed = true
    }
}

window.addEventListener("resize", responsive)


const collapsibleBtns = document.querySelectorAll('.collapsible')

collapsibleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        this.classList.toggle('active')

        // Toggle 'rotate' class to rotate the arrow
        this.classList.toggle('tw-rotate-[0deg]')
        let content = this.nextElementSibling

        if (content.style.height === 'fit-content') {
            content.style.height = '0px'
        } else {
            content.style.height = 'fit-content'
        }
    })
})


function showAlert(message="", timeout=3000){
    toastAlert.classList.remove("tw-hidden")

    toastAlert.querySelector("#alert-message").textContent = message

    clearTimeout(toastAlertTimeout)

    toastAlertTimeout = setTimeout(hideAlert, timeout)
}

function hideAlert(){
    toastAlert.classList.add("tw-hidden")
    clearTimeout(toastAlertTimeout)
}


function getObjectsByTagNameOrName(searchValue) {
    return dbCache.filter(item => {
        const tagMatch = item.tags.some(tag => tag.startsWith(searchValue))
        const nameMatch = item.name.startsWith(searchValue)
        return tagMatch || nameMatch
    })
}

setTimeout(() => console.log("Object: ", getObjectsByTagNameOrName("app")), 1000)

const modal = document.querySelector("#preview-modal")

function hidePreviewModal(){

    modal.classList.remove("tw-scale-[1]")
    modal.classList.add("tw-scale-0")

}

/**
 * Gets value from DB by id
 */
function getObjectById(id) {
    return dbCache.find(item => item.id === id);
}

function showPreviewModal(previewId){

    const data = getObjectById(previewId)

    modal.querySelector("#preview-img").setAttribute("src", data.previewImg)
    modal.querySelector("#template-name").textContent = data.name
    modal.querySelector("#modal-source-code").setAttribute("href", data.githubUrl)
    modal.querySelector("#preview-url").setAttribute("href", data.previewUrl)
    modal.querySelector("#download-folder").onclick = () => {
        showAlert("downloading please wait...")
        downloadFolder(data.githubUrl)
    }

    modal.classList.remove("tw-scale-0", "tw-hidden")
    modal.classList.add("tw-scale-[1]")

}