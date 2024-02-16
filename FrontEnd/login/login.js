
const urlUsersLogin = 'http://localhost:5678/api/users/login';

/**
 * Cette fonction prend un email en paramètre et est valide lorsqu'il est au bon format. 
 * @param {string} email 
 * @return {boolean}
 */
const emailLogin = document.getElementById("email");

function vérifierEmail(email) {
    const emailRegExp = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/);
    if (emailRegExp.test(email)) {
        console.log("ok")
        emailLogin.classList.remove(errorEmail)
        return true
    }
    return false
}


function generateListenerForm () {
    const loginForm = document.getElementById("formConnexion");
    const emailLogin = document.getElementById("email");
    const passwordLogin = document.getElementById("password");
    const errorEmail = loginForm.querySelector(".errorEmail");
    const errorPassword = loginForm.querySelector(".errorEmail");

    // ajout de l'event Listener sur le champ email
    emailLogin.addEventListener("keypress", (event) => {
        const user = event.target.value;
        const valide = vérifierEmail(email);
        console.log(user)
        //verification email
        if (user === "") {
            errorEmail.innerHTML = "Veuillez saisir une adresse mail valide!";
        // verification du format email
        } else if (valide) {
            console.log(ok)
            errorEmail.innerHTML = "";
        }
    });
    // ajout de l'event Listener sur le champ mot de passe
    passwordLogin.addEventListener("keypress", (event) => {
        const user = event.target.value ;
        console.log(user)
        //verification mot de passe
        if (user === "") {
            errorPassword.innerHTML = "Veuillez saisir un mot de passe valide!";;
        } else {
            errorEmail.innerHTML = "";
        }
    });
    // ajout de l'event Listener sur le formaulaire
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        // Si absence de mail et mot de passe ou mail et mot de passe invalides, déclancher une alerte 
        if (emailLogin.value === "" ||  passwordLogin.value === "") {
            alert("Veuillez renseigner tous les champs du formulaire de connexion");
        }
        if (!emailLogin.validity.valid && !passwordLogin.validity.valid) {
            alert("Veuillez renseigner une adresse email et un mot de passe valides!")
        } else {
            let validateUser = {
                email: `${emailLogin.value}`,
                password: `${passwordLogin.value}`
            };

            //envoyer les email et mot de passe à l'API
            fetch(urlUsersLogin, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                },
                body: JSON.stringify(validateUser)
            })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                if (response.status === 404) {
                    return alert("Vos identitfiants ne correspondent pas, veuillez réessayer")
                }
                if (response.status === 401) {
                    throw alert("Vous n'êtes pas autorisés à vous connecter car vos identifiants sont incorrects")
                }
            })
            // puis on stocke le token dans le localStorage
            .then((userDatas) => {
                let { userId, token } = userDatas;
                if (userId && token) {
                    //enregistrement de userID et token dans le localStorage
                    localStorage.setItem("token", token);
                    localStorage.setItem("userId", userId);
                    location.replace("../index.html");
                    //redirection vers la page index
                }
            })
            .catch((error) => {console.log(`Une erreur est survenue : ${error.message}`)});
        }
    });
}

generateListenerForm ();
