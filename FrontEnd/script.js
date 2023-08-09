
const urlWorks = 'http://localhost:5678/api/works';
const urlCategories = 'http://localhost:5678/api/categories';
const urlUsersLogin = 'http://localhost:5678/api/users/login';


// Affichage de tous les projets dans la galerie //
function displayWorks(data) {
    document.querySelector(".gallery").innerHTML = "";
    for (const work of data) {
        const worksGallery = document.querySelector(".gallery");
        const workElement = document.createElement("figure");
        workElement.dataset.id = work.categoryId;
        const workImage = document.createElement("img");
        workImage.src = work.imageUrl;
        workImage.alt = work.title;
        const workDetail = document.createElement("figcaption")
        workDetail.innerText = work.title;
        // rattachement des balises aux DOM
        worksGallery.appendChild(workElement);
        workElement.appendChild(workImage);
        workElement.appendChild(workDetail);
    }
    console.log(data[1].imageUrl)
}

fetch(urlWorks)
.then((response) => response.json())
.then((data) => displayWorks(data))
.catch((error) => {console.log(`Une erreur est survenue : ${error.message}`)})



// création des buttons de filtres des projets
function createFiltersButtons(datas) {
    const containerFilterWorks = document.querySelector("#portfolio .categories");
    const categoryButtonSelected = document.createElement("button");
    categoryButtonSelected.className = `filter-btn category-btn-selected`;
    categoryButtonSelected.textContent = "Tous";
    categoryButtonSelected.dataset.id = 0;
    containerFilterWorks.appendChild(categoryButtonSelected);
    for (const category of datas) {
        const categoryButton = document.createElement("button");
        categoryButton.className = `filter-btn`;
        categoryButton.textContent = category.name;
        categoryButton.dataset.id = category.id
        containerFilterWorks.appendChild(categoryButton);
    };

}

// Ajout des eventListeners sur les boutons


function filtersWorks (works) {
    const filterContainer = document.querySelectorAll(".categories button");
    for (let i = 0; i < filterContainer.length; i++) {
        const filterButton = document.querySelector(`.categories button:nth-child(${i+1})`);
        // ajout d'eventListener pour chacun des boutons
        filterButton.addEventListener("click", () => {
            
            //activer ou désactiver les boutons de filtre
            let filterButtonSelect = document.querySelector(".category-btn-selected");
            filterButtonSelect.classList.remove("category-btn-selected");
            filterButton.classList.add("category-btn-selected");
            
            // création des projets filtrés par catégorie
            let worksFiltered = works.filter((work) => {
                return work.categoryId === i || i === 0;
            });
            //afficher les projets filtrés
            return displayWorks(worksFiltered)
        });
    }     
}

fetch(urlWorks)
.then((resp) => resp.json())
.then((works) => filtersWorks (works))
.catch((error) => {console.log(`Une erreur est survenue : ${error.message}`)})



/////////// création Homepage Edit /////////



const userId = window.localStorage.getItem('userId');
const userToken = window.localStorage.getItem('token');
const loggedIn = userId && userToken ? true : false;

// Retrait des filtres des projets lorsque nous ne sommes pas connectés
if (!loggedIn) {
    fetch(urlCategories)
    .then((response) => response.json())
    .then((datas) => createFiltersButtons(datas))
    .catch((error) => {console.log(`Une erreur est survenue : ${error.message}`)})

}


if (loggedIn){
    
    //modif texte lien nav "login" en "logout"
    const navLogin = document.querySelector("nav li:nth-child(3) a");
    navLogin.innerText = "logout";

    // création du mode édition dans le header
    const body = document.querySelector("body");
    const header = body.querySelector("header");
    const headerEdition = document.createElement("section");
    headerEdition.className = "modeEdition";
    headerEdition.innerHTML = 
        `<ul class="listModeEdition">
            <li><i class="fa-regular fa-pen-to-square"></i></li>
            <li>Mode édition</li>
            <li><a class="publicationChange">publier les changements</a></li>
        </ul>`;
    body.appendChild(headerEdition);
    body.insertBefore(headerEdition, header);

    // ajout bouton modif intro
    const introductionImage = document.querySelector(".introductionImage");
    const portfolioSection = document.querySelector("#portfolio");
    const portfolioCategories = document.querySelector(".categories");

    const buttonEditGalleryIntro = document.createElement("div");
    buttonEditGalleryIntro.className = "edition-gallery";
    const iconEditGalleryIntro = document.createElement("i");
    iconEditGalleryIntro.className = "fa-regular fa-pen-to-square";
    const textEditGalleryIntro = document.createElement("a");
    textEditGalleryIntro.innerText = "modifier";
    introductionImage.appendChild(buttonEditGalleryIntro);
    buttonEditGalleryIntro.appendChild(iconEditGalleryIntro);
    buttonEditGalleryIntro.appendChild(textEditGalleryIntro);

    const buttonEditGalleryPortfolio = document.createElement("div");
    buttonEditGalleryPortfolio.className = "edition-gallery";
    const iconEditGalleryPortfolio = document.createElement("i");
    iconEditGalleryPortfolio.className = "fa-regular fa-pen-to-square";
    const textEditGalleryPortfolio = document.createElement("a");
    textEditGalleryPortfolio.innerText = "modifier";
    portfolioSection.appendChild(buttonEditGalleryPortfolio);
    buttonEditGalleryPortfolio.appendChild(iconEditGalleryPortfolio);
    buttonEditGalleryPortfolio.appendChild(textEditGalleryPortfolio);
    portfolioSection.insertBefore(buttonEditGalleryPortfolio, portfolioCategories);

    createModal();

    //ajout de l'event listener au bouton modif Portfolio
    buttonEditGalleryPortfolio.addEventListener("click", ()=> {
        toggleModal();
    });
    
    navLogin.addEventListener("click", (event) => {
    
        if (loggedIn) {
            event.preventDefault();
            window.localStorage.removeItem("userId");
            window.localStorage.removeItem("token");
            window.location.href = "./index.html";
        }
    });


}

// création de la fenêtre modale

function createModal() {
    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const sectionModal = document.createElement("section");
    sectionModal.setAttribute("class", "modal");
    const returnModalWorks = document.createElement("i");
    returnModalWorks.className = "return fa-solid fa-arrow-left";
    returnModalWorks.style.display = "none";
    const closeModal = document.createElement("i");
    closeModal.className = "fa-solid fa-xmark";
    const contentModal = document.createElement("div");
    contentModal.className = "modal-content";
    const galleryContentModal = document.createElement("section");
    galleryContentModal.className = "section-gallery";
    const titleGallery = document.createElement("h2");
    titleGallery.innerText = "Galerie photo";
    const modalWorksGallery = document.createElement("div");
    modalWorksGallery.className = "modal-gallery";
    const formContentModal = document.createElement("section");
    formContentModal.className = "section-form";
    const titleForm = document.createElement("h2");
    titleForm.innerText = "Ajout photo";


    const buttonAddWork = document.createElement("button");
    buttonAddWork.setAttribute("type", "button");
    buttonAddWork.className = "btn-add-work";
    buttonAddWork.innerText = "Ajouter une photo";
    const buttonCancelGallery = document.createElement("a");
    buttonCancelGallery.setAttribute("href", "#");
    buttonCancelGallery.className = "btn-cancel-gallery";
    buttonCancelGallery.textContent = "Supprimer la galerie";
    body.insertBefore(sectionModal, header);
    sectionModal.appendChild(contentModal);
    contentModal.appendChild(returnModalWorks);
    contentModal.appendChild(closeModal);
    contentModal.appendChild(galleryContentModal);
    contentModal.appendChild(formContentModal);
    galleryContentModal.appendChild(titleGallery);
    galleryContentModal.appendChild(modalWorksGallery);
    galleryContentModal.appendChild(buttonAddWork);
    galleryContentModal.appendChild(buttonCancelGallery);
    formContentModal.appendChild(titleForm);

    getWorksModal();
    addWorks();

    buttonAddWork.addEventListener("click", ()=> {
        /*galleryContentModal.style.display = "none";*/
        returnModalWorks.style.display = "block";
        formContentModal.classList.toggle("active");
        galleryContentModal.classList.toggle("disable");
    })

    returnModalWorks.addEventListener("click", ()=>{
        returnModalWorks.style.display = "none";
        galleryContentModal.classList.toggle("disable");
        formContentModal.classList.toggle("active");

    })
    // au click de l'icone "x", fermer la fenetre sectionModal
    closeModal.addEventListener("click", ()=> {
        sectionModal.classList.toggle("active");
        galleryContentModal.classList.toggle("disable");
        formContentModal.classList.toggle("active");

    });
    // au click en dehors de la modale, fermer la fenetre sectionModal
    window.addEventListener("click", (event)=> {
        if (event.target == sectionModal) {
            sectionModal.classList.toggle("active");
            galleryContentModal.classList.toggle("disable");
            formContentModal.classList.toggle("active");
    
        }
    });

    
}

// générer les travaux de la modale
async function getWorksModal() {
    try {
        const data = await fetchDatas();
        document.querySelector(".modal-gallery").innerHTML = "";
        for (work of data) {
            const modalWorksGallery = document.querySelector(".modal-gallery");
            const modalWorkElement = document.createElement("figure");
            modalWorkElement.dataset.id = work.id;
            const modalWorkImage = document.createElement("img");
            modalWorkImage.src = work.imageUrl;
            modalWorkImage.dataset.id = work.id;
            const modalWorkImageIcon = document.createElement("i");
            modalWorkImageIcon.dataset.id = work.id;
            modalWorkImageIcon.className = "iconDelete fa-solid fa-trash-can";
            const editWorkElement = document.createElement("p");
            editWorkElement.innerText = "éditer";
            // rattachement des balises aux DOM
            modalWorksGallery.appendChild(modalWorkElement);
            modalWorkElement.appendChild(modalWorkImage);
            modalWorkElement.appendChild(editWorkElement);
            modalWorkElement.appendChild(modalWorkImageIcon);

            // fonction qui supprime les travaux au clic de l'icone "supprimer"

            modalWorkImageIcon.addEventListener("click", (e)=>{
                e.preventDefault();
                id = e.target.dataset.id;
                //const idWork = {id: `${id.value}`};
                const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MTQ3Nzc3NCwiZXhwIjoxNjkxNTY0MTc0fQ.IV7lGM31wdcg-cPkMakQAUCLTvsjijw2ynxSONWdC_0";
                fetch(urlWorks + `/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "accept": "*/*",
                        "Authorization": `Bearer ${token}`,
                    //body: JSON.stringify(idWork)
                    }
                })/*
                .then(response => {
                    return response.json();
                })*/
                .then(data =>
                    console.log(data))
            })
        }
    }catch (error) {
        console.log(`Une erreur de la fonction "getWorksModal" s'est produite`)
    }
}

// fonction changement de classList de la modal à intégrer au listener "modifier"
function toggleModal() {
    const sectionModal = document.querySelector(".modal");
    sectionModal.classList.toggle("active");
}


// fonction ajout projet à la modale

function addWorks () {
    const formContentModal = document.querySelector(".section-form");
    const formAddWorks = document.createElement("FORM");
    formAddWorks.setAttribute('id', 'formAddWorks');
    formAddWorks.setAttribute('method', 'post');
    const imagePreview = document.createElement("img");
    imagePreview.src = "";
    imagePreview.className = "preview-file";
    const labelPhoto = document.createElement("label");
    labelPhoto.setAttribute("for", "load-photo")
    labelPhoto.className = "label-photo";
    const divPhoto = document.createElement("div");
    divPhoto.className = "upload";
    divPhoto.textContent = "+ Ajouter photo";
    const inputPhoto = document.createElement("input");
    inputPhoto.setAttribute("type", "file");
    inputPhoto.setAttribute("name", "load-photo");
    inputPhoto.setAttribute("id", "load-photo");
    const spanPhoto = document.createElement("span");
    spanPhoto.textContent = "jpg, png : 4mo max";
    const labelTitle = document.createElement("label");
    labelTitle.setAttribute("for", "title");
    labelTitle.textContent = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("id", "title");
    inputTitle.setAttribute("name", "title");
    const labelCategory = document.createElement("label");
    labelCategory.setAttribute("for", "category");
    labelCategory.textContent = "Catégorie";
    const selectCategory = document.createElement("select");
    selectCategory.setAttribute("id", "category");
    selectCategory.setAttribute("name", "category");
    const optionCategory = document.createElement("option");
    optionCategory.innerHTML = "";
    const lineForm = document.createElement("hr");
    lineForm.className = "line-form";
    const submitFormAddWorks = document.createElement("input");
    submitFormAddWorks.setAttribute("type", "submit");
    submitFormAddWorks.setAttribute("value", "Valider");
    submitFormAddWorks.setAttribute("name", "submit");

    formContentModal.appendChild(formAddWorks);
    formAddWorks.appendChild(imagePreview);
    formAddWorks.appendChild(labelPhoto);
    labelPhoto.appendChild(imagePreview);
    labelPhoto.appendChild(divPhoto);
    labelPhoto.appendChild(inputPhoto);
    labelPhoto.appendChild(spanPhoto);
    formAddWorks.appendChild(labelTitle);
    formAddWorks.appendChild(inputTitle);
    formAddWorks.appendChild(labelCategory);
    formAddWorks.appendChild(selectCategory);
    selectCategory.appendChild(optionCategory);
    formAddWorks.appendChild(lineForm);
    formAddWorks.appendChild(submitFormAddWorks);
    createOption(category)
    /*const inputImage = document.getElementById("#formAddWorks input[type=file]");
    const inputCategories = document.getElementById("category");*/
    submitFormAddWorks.addEventListener("submit", (e) => {
        e.preventDefault();
        if (inputImage.files === "" || inputTitle.value === "" || inputCategories.value === "") {
            alert("Veuillez compléter tous les champs");
        } else if (returnFileSize(inputImage.files.size) < 4){
            alert("Veuillez insérer un fihier inférieur à 4 Mo");
        } else{
            const postWork = {
                imageUrl: `${imageFile[0].value}`,
                title: `${inputTitle[0].value}`,
                category: `${selectCategory.options[0].id}`
            };
            fetch(urlWorks, {
                method: "POST",
                headers: {
                "Content-Type": "multipart/form-data",
                "accept": "application/json",
                "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(postWork)
            })
            .then((response) => {
                if (response.status === 200){
                    return response.json()
                } else if (response.status === 404) {
                    throw new Error("Erreur de récupération des données API")
                } else if (response.status === 405) {
                    return window.location.reload();
                    //throw new Error("Erreur de récupération des données API")
                }
                return response.json()
            })
            .then((data) => console.log(data))
            .catch((error) => {console.log(`Une erreur est survenue : ${error.message}`)});
        }
    })
}

function createOption(category) {
    const selectCategory = document.querySelector("select");

    for (let index = 0; index < category.length; index++) {
        const optionCategory = document.createElement("option");
        optionCategory.dataset.id = index.id;
        optionCategory.textContent = index.name;
        selectCategory.appendChild(optionCategory);
    }
}

fetch(urlCategories)
.then((response) => response.json())
.then((category) => createOption(category))
.catch((error) => {console.log(`Une erreur est survenue : ${error.message}`)})

console.log(optionCategory[1].value)

// fonction fetch pour récupérer les travaux de la modale
async function fetchDatas() {
    try {
        const response = await fetch(urlWorks);
        if (!response.ok) {
            throw new Error("Erreur de récupération des données API")
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(urlCategories);
        if (!response.ok) {
            throw new Error("Erreur de récupération des données API")
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// fonction pour convertir la taille du fichier en MO
function returnFileSize(number) {
    if (number < 1024) {
        return number + " octets";
    } else if (number >= 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + " Ko";
    } else if (number >= 1048576) {
        return (number / 1048576).toFixed(1) + " Mo";
    }
}

// fonction pour prévisualiser l'image chargée dans addWorks
function previewFile() {
    const loadImageFile = document.querySelector("#formAddWorks img");
    const inputImageFile = document.querySelector("#formAddWorks input[type=file]").files[0];
    const uploadImage = document.querySelector(".upload");
    const spanImage = document.querySelector("#formAddWorks span")
    const reader  = new FileReader();
    reader.addEventListener("load", function () {
        loadImageFile.src = reader.result;

    }, 
    false);
    console.log(`File name: ${inputImageFile.name}`)

    if (inputImageFile) {
        reader.readAsDataURL(inputImageFile);
        loadImageFile.style.display = "block";
        uploadImage.style.display = "none";
        spanImage.style.display = "none";
    }
}



// fonction (insérée dans la fn addWorks) pour envoyer le projet à l'API
async function postDatas() {
    const imageFile = document.querySelector(".label-photo").files;
    const inputTitle = document.getElementById("#title");
    const inputCategory = document.getElementById("#category");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MTQ3Nzc3NCwiZXhwIjoxNjkxNTY0MTc0fQ.IV7lGM31wdcg-cPkMakQAUCLTvsjijw2ynxSONWdC_0";
    const postWork = {
        imageUrl: `${imageFile.value}`,
        title: `${inputTitle.value}`,
        category: `${inputCategory.value}`
    };
    try {
        const response = await fetch(urlWorks, {
            method: "POST",
            headers: {
            "Content-Type": "multipart/form-data",
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(postWork)
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//enregistrer le token dans le LS 
if (loggedIn === null){
    fetch(urlUsersLogin)
    .then((response) => response.json())
    .then((userData) => {
        let { userId, token } = userData;
        if (userId && token) {
            //enregistrement de userID et token dans le localStorage
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("userId", userId);
        }
    })
}

