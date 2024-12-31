// PART LOGIN //------------------------------------------------------------------------------------------------------


document.getElementById("submit").addEventListener("click", async (event) => {
    
  event.preventDefault()

  
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const oldError = document.querySelector(".error-message")
  if (oldError) {
      oldError.remove()
  }

  try {
      // Envoie une requête POST à l'API pour tenter de se connecter
      const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST", 
          headers: {
              "Content-Type": "application/json" 
          },
          body: JSON.stringify({ email, password }) 
      })

      if (!response.ok) {
          throw new Error("Erreur lors de la connexion")
      }


      const data = await response.json()
      const token = data.token
      console.log("Token récupéré :", token)

      
      sessionStorage.setItem("accessToken", token)
      window.location.href = "../Common/index.html"
  } catch (error) {
      

      // Crée dynamiquement un paragraphe pour afficher un message d'erreur
      const errorMessage = document.createElement("p")
      errorMessage.textContent = "“Erreur dans l’identifiant ou le mot de passe”"
      errorMessage.classList.add("error-message") 

      // Ajoute le message d'erreur à la fin du formulaire
      const form = document.querySelector("#login form")
      form.appendChild(errorMessage)
  }
})