// Fonction principale qui récupère les œuvres depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works")
        const data = await response.json()
        let display = ""
        

        // créer les balises HTML pour chaque œuvre
        for (let figure of data) {
            display += `<figure id="${figure.id}">
                        <img src="${figure.imageUrl}" alt="${figure.title}">
                        <figcaption>${figure.title}</figcaption>
                        </figure>             
                         `
        }



        // Insère toutes les œuvres dans l'élément de la galerie
        document.querySelector(".gallery").innerHTML = display

        const buttons = document.querySelectorAll(".btn-filter")

        // Ajoute un événement "click" à chaque bouton de filtrage
        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                // Lorsqu'un bouton est cliqué, on appelle la fonction de filtrage
                btnFilter(event, data, buttons)
            })
        })

    } catch (err) {
        // Si une erreur 
        console.log("dans le catch")
        console.log("une erreur est survenue : ", err)
    }
}

fetchWorks()


// Fonction qui gère le filtrage des œuvres en fonction de la catégorie
function btnFilter(event, data, buttons) {
    // On récupère le bouton qui a été cliqué
    const button = event.target

    const categoryId = parseInt(button.id)

    // Gestion de la classe active pour le bouton filtré
    buttons.forEach(btn => btn.classList.remove("btn-filterActive")) 
    button.classList.add("btn-filterActive") 

    
    if (categoryId === 0) {
        displayAllImages(data) 
    } else {
        // Sinon, on affiche les images correspondant à la catégorie sélectionnée
        displayImagesByCategory(categoryId, data)
    }
}


// Fonction pour afficher toutes les images
function displayAllImages(data) {
    let display = ""
    for (let figure of data) {
        display += `
                   <figure id="${figure.id}">
                   <img src="${figure.imageUrl}" alt="${figure.title}">
                   <figcaption>${figure.title}</figcaption>
                   </figure>
                   `
    }
    document.querySelector(".gallery").innerHTML = display
}


// Fonction pour afficher les images d'une catégorie spécifique
function displayImagesByCategory(categoryId, data) {
    const filteredData = data.filter(item => item.categoryId === categoryId);

    let display = ""
    for (let figure of filteredData) {
        display += `
                   <figure id="${figure.id}">
                   <img src="${figure.imageUrl}" alt="${figure.title}">
                   <figcaption>${figure.title}</figcaption>
                   </figure>
                   `
    }
    document.querySelector(".gallery").innerHTML = display
}



// Fonction pour afficher la bannière si le token est validé
function editMode() {
    const editBanner = document.getElementById("edit-banner")
    const logintLink = document.getElementById("login-link")
    const logoutLink = document.getElementById("logout-link")
    const filter = document.getElementById("buttons")
    const changeButton = document.querySelector("[data-open-modal");
    const userToken = sessionStorage.getItem("accessToken")
    const isTokenValide = !!userToken
    
    if(isTokenValide){
        editBanner.style.display = "flex"
        logintLink.style.display = "none"
        logoutLink.style.display = "flex"
        filter.style.display = "none"
        changeButton.style.display = "flex"
    } else{
    }
}
editMode()

// Fonction de déconnexion
function logoutUser() {
    sessionStorage.removeItem("accessToken")
    window.location.href = "index.html"
}

// Ajoute un événement "click" au bouton logout
document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logout-link")
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault()
            logoutUser() 
        })
    }
});


