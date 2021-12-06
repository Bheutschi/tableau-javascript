let grades = {}

window.addEventListener("load", () => {
    console.log("Toutes les ressources sont chargées !")

    localStorage.clear()
    addListenerToInput()

    if (localStorage.getItem("storageGrades") === null) {
        updateGradesForHTML()
    } else {
        grades = JSON.parse(localStorage.getItem("storageGrades"))
        updateGradesForHTML()

    }
    getGradesFromHTML()

})

//Mettre à jours les inputs et les remettres dans quand on reload la page

function updateGradesForHTML() {
    for ( let updatesGrades in grades) {
        document.getElementById(updatesGrades).value = grades[updatesGrades]
    }
}

// Prend les notes de l'HTML

function getGradesFromHTML() {
    let inputs = document.getElementsByTagName("input")
    for (let input of inputs) {
        grades[input.id] = parseFloat(input.value)
        input.style.borderColor = "rgb(206, 212, 218)"
    }

    localStorage.setItem("storageGrades", JSON.stringify(grades))

    let arrayInputs = document.querySelectorAll(":invalid")
    for (let errorInput of arrayInputs) {
        errorInput.style.borderColor = "red"
    }


    // Faire un tableau avec les notes qui concernent une moyenne

    // Le tableau anglais + math
    let ang_math_array = [
        grades["math_1"],
        grades["math_2"],
        grades["math_3"],
        grades["ang_1"],
        grades["ang_2"],
        grades["ang_3"],
        grades["ang_4"],
        grades["ang_5"],
    ]


    // Créer tableau notes ECG
    let ecg_array = [
        grades["ecg_1"],
        grades["ecg_2"],
        grades["ecg_3"],
        grades["ecg_4"],
        grades["ecg_5"],
        grades["ecg_6"],
        grades["ecg_7"],
        grades["ecg_8"],
    ]
    //Créer tableau notes module
    let module_array = [
        grades["module_pro"],
        grades["module_cie"],
    ]

    //Tableau pondération
    let module_percent_array = [
        grades["percent-module"],
        grades["percent-cie"],
    ]
    let general_percent_array = [
        grades["percent-competence"],
        grades["percent-ecg"],
        grades["percent-info"],
        grades["percent-tpi"],
    ]


    // Une fois le tableau constitué -> l'envoyer à la fonction qui calcule la moyenne
    let average_ang_math = roundGrades(arrayAvg(ang_math_array), 0.5)
    console.log(average_ang_math)
    let averageECG = roundGrades(arrayAvg(ecg_array), 0.5)
    let averagemodule = roundGrades(weightedAverage(module_array, module_percent_array), 0.1)

    let general_grades_array = [
        average_ang_math,
        averageECG,
        averagemodule,
        grades["grades-tpi"],
    ]

    let averagegeneral = roundGrades(weightedAverage(general_grades_array, general_percent_array), 0.1)

    displayAverages(average_ang_math, averageECG, averagemodule, averagegeneral)

}

// Ajouter le listener à l'input
function addListenerToInput() {
    let inputs = document.getElementsByTagName("input")
    for (let input of inputs)
        input.addEventListener("change", getGradesFromHTML)
}


// Calculer la moyenne des notes

function arrayAvg(myArray) {
    let sum = 0
    let divider = 0

    for (let i = 0; i < myArray.length; i++) {
        if (!isNaN(myArray[i])) {
            sum += myArray[i]
            divider++

        }
    }
    return (sum / divider)

}

// Arrondir la moyenne des notes
function roundGrades(number, multiple) {
    return (Math.round(number / multiple) * multiple)
}

// Faire la pondération des notes de module
function weightedAverage(gradesArray, weightArray) {

    console.log(gradesArray)
    console.log(weightArray)
    let sum = 0
    let divider = 0

    for (let i = 0; i < gradesArray.length; i++) {
        if (!isNaN(gradesArray[i])) {
            sum += (gradesArray[i] * weightArray[i])
            divider += weightArray[i]
        }
    }
    return (sum / divider)


}


//remettre la note dans son emplacement
function displayAverages(average_ang_math, averageECG, averagemodule, averagegeneral) {

    document.getElementById("final-grades").innerText = retunrZero((averagegeneral).toFixed(1))
    document.getElementById("final-info").innerText = retunrZero((averagemodule).toFixed(1))
    document.getElementById("final-ecg").innerText = retunrZero((averageECG).toFixed(1))
    document.getElementById("final-competence").innerText = retunrZero((average_ang_math).toFixed(1))
}

function retunrZero(number) {
    if (number === null || number === undefined || isNaN(number)) {
        return 0
    } else {
        return number
    }
}
