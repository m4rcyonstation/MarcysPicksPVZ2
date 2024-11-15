


preload_images();
addTags();

async function pickPlants(event) {
    const response = await fetch("https://raw.githubusercontent.com/m4rcyonstation/MarcysPicksPVZ2/main/json/plants.json");
    //const response = await fetch("./json/plants.json");
    const allPlants = await response.json();
    const results = document.getElementById("results");
    const plantForm = document.getElementById("plantForm");

    let amount = document.getElementById('amount').value;
    const validPlants = checkPlants(allPlants, false);

    

    let guaranteeSun = document.getElementById("guaranteesun").checked;
    let validSun = [];

    if (guaranteeSun) {
       validSun = checkPlants(allPlants, "mainsun");
    }

    let guaranteeInsta = document.getElementById("guaranteeearly").checked;
    if (guaranteeInsta) {
        validInstas = checkPlants(allPlants, "instaearly");
    }

    results.textContent = null

    if (amount > validPlants.length) {
        results.textContent = "Error: Too large. Max " + validPlants.length
        return false;
    }

    const selectedPlants = [];

    if (guaranteeSun) {
        let selected = randint(0, validSun.length - 1);
        selectedPlants.push(validSun[selected]);
        console.log(validSun[selected])
    }

    if (guaranteeInsta) {
        let selected = randint(0, validInstas.length - 1);
        selectedPlants.push(validInstas[selected]);
        console.log(validInstas[selected])
    }

    while (selectedPlants.length < amount) {
        let selected = randint(0, validPlants.length - 1);
        if (!selectedPlants.includes(validPlants[selected])) {
            selectedPlants.push(validPlants[selected]);
        }
    }

    const old = document.getElementById("temp");
    if (old) {
        old.remove();
    }

    let resultimages = document.createElement("div")
    resultimages.id = "temp"
    results.appendChild(resultimages)

    for (plantName in selectedPlants) {
        let dir = "https://raw.githubusercontent.com/m4rcyonstation/MarcysPicksPVZ2/main/images/plants/" + selectedPlants[plantName] + ".png";

        let img = document.createElement("img");
        img.src = dir
        img.id = "plant"

        resultimages.appendChild(img)
    }

    //results.textContent = selectedPlants;
}

function checkPlants(allPlants, guarantee) {
    const validPlants = []
    const mod = document.getElementById("mod");
    const modId = mod.options[mod.selectedIndex].id
    
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const tagsSelected = []
    for (i in checkboxes) {
        if (checkboxes[i].checked) {
            tagsSelected.push(checkboxes[i].id);
        }
    }

    for (plant in allPlants.plants) {
        let currentPlant = allPlants.plants[plant]
        let isItValid = true;

        if (currentPlant.mods.includes(modId)) {
            if (guarantee == false) { //checking normally
                for (tag in tagsSelected) {
                    if (currentPlant.tags["all"] != null && currentPlant.tags["all"].includes(tagsSelected[tag])) { //if blacklisted tag in "all", blacklist
                        isItValid = false;
                    }
                    else if (currentPlant.tags[modId] != null && currentPlant.tags[modId].includes(tagsSelected[tag])) { //If current plant has a tag category for current mod and blacklisted tag is in there, blacklist
                        isItValid = false;
                    }
                    else if (currentPlant.tags[modId] == null && currentPlant.tags["any"] != null && currentPlant.tags["any"].includes(tagsSelected[tag])) { //if current plant DOESN'T have a tag category, but has an "any" category, and blacklisted tag is in "any""
                        isItValid = false;
                    }
                }

                if (tagsSelected.includes("whitelist")) {
                    isItValid = !isItValid;
                }
            } else { //STUPID DUMB WAY OF DOING THIS
                isItValid = false;
                if (currentPlant.tags["all"] != null && currentPlant.tags["all"].includes(guarantee)) {
                    isItValid = true;
                }
                else if (currentPlant.tags[modId] != null && currentPlant.tags[modId].includes(guarantee)) { 
                    isItValid = true;
                }
                else if (currentPlant.tags[modId] == null && currentPlant.tags["any"] != null && currentPlant.tags["any"].includes(guarantee)) { 
                    isItValid = true;
                }
            }
            
        } else {
            isItValid = false; //dont allow plants not in mod
        }
        if (isItValid) {
            validPlants.push(plant);
        }

    }

    return validPlants;
}

function randint(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

const coll = document.getElementById("collapsible");

function uncollapse() {
    var content = document.getElementById("collapseContent");
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

function addTags() {
    const mainTagList = document.getElementById("maintag");
    const mod = document.getElementById("mod");
    const modId = mod.options[mod.selectedIndex].id
    let tiers = 0;

    while (mainTagList.lastElementChild.className == "modtag") {
        mainTagList.lastElementChild.remove();
    }

    if (modId == "gt0") {
        tiers = 6
    }

    for (let i = 1; i <= tiers; i++) {
        let Ctier = document.createElement("li")
        Ctier.className = "modtag";

        CTinput = document.createElement("input");
        CTinput.type = "checkbox";
        CTinput.id = "t" + i;

        Ctier.appendChild(CTinput);

        CTlabel = document.createElement("label");
        CTlabel.textContent = "Tier " + i

        Ctier.appendChild(CTlabel)

        mainTagList.appendChild(Ctier)
    }
}


//THANKS chriscoyier SORRY FOR STEALING UR CODE DIRECTLY I CBA TO DO THIS TY I LOVE YOU
//CODE SOURCE: https://codepen.io/chriscoyier/pen/GRKvyPJ/

let checkboxes = document.querySelectorAll('input[type="checkbox"]');

for (let x = 0; x < checkboxes.length; x++) {

    checkboxes[x].addEventListener("change", function (e) {

        let parentNode = this.parentNode;

        const cbDescendants = parentNode.querySelectorAll('input[type="checkbox"]');
        for (let y = 0; y < cbDescendants.length; y++) {
            cbDescendants[y].checked = this.checked;
            cbDescendants[y].indeterminate = false;
        }

        while (["ul", "li"].indexOf(parentNode.nodeName.toLowerCase()) >= 0) {

            const mainCb = parentNode.querySelector(':scope > input[type="checkbox"]');

            if (mainCb && mainCb != this) {

                mainCb.checked = this.checked;

                const mainCbChildren = mainCb.parentNode.querySelectorAll('input[type="checkbox"]');
                const numTotal = mainCbChildren.length;

                let numChecked = 0;
                for (let z = 0; z < mainCbChildren.length; z++) {
                    numChecked += mainCbChildren[z].checked;
                }

                if (numTotal === numChecked) {
                    mainCb.indeterminate = false;
                    mainCb.checked = true;
                } else {
                    if (numChecked === 0) {
                        mainCb.indeterminate = false;
                        mainCb.checked = false;
                    } else {
                        mainCb.indeterminate = true;
                        mainCb.checked = false;
                    }
                }
            }

            parentNode = parentNode.parentNode;
        }
    });
}

async function preload_images() {
    const response = await fetch("https://raw.githubusercontent.com/m4rcyonstation/MarcysPicksPVZ2/main/json/plants.json");
    const allPlants = await response.json();
    const validPlants = checkPlants(allPlants, false);
    for (plant in validPlants) {
        let dir = "https://raw.githubusercontent.com/m4rcyonstation/MarcysPicksPVZ2/main/images/plants/" + validPlants[plant] + ".png";
        let img = new Image();
        img.src = dir;
    }
}
