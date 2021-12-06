let grades = {}
let baseKnowledge = []
let ecgKnowledge = []
let modulesICT = []
let weightModulesICT = []
let generalAverageGrades = []
let generalAverageGradesWeight = []

window.addEventListener('load', () => { //Code à exécuter lorsque l'événement load est emits : On Load

    if (localStorage.getItem("stringifyGrades") === null) {
        getGradesValuesFromHTML()
    } else {
        grades = JSON.parse(localStorage.getItem("stringifyGrades"))
        updateGradeWhenTheyAreAlreadyInLocalStorage()
    }

    arrayConstitutionAndAveragePlusWeight()
    registerChangeEventListenerOnInputs()
});

//Mettre à jour les inputs s'ils existent pour qu'ils restent dans l'HTML à chaque rechargement de la page
function updateGradeWhenTheyAreAlreadyInLocalStorage() {
    for (let updatedGrades in grades) {
        document.getElementById(updatedGrades).value = grades[updatedGrades] ?? "Note"
    }
}

//Récupérer les valeurs depuis l'HTML (transmettre valeurs HTML -> JS)
function getGradesValuesFromHTML() {
    let selects = document.getElementsByTagName("select")
    for (let select of selects) {
        grades[select.id] = parseFloat(select.value)
    }
    arrayConstitutionAndAveragePlusWeight()
    localStorage.setItem("stringifyGrades", JSON.stringify(grades))
}

//Écouter les événements de changement sur les inputs
function registerChangeEventListenerOnInputs() {
    let selects = document.getElementsByTagName("select")
    for (let select of selects) {
        select.addEventListener('change', getGradesValuesFromHTML)
    }
}

//Avoir une fonction qui sait calculer les moyennes
function calculateAverage(gradesArray) {

    let sum = 0
    let divider = 0

    for (let i = 0; i < gradesArray.length; i++) {
        if (!isNaN(gradesArray[i]) ? gradesArray[i] !== null : false) {
            sum += gradesArray[i]
            divider++
        }

    }

    return sum / divider
}

// Avoir une fonction qui sait faire des moyennes pondérées
function weightedAverage(gradesArray, weightedArray) {

    let sum = 0
    let divider = 0

    for (let i = 0; i < gradesArray.length; i++) {

        if (!isNaN(gradesArray[i]) ? gradesArray[i] !== null : false) {
            sum += (gradesArray[i] * weightedArray[i])
            divider += weightedArray[i]
        }
    }

    return sum / divider
}

//Avoir une fonction qui sait faire les arrondis au multiple
function roundNumber(number, multiple) {
    return (Math.round(number / multiple) * multiple).toFixed(1)
}

//Identifier quelles notes constituent quelles moyennes (regrouper dans plusieurs tableaux)
function arrayConstitutionAndAveragePlusWeight() {

    //Mettre dans le tableau baseKnowledge les notes concernées
    baseKnowledge = [
        grades["math_1"],
        grades["math_2"],
        grades["math_3"],
        grades["english_1"],
        grades["english_2"],
        grades["english_3"],
        grades["english_4"],
        grades["english_5"],
    ]

    //Faire le calcul de la moyenne du baseKnowledge (Pas de pondération)
    let baseKnowledgeAvg = roundNumber(calculateAverage(baseKnowledge), 0.5)

    //Mettre dans le tableau ecgKnowledge les notes concernées
    ecgKnowledge = [
        grades["society_1"],
        grades["society_2"],
        grades["society_3"],
        grades["society_4"],
        grades["society_5"],
        grades["society_6"],
        grades["society_7"],
        grades["society_8"],
        grades["LC_1"],
        grades["LC_2"],
        grades["LC_3"],
        grades["LC_4"],
        grades["LC_5"],
        grades["LC_6"],
        grades["LC_7"],
        grades["LC_8"],
    ]
    //Faire le calcul de la moyenne de l'ecgKnowledge (Pas de pondération)
    let ecgKnowledgeAvg = roundNumber(calculateAverage(ecgKnowledge), 0.5)

    //Mettre dans le tableau modulesICT les notes concernées
    modulesICT = [
        grades["EPSIC"],
        grades["CIE"],
    ]

    //Mettre dans le tableau weightModulesICT les pondérations correspondantes (0.8 - 0.2)
    weightModulesICT = [
        grades["weight_EPSIC"],
        grades["weight_CIE"],
    ]

    //Faire le calcul de la moyenne des ModuleICT AVEC la pondération
    let modulesICTAvg = roundNumber(weightedAverage(modulesICT, weightModulesICT), 0.1)

    //Mettre dans le tableau generalAverageGrades les notes des moyennes correspondantes calculées au-dessus
    generalAverageGrades = [
        baseKnowledgeAvg,
        ecgKnowledgeAvg,
        modulesICTAvg,
        grades["TPI"],
    ]

    //Mettre dans le tableau generalAverageGradesWeight les pondérations correspondantes (0.1 - 0.2 - 0.3 - 0.4)
    generalAverageGradesWeight = [
        grades["weight_CBE"],
        grades["weight_CG"],
        grades["weight_CI"],
        grades["weight_TPI"],
    ]

    //Faire le calcul de la moyenne FINALE AVEC la pondération
    let generalAvg = roundNumber(weightedAverage(generalAverageGrades, generalAverageGradesWeight,), 0.1)

    //Écrire si on a réussi ou échouer le CFC
    function passOrFailure() {
        let result;
        if (generalAvg === null || generalAvg === undefined || isNaN(generalAvg)) {
            return "-"
        } else if (generalAvg >= 4) {
            result = "Réussi !"
            document.getElementById("stonks").innerHTML = `<iframe src="https://giphy.com/embed/PgXcWhrL0gjQlAhHUY" height="90" width="90"></iframe><p><a href="https://giphy.com/gifs/hungrynaru-stonks-wallstreetbets-stonk-PgXcWhrL0gjQlAhHUY"></a></p>`
        } else {
            result = "Échec..."
            document.getElementById("stonks").innerHTML = `<iframe src="https://giphy.com/embed/Oj8pUuT5FOpxHH9LIk" height="90" width="90"></iframe><p><a href="https://giphy.com/gifs/hungrynaru-hungry-naru-not-stonks-Oj8pUuT5FOpxHH9LIk"></a></p>`
        }
        return result;
    }

    //Mettre dans le tableau writeAverageToHMTL les moyennes calculées
    writeAverageToHTML(
        baseKnowledgeAvg,
        ecgKnowledgeAvg,
        modulesICTAvg,
        generalAvg,
        passOrFailure(),
    )
}

// Écrire dans l'HTML les moyennes obtenues
function writeAverageToHTML(baseKnowledgeAVG, ecgKnowledgeAvg, modulesICTAvg, generalAvg, passOrFailure) {

    document.getElementById("baseKnowledgeAVG").innerHTML = "<p>" + returnOnlyIfIsNumber(baseKnowledgeAVG) + "</p>"
    document.getElementById("ecgKnowledgeAvg").innerHTML = "<p>" + returnOnlyIfIsNumber(ecgKnowledgeAvg) + "</p>"
    document.getElementById("modulesICTAvg").innerHTML = "<p>" + returnOnlyIfIsNumber(modulesICTAvg) + "</p>"
    document.getElementById("generalAvg").innerHTML = "<p>" + returnOnlyIfIsNumber(generalAvg) + "</p>"
    document.getElementById("reussite").innerHTML = "<p>" + passOrFailure + "</p>"
}

//Retourner le string "-" si le nombre dans le paramètre n'est pas un vrai nombre (undefined, Null, NaN)
function returnOnlyIfIsNumber(number) {
    if (number === null || number === undefined || isNaN(number)) {
        return "-"
    } else
        return number
}