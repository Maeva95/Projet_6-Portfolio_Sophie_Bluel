
const urlWorks = 'http://localhost:5678/api/works';
const urlCategories = 'http://localhost:5678/api/categories';
const urlUsersLogin = 'http://localhost:5678/api/users/login';


// Affichage de tous les projets dans la galerie //
function displayWorks(works) {
    document.querySelector('.gallery').innerHTML = '';
    for (const work of works) {
        const worksGallery = document.querySelector('.gallery');
        const workElement = document.createElement('figure');
        workElement.dataset.id = work.id;
        const workImage = document.createElement('img');
        workImage.src = work.imageUrl;
        workImage.alt = work.title;
        const workDetail = document.createElement('figcaption')
        workDetail.innerText = work.title;
        // rattachement des balises aux DOM
        worksGallery.appendChild(workElement);
        workElement.appendChild(workImage);
        workElement.appendChild(workDetail);
    }
}

fetch(urlWorks)
.then((response) => response.json())
.then((works) => displayWorks(works))
.catch((error) => {console.log(`Une erreur displayWorks est survenue : ${error.message}`)})


// création des buttons de filtres des projets
function createFiltersButtons(datas) {
    const containerFilterWorks = document.querySelector('#portfolio .categories');
    const categoryButtonSelected = document.createElement('button');
    categoryButtonSelected.className = `filter-btn category-btn-selected`;
    categoryButtonSelected.textContent = 'Tous';
    categoryButtonSelected.dataset.id = 0;
    containerFilterWorks.appendChild(categoryButtonSelected);
    for (const category of datas) {
        const categoryButton = document.createElement('button');
        categoryButton.className = `filter-btn`;
        categoryButton.textContent = category.name;
        categoryButton.dataset.id = category.id
        containerFilterWorks.appendChild(categoryButton);
    };

}

// Ajout des eventListeners sur les boutons


function filtersWorks (works) {
    const filterContainer = document.querySelectorAll('.categories button');
    for (let i = 0; i < filterContainer.length; i++) {
        const filterButton = document.querySelector(`.categories button:nth-child(${i+1})`);
        // ajout d'eventListener pour chacun des boutons
        filterButton.addEventListener('click', (e) => {
            
            //activer ou désactiver les boutons de filtre
            let filterButtonSelect = document.querySelector('.category-btn-selected');
            filterButtonSelect.classList.remove('category-btn-selected');
            filterButton.classList.add('category-btn-selected');
            
            // création des projets filtrés par catégorie
            let worksFiltered = works.filter((work) => {
                return work.categoryId === i || i === 0;
            });
            console.log(e.target)
            //afficher les projets filtrés
            return displayWorks(worksFiltered)
            
        });
    }     
}


fetch(urlWorks)
.then((resp) => resp.json())
.then((works) => filtersWorks(works))
.catch((error) => {console.log(`Une erreur de filtersWorks est survenue : ${error.message}`)})


/////////// création Homepage Edit /////////


const userId = window.localStorage.getItem('userId');
const userToken = window.localStorage.getItem('token');
const loggedIn = userId && userToken ? true : false;
const tokenBearer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MjYxMjQyOCwiZXhwIjoxNjkyNjk4ODI4fQ.ydweze5-remY-yfWrbr7iU66keskpD6gP4I1GFy7m6Q';

// Retrait des filtres des projets lorsque nous ne sommes pas connectés
if (!loggedIn) {
    fetch(urlCategories)
    .then((response) => response.json())
    .then((datas) => createFiltersButtons(datas))
    .catch((error) => {console.log(`Une erreur createFilters est survenue : ${error.message}`)})
}

//enregistrer le token dans le LS 
if (loggedIn === null){
    fetch(urlUsersLogin)
    .then((response) => response.json())
    .then((userData) => {
        let { userId, token } = userData;
        if (userId && token) {
            //enregistrement de userID et token dans le localStorage
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('userId', userId);
        }
    })
}


if (loggedIn){
    
    //modif texte lien nav 'login' en 'logout'
    const navLogin = document.querySelector('nav li:nth-child(3) a');
    navLogin.innerText = 'logout';

    // création du mode édition dans le header
    const body = document.querySelector('body');
    const header = body.querySelector('header');
    const headerEdition = document.createElement('section');
    headerEdition.className = 'modeEdition';
    headerEdition.innerHTML = 
        `<ul class='listModeEdition'>
            <li><i class='fa-regular fa-pen-to-square'></i></li>
            <li>Mode édition</li>
            <li><a class='publicationChange'>publier les changements</a></li>
        </ul>`;
    body.appendChild(headerEdition);
    body.insertBefore(headerEdition, header);

    // ajout bouton modif intro
    const introductionImage = document.querySelector('.introductionImage');
    const portfolioSection = document.querySelector('#portfolio');
    const portfolioCategories = document.querySelector('.categories');

    const buttonEditGalleryIntro = document.createElement('div');
    buttonEditGalleryIntro.className = 'edition-gallery';
    const iconEditGalleryIntro = document.createElement('i');
    iconEditGalleryIntro.className = 'fa-regular fa-pen-to-square';
    const textEditGalleryIntro = document.createElement('a');
    textEditGalleryIntro.innerText = 'modifier';
    introductionImage.appendChild(buttonEditGalleryIntro);
    buttonEditGalleryIntro.appendChild(iconEditGalleryIntro);
    buttonEditGalleryIntro.appendChild(textEditGalleryIntro);

    const buttonEditGalleryPortfolio = document.createElement('div');
    buttonEditGalleryPortfolio.className = 'edition-gallery';
    const iconEditGalleryPortfolio = document.createElement('i');
    iconEditGalleryPortfolio.className = 'fa-regular fa-pen-to-square';
    const textEditGalleryPortfolio = document.createElement('a');
    textEditGalleryPortfolio.innerText = 'modifier';
    portfolioSection.appendChild(buttonEditGalleryPortfolio);
    buttonEditGalleryPortfolio.appendChild(iconEditGalleryPortfolio);
    buttonEditGalleryPortfolio.appendChild(textEditGalleryPortfolio);
    portfolioSection.insertBefore(buttonEditGalleryPortfolio, portfolioCategories);

    // intégration de la modale et de la galerie
    createModal();
    displayWorksModal ();

    const buttonPublicationChange = document.querySelector('.publicationChange');
    buttonPublicationChange.addEventListener('click', (event) => {
        if (loggedIn) {
            event.preventDefault();
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('token');
            window.location.href = './index.html';
        }
    });

    navLogin.addEventListener('click', (event) => {
    
        if (loggedIn) {
            event.preventDefault();
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('token');
            window.location.href = './index.html';
        }
    });

    buttonEditGalleryPortfolio.addEventListener('click', () => {
        const sectionModal = document.querySelector('.modal');
        sectionModal.style.display = 'block';
        const galleryContentModal = document.querySelector('.section-gallery');
        galleryContentModal.style.display = 'flex';
    });
}

// création de la fenêtre modale

function createModal () {
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    const sectionModal = document.createElement('section');
    sectionModal.setAttribute('class', 'modal');
    sectionModal.style.display = 'none';
    const returnModalWorks = document.createElement('i');
    returnModalWorks.className = 'return fa-solid fa-arrow-left';
    returnModalWorks.style.display = 'none';
    const iconCloseModal = document.createElement('i');
    iconCloseModal.className = 'fa-solid fa-xmark';
    const contentModal = document.createElement('div');
    contentModal.className = 'modal-content';
    const galleryContentModal = document.createElement('section');
    galleryContentModal.className = 'section-gallery';
    const titleGallery = document.createElement('h2');
    titleGallery.innerText = 'Galerie photo';
    const modalWorksGallery = document.createElement('div');
    modalWorksGallery.className = 'modal-gallery';
    const formContentModal = document.createElement('section');
    formContentModal.className = 'section-form';
    formContentModal.style.display = 'none';
    const titleForm = document.createElement('h2');
    titleForm.innerText = 'Ajout photo';
    const buttonAddWork = document.createElement('button');
    buttonAddWork.setAttribute('type', 'button');
    buttonAddWork.className = 'btn-add-work';
    buttonAddWork.innerText = 'Ajouter une photo';
    const buttonCancelGallery = document.createElement('a');
    buttonCancelGallery.setAttribute('href', '#');
    buttonCancelGallery.className = 'btn-cancel-gallery';
    buttonCancelGallery.textContent = 'Supprimer la galerie';

    body.insertBefore(sectionModal, header);
    sectionModal.appendChild(contentModal);
    contentModal.appendChild(returnModalWorks);
    contentModal.appendChild(iconCloseModal);
    contentModal.appendChild(galleryContentModal);
    contentModal.appendChild(formContentModal);
    galleryContentModal.appendChild(titleGallery);
    galleryContentModal.appendChild(modalWorksGallery);
    galleryContentModal.appendChild(buttonAddWork);
    galleryContentModal.appendChild(buttonCancelGallery);
    formContentModal.appendChild(titleForm);
    
    addWorks();

    buttonAddWork.addEventListener('click', ()=> {
        returnModalWorks.style.display = 'block';
        formContentModal.style.display = 'flex';
        galleryContentModal.style.display = 'none';
    });

    returnModalWorks.addEventListener('click', ()=>{
        returnModalWorks.style.display = 'none';
        formContentModal.style.display = 'none';
        galleryContentModal.style.display = 'flex';
    });

    buttonCancelGallery.addEventListener('click', () => {
        deleteGallery();
    })

    // au click de l'icone 'x', fermer la fenetre sectionModal
    iconCloseModal.addEventListener('click', closeModal);

    // au click en dehors de la modale, fermer la fenetre sectionModal
    window.addEventListener('click', (event)=> {
        if (event.target == sectionModal) {
            closeModal();
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' || event.key === 'Esc' || event.key === 'Echap') {
            closeModal();
        }
    });
}

function closeModal () {
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.section-gallery').style.display = 'none';
    document.querySelector('.section-form').style.display = 'none';
    document.querySelector('.return').style.display = 'none';
}

function deleteGallery() {
    const modalWorkElements = document.querySelectorAll('.modal-gallery figure');
    for (let index = 0; index < modalWorkElements.length; index++) {
        const modalWorkElement = document.querySelector(`.modal-gallery figure:nth-child(${index+1})`);
        const id = modalWorkElement.dataset.id;
        fetch(urlWorks + `/${id}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${tokenBearer}`
            },
        })
        .then((reponse) => reponse.json())
        .then(works => console.log(works))
        .then((works) => works)
        .then(modalWorkElement.remove())
        .then(workElement.remove())
        .catch((error) => console.log("Une erreur de deletGallery est survenue: " + (error.message)))
    }
}

// générer les travaux de la modale
async function displayWorksModal () {
    try {
        const data = await fetchDatas();
        document.querySelector('.modal-gallery').innerHTML = '';

        for (work of data) {
            const modalWorksGallery = document.querySelector('.modal-gallery');
            const modalWorkElement = document.createElement('figure');
            modalWorkElement.dataset.id = work.id;
            const modalWorkImage = document.createElement('img');
            modalWorkImage.src = work.imageUrl;
            modalWorkImage.dataset.id = work.id;
            const modalIconDeleteWork = document.createElement('i');
            modalIconDeleteWork.dataset.id = work.id;
            modalIconDeleteWork.className = 'icon-delete fa-solid fa-trash-can';
            const modalIconMoveWork = document.createElement('i');
            modalIconMoveWork.className = 'icon-move fa-solid fa-arrows-up-down-left-right';
            modalIconMoveWork.style.visibility = 'hidden';
            const editWorkElement = document.createElement('p');
            editWorkElement.innerText = 'éditer';
            // rattachement des balises aux DOM
            modalWorksGallery.appendChild(modalWorkElement);
            modalWorkElement.appendChild(modalWorkImage);
            modalWorkElement.appendChild(editWorkElement);
            modalWorkElement.appendChild(modalIconDeleteWork);
            modalWorkElement.appendChild(modalIconMoveWork);

            const workElement = document.querySelector('.gallery figure');
            workElement.dataset.id = work.id;

            modalWorkElement.addEventListener('mouseover', function () {
                modalIconMoveWork.style.visibility = 'visible';
            }, false);

            modalWorkElement.addEventListener('mouseleave', function () {
                modalIconMoveWork.style.visibility = 'hidden';
            }, false);

            // supprimer un projet
            modalIconDeleteWork.addEventListener('click', (e)=> {
                e.preventDefault();
                deleteWorks(e);
            }, false)
            function deleteWorks() {
                
                const workElement = document.querySelector('.gallery figure');
                work.id = workElement.dataset.id;
                fetch(urlWorks + `/${work.id}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${tokenBearer}`
                    },
                })
                .then((reponse) => reponse.json())
                .then((result) => console.log(result))
                .then(modalWorkElement.remove())
                .then(workElement.remove())
                .catch((error) => console.log("Une erreur de DeleteWorks est survenue: " + (error.message)))
            }
            
        }
    console.table(work)
    } catch (error) {
        console.log('Message erreur: ' + (error.message) )
    }
}


// fonction suppression d'un projet dans la galerie

function deleteWorkGallery(work) {
    const workElement = document.querySelector('.gallery figure');
    workElement.dataset.id = work.id;
    workElement.remove();
    //fetch(urlWorks + `/${work.id}`, {
    //    method: 'DELETE',
    //    headers: {
    //        'accept': '*/*',
    //        'Authorization': `Bearer ${tokenBearer}`
    //    },
    //})
    //.then((reponse) => reponse.json())
    //.then((work) => console.log(work))
    //.then(workElement.remove())
    //.catch((error) => console.log("Une erreur de DeleteWorks est survenue: " + (error.message)))
}



// fonction ajout projet à la modale

function addWorks () {
    const formContentModal = document.querySelector('.section-form');
    const formAddWorks = document.createElement('form');
    formAddWorks.setAttribute('id', 'formAddWorks');
    const imagePreview = document.createElement('img');
    imagePreview.src = '';
    imagePreview.className = 'preview-file';
    const labelPhoto = document.createElement('label');
    labelPhoto.setAttribute('for', 'load-photo')
    labelPhoto.className = 'label-photo';
    const divPhoto = document.createElement('div');
    divPhoto.className = 'upload';
    divPhoto.textContent = '+ Ajouter photo';
    const inputPhoto = document.createElement('input');
    inputPhoto.setAttribute('type', 'file');
    inputPhoto.setAttribute('name', 'load-photo');
    inputPhoto.setAttribute('id', 'load-photo');
    const spanPhoto = document.createElement('span');
    spanPhoto.textContent = 'jpg, png : 4mo max';
    const labelTitle = document.createElement('label');
    labelTitle.setAttribute('for', 'title');
    labelTitle.textContent = 'Titre';
    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('id', 'title');
    inputTitle.setAttribute('name', 'title');
    const labelCategory = document.createElement('label');
    labelCategory.setAttribute('for', 'category');
    labelCategory.textContent = 'Catégorie';
    const selectCategory = document.createElement('select');
    selectCategory.setAttribute('id', 'category');
    selectCategory.setAttribute('name', 'category');
    const optionCategoryNull = document.createElement('option');
    optionCategoryNull.textContent = '';
    optionCategoryNull.dataset.id = 0;
    const lineForm = document.createElement('hr');
    lineForm.className = 'line-form';
    const submitFormAddWorks = document.createElement('input');
    submitFormAddWorks.className = 'submit';
    submitFormAddWorks.setAttribute('type', 'submit');
    submitFormAddWorks.setAttribute('value', 'Valider');
    submitFormAddWorks.setAttribute('name', 'submit');

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
    selectCategory.appendChild(optionCategoryNull);
    formAddWorks.appendChild(lineForm);
    formAddWorks.appendChild(submitFormAddWorks);
    createOption();
    
    //ajout EventListener pour chaque input
    inputPhoto.addEventListener('change', (e) => {
        e.preventDefault();
        let allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        
        if (0 > allowedFileTypes.indexOf(inputPhoto.files[0].type)) {
            alert ("Veuillez charger une image de type png, jpeg ou jpg");
        }else if (inputPhoto.files[0].size / (1024 * 1024) > 4 ) {
            alert ("La taille de l'image est supérieur à 4Mo. Veuillez charger une image dont la taille est inférieure à la taille autorisée");
        } else {
            previewFileLoaded();
        }
    });

    inputTitle.addEventListener('input', () => {
        console.log(inputTitle.value);
    });
    const optionSelected = document.getElementById('category').selectedIndex;

    selectCategory.addEventListener('change', () => {
        console.log(optionSelected);
    });
    
    if (inputPhoto === null && inputTitle === '' && optionSelected === null) {
        alert ("Veuillez compléter tous les champs du formulaire")
    } else {
        
    }
    formAddWorks.addEventListener('submit', (e) => {
        e.preventDefault();
        postWorks();

    }), false;
};


// création des options de l'input select
async function createOption() {
    const reponse = await fetch(urlCategories);
    const category = await reponse.json();
    const selectCategory = document.querySelector('select');

    for (let i = 0; i < category.length; i++) {
        const option = category[i];
        const optionCategory = document.createElement('option');
        optionCategory.dataset.id = option.id;
        optionCategory.setAttribute('value', `${option.id}`);
        optionCategory.textContent = option.name;
        selectCategory.appendChild(optionCategory);
    }
}

// fonction pour prévisualiser l'image chargée dans addWorks

let stateNames = {};
    stateNames[FileReader.EMPTY]   = 'EMPTY';
    stateNames[FileReader.LOADING] = 'LOADING';
    stateNames[FileReader.DONE]    = 'DONE';

function previewFileLoaded () {
    const loadImageFile = document.querySelector('#formAddWorks img');
    const inputImageFile = document.querySelector('#formAddWorks input[type=file]').files[0];
    const uploadImage = document.querySelector('.upload');
    const spanImage = document.querySelector('#formAddWorks span');
    const reader  = new FileReader();
    reader.addEventListener('load', () => {
        loadImageFile.src = reader.result;
        console.log('Après chargement: ' + stateNames[reader.readyState]);
    }, false);
    
    console.log('Avant lecture: ' + stateNames[reader.readyState]);
    if (inputImageFile) {
        reader.readAsDataURL(inputImageFile);
        console.log('Après lecture: ' + stateNames[reader.readyState]);
        loadImageFile.style.display = 'block';
        uploadImage.style.display = 'none';
        spanImage.style.display = 'none';
        console.log(inputImageFile);
    }
    
};

//fonction (insérée dans la fn addWorks) pour envoyer le projet à l'API

function postWorks () {
    const inputImageFile = document.querySelector('#formAddWorks input[type=file]').files[0];
    const inputTitleValue = document.querySelector('#formAddWorks input[type=text]').value;
    const optionSelected = document.querySelector('#formAddWorks select').selectedIndex;

    const formData = new FormData();
        formData.append('image', inputImageFile);
        formData.append('title', inputTitleValue);
        formData.append('category', optionSelected);

    const requestOptions = {
        method: 'POST',
        headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${tokenBearer}`
        },
        body: formData
    };
    fetch(urlWorks, requestOptions)
    .then(reponse => reponse.json())
    .then(data => console.log(data))
    .then((data) => displayWorksModal(data)) // ajout d'un projet posté à la modale
    .then((data) => createElementPosted(data)) // ajout d'un projet posté à la galerie
    .then(returnGalleryModal) // réinitialisation de la section modal
    .catch(error => console.console.error(error))
}

async function createElementPosted () {
    try {
        const data = await fetchDatas();
        document.querySelector('.gallery').innerHTML = '';
        for (const work of data) {
            const worksGallery = document.querySelector('.gallery');
            const workElement = document.createElement('figure');
            workElement.dataset.id = work.categoryId;
            const workImage = document.createElement('img');
            workImage.src = work.imageUrl;
            workImage.alt = work.title;
            const workDetail = document.createElement('figcaption')
            workDetail.innerText = work.title;
            // rattachement des balises aux DOM
            worksGallery.appendChild(workElement);
            workElement.appendChild(workImage);
            workElement.appendChild(workDetail);
        }
    } catch (error) {
        console.log('Message erreur: ' + (error.message) )
    }
}


const returnGalleryModal = function (){
    const returnModalWorks = document.querySelector('.return');
    returnModalWorks.style.display = 'none';
    const formContentModal = document.querySelector('.section-form');
    formContentModal.style.display = 'none';
    const inputTitle = document.querySelector('#formAddWorks #title');
    inputTitle.textContent = '';
    const selectCategory = document.querySelector('#formAddWorks #category');
    selectCategory.textContent = '';
    const galleryContentModal = document.querySelector('.section-gallery')
    galleryContentModal.style.display = 'flex';
}

// fonction fetch pour récupérer les travaux de la modale
async function fetchDatas() {
    try {
        const response = await fetch(urlWorks);
        if (!response.ok) {
            throw new Error('Erreur de récupération des données API')
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
