// PART LOGIN //------------------------------------------------------------------------------------------------------

const loginApi = "http://localhost:5678/api/users/login";

document.getElementById("loginform").addEventListener("submit",handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();

  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  let response = await fetch(loginApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if(response.status != 200){
    const errorConnect = document.createElement("div");
    errorConnect.className = 'error_login';
    errorConnect.innerHTML = "Il y a eu une erreur";
    document.querySelector('form').prepend(errorConnect);
  }

  let result = await response.json();
  const token = result.token;
  sessionStorage.setItem("authToken",token);
  window.location.href = "../Common/index.html";
}


