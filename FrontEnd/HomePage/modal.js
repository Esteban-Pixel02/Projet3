

///// Récupération des oeuvres /////


// Fonction pour récupérer les oeuvres depuis l'API pour la mini Galerie
async function fetchWorksForModal() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();

        // Générer les éléments HTML pour la galerie
        let display = "";
        for (let figure of data) {
            display += `
                <figure id="modal-figure-${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <i class="fa-solid fa-trash-can delete-btn" data-id="${figure.id}"></i>
                </figure>
            `;
        }

        // Injecter le contenu dans la galerie modale
        document.querySelector(".modal-gallery").innerHTML = display;
    } catch (err) {
        console.error("Une erreur est survenue lors du chargement des images : ", err);
    }
}



///// Gestion ouverture / fermeture de la modale 1 ////


const modal = document.querySelector("[data-modal1]");

// Ouverture de la modale et chargement de la galerie
const openButton = document.querySelector("[data-open-modal]");
const banner = document.getElementById("edit-banner");
openButton.addEventListener("click", () => {
    modal.showModal();
    fetchWorksForModal();
})

banner.addEventListener("click", () => {
    modal.showModal();
    fetchWorksForModal();
})



// Fermeture de la modale
const closeButton = document.querySelector("[data-close-modal]");
closeButton.addEventListener("click", () => {
    modal.close();
})


// Fermer la modale en cliquant a l'exterieur 
modal.addEventListener("click", (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        modal.close();
    }
});

///// Gestion ouverture / fermeture de la modale 2 ////



// Sélection du bouton de la modale 2
const modal2 = document.querySelector("[data-modal2]");

// Ouverture de la modale 
const openButton2 = document.querySelector("[data-open-modal2]");
openButton2.addEventListener("click", () => {
    modal.close();
    modal2.showModal();
})

// Fermeture de la modale
const closeButton2 = document.querySelector("[data-close-modal2]");
closeButton2.addEventListener("click", () => {
    modal2.close();
})


// Fermer la modale en cliquant sur l'overlay et uniquement lui
modal2.addEventListener("click", (e) => {
    if (e.target === modal2) {
        modal2.close();
    }
});

// Retour sur la modal 1 
const returnButton = document.querySelector("[data-return-modal1]")
returnButton.addEventListener("click", () => {
    modal2.close();
    modal.showModal();
})


///// suppression d'image /////


function deleteMode() {
    // On récupère le token depuis le sessionStorage 
    const userToken = sessionStorage.getItem("accessToken");
    if (!userToken) {
        return; 
    }

    // Sélectionne les boutons qui permettent de supprimer les images
    const deleteBtns = document.querySelectorAll(".delete-btn");

    deleteBtns.forEach(btn => {
        btn.addEventListener("click", async function (e) {

            // Récupère directement l'ID depuis le bouton
            const figureId = e.target.getAttribute("data-id");
            if (!figureId) {
                return;
            }
            

            // Appelle l'API pour supprimer l'image
            await deleteImage(figureId, userToken);
        });
    });


    // Fonction pour supprimer une image via l'API
    async function deleteImage(figureId, token) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${figureId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            // Vérifie la réponse de l'API
            if (response.ok) {
                document.querySelector(`#modal-figure-${figureId}`).remove();

                // Supprime l'image de la galerie principale
                const galleryFigure = document.getElementById(figureId);
            if (galleryFigure) {
                galleryFigure.remove();
            }
             
            
            } else {
                
            }
        } catch (err) {
            console.error("Erreur API lors de la suppression :", err);
        }
    }
}

deleteMode();




    /////  l'ajout d'image /////
    



    document.addEventListener("DOMContentLoaded", () => {
        setupCategoryDropdown();
        setupAddPhotoForm();
    });
    
    // Ajout des catégories dans le formulaire
    async function setupCategoryDropdown() {
        const categorySelect = document.getElementById("category");
    
        // Ajout d'une première option vide
        const emptyOption = document.createElement("option");
        emptyOption.value = ""; 
        emptyOption.textContent = "Veuillez choisir une catégorie"; 
        emptyOption.disabled = true; // Empêche la sélection de cette option après soumission
        emptyOption.selected = true; // Rend cette option sélectionnée par défaut
        categorySelect.appendChild(emptyOption);
    
        try {
            const response = await fetch("http://localhost:5678/api/categories");
            const categories = await response.json();
            categories.forEach((category) => {
                // Création d'une option pour chaque catégorie
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            
        }
    }
    
    // Fonction pour configurer le formulaire permettant l'ajout de photo
    function setupAddPhotoForm() {
        const form = document.querySelector(".modal-form"); // Formulaire d'ajout d'image
        const pictureInput = document.getElementById("picture"); // Input pour l'image
        const titleInput = document.getElementById("title"); // Input pour le titre
        const categorySelect = document.getElementById("category"); // Input pour les catégories
        const addPictureDiv = document.querySelector(".add-picture"); // Zone d'aperçu de l'image
    
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
    
            if (!pictureInput.files[0] || !titleInput.value.trim() || !categorySelect.value) {
                alert("Veuillez remplir tous les champs du formulaire.");
                return;
            }
    
            // Crée un objet FormData avec les données du formulaire
            const formData = new FormData();
            formData.append("image", pictureInput.files[0]);
            formData.append("title", titleInput.value.trim());
            formData.append("category", categorySelect.value);
    
            try {
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                    },
                    body: formData,
                });
    
                if (!response.ok) {
                    throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
                }
    
                const newWork = await response.json();
                fetchWorksForModal(); 
                fetchWorks();
                resetForm(form, addPictureDiv);
            } catch (error) {
                console.error("Erreur lors de l'ajout de la photo :", error);
            }
        });
    
        // Gestion de l'aperçu de l'image téléchargée
        pictureInput.addEventListener("change", () => {
            const file = pictureInput.files[0];
            if (file) {
                const reader = new FileReader();
            
                reader.onload = (e) => {
                    addPictureDiv.style.backgroundImage = `url(${e.target.result})`; 
                    addPictureDiv.style.backgroundSize = "cover";
                    addPictureDiv.style.backgroundPosition = "center";
    
                    // Masque les éléments de texte pour un effet propre
                    addPictureDiv.querySelector("label").style.opacity = "0";
                    addPictureDiv.querySelector("i").style.opacity = "0";
                    addPictureDiv.classList.add("image-loaded");
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Réinitialise le formulaire après l'ajout d'une photo
    function resetForm(form, addPictureDiv) {
        form.reset(); 
        addPictureDiv.style.backgroundImage = ""; 
        addPictureDiv.querySelector("label").style.opacity = "1"; 
        addPictureDiv.querySelector("i").style.opacity = "1"; 
        addPictureDiv.classList.remove("image-loaded"); 
    }