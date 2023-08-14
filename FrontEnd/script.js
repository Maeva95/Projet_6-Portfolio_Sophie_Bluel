
const urlWorks = 'http://localhost:5678/api/works';
const urlCategories = 'http://localhost:5678/api/categories';
const urlUsersLogin = 'http://localhost:5678/api/users/login';


// Affichage de tous les projets dans la galerie //
function displayWorks(data) {
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
}

fetch(urlWorks)
.then((response) => response.json())
.then((data) => displayWorks(data))
.catch((error) => {console.log(`Une erreur est survenue : ${error.message}`)})



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
        filterButton.addEventListener('click', () => {
            
            //activer ou désactiver les boutons de filtre
            let filterButtonSelect = document.querySelector('.category-btn-selected');
            filterButtonSelect.classList.remove('category-btn-selected');
            filterButton.classList.add('category-btn-selected');
            
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
const tokenBearer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MjAwNzg1NywiZXhwIjoxNjkyMDk0MjU3fQ.9pYtrSJSMAyeBpbmezSxJviTamQPJ_CqG-ssbL1s7i0';


// Retrait des filtres des projets lorsque nous ne sommes pas connectés
if (!loggedIn) {
    fetch(urlCategories)
    .then((response) => response.json())
    .then((datas) => createFiltersButtons(datas))
    .catch((error) => {console.log(`Une erreur est survenue : ${error.message}`)})

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

    createModal();

    //ajout de l'event listener au bouton modif Portfolio
    buttonEditGalleryPortfolio.addEventListener('click', ()=> {
        toggleModal();
    });
    
    navLogin.addEventListener('click', (event) => {
    
        if (loggedIn) {
            event.preventDefault();
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('token');
            window.location.href = './index.html';
        }
    });


}

// création de la fenêtre modale

function createModal() {
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    const sectionModal = document.createElement('section');
    sectionModal.setAttribute('class', 'modal');
    const returnModalWorks = document.createElement('i');
    returnModalWorks.className = 'return fa-solid fa-arrow-left';
    returnModalWorks.style.display = 'none';
    const closeModal = document.createElement('i');
    closeModal.className = 'fa-solid fa-xmark';
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

    buttonAddWork.addEventListener('click', ()=> {
        returnModalWorks.style.display = 'block';
        formContentModal.classList.toggle('active');
        galleryContentModal.classList.toggle('disable');
    })

    returnModalWorks.addEventListener('click', ()=>{
        returnModalWorks.style.display = 'none';
        galleryContentModal.classList.toggle('disable');
        formContentModal.classList.toggle('active');

    })
    // au click de l'icone 'x', fermer la fenetre sectionModal
    closeModal.addEventListener('click', ()=> {
        sectionModal.classList.toggle('active');
        galleryContentModal.classList.toggle('disable');
        formContentModal.classList.toggle('active');

    });
    // au click en dehors de la modale, fermer la fenetre sectionModal
    window.addEventListener('click', (event)=> {
        if (event.target == sectionModal) {
            sectionModal.classList.toggle('active');
            galleryContentModal.classList.toggle('disable');
            formContentModal.classList.toggle('active');
    
        }
    });

    
}

// fonction changement de classList de la modal à intégrer au listener 'modifier'
function toggleModal() {
    const sectionModal = document.querySelector('.modal');
    sectionModal.classList.toggle('active');
}


// générer les travaux de la modale
async function getWorksModal() {
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
            modalIconDeleteWork.className = 'iconDelete fa-solid fa-trash-can';
            const editWorkElement = document.createElement('p');
            editWorkElement.innerText = 'éditer';
            // rattachement des balises aux DOM
            modalWorksGallery.appendChild(modalWorkElement);
            modalWorkElement.appendChild(modalWorkImage);
            modalWorkElement.appendChild(editWorkElement);
            modalWorkElement.appendChild(modalIconDeleteWork);
            
            modalIconDeleteWork.addEventListener('click', async (e)=>{
                e.preventDefault();
                id = e.target.dataset.id;
                const idWork = {id: `${id.value}`};
                const reponse = await fetch(urlWorks + `/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${tokenBearer}`
                    },
                    body: JSON.stringify(idWork)
                })
                const data = await reponse.json();
                window.location.reload();
                return data;
                
            }, false)
        }
    } catch (error) {
        console.log('Message erreur: ' + (error.message) )
    }
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
    submitFormAddWorks.className = 'submit'
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
        e.preventDefault;
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
        if (inputTitle.value === '') {
            alert("Veuillez renseigner le champs")
        }
        console.log(inputTitle.value);
    });

    selectCategory.addEventListener('change', () => {
        let optionSelected = document.getElementById('category').selectedIndex;
        console.log(optionSelected);
    });
    
    submitFormAddWorks.addEventListener('change', () => {
        if (/*inputPhoto.files[0] != '' &&*/ inputTitle.value != '' && selectCategory.value != '') {
            submitFormAddWorks.classList.add('validate');
        }    
    })

    formAddWorks.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("début de la gestion du formulaire")
        if (inputPhoto.files[0] === '' || inputTitle.value === '' || selectCategory.value === '') {
            alert ("Merci de remplir tous les champs du formulaire");
        } else {
            postDatas();
            
        }
    });
};

function validateForm () {

    const inputPhoto = document.querySelector('#formAddWorks input[type=file]').ariaRequired;
    const inputTitle = document.querySelector('#formAddWorks input[type=text]').required;
    const selectCategory = document.querySelector('#formAddWorks select').ariaRequired;
    const submitFormAddWorks = document.querySelector('#formAddWorks input[type=submit]');

    if (inputPhoto.files[0] != '' && inputTitle.value != '' && selectCategory.selectedIndex != '') {
        submitFormAddWorks.classList.add('validate');
    } else {
        alert ("Merci de remplir tous les champs du formulaire");
        return false;
    }
}
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

var stateNames = {};
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
    }, 
    false);
    console.log('Avant lecture: ' + stateNames[reader.readyState]);
    if (inputImageFile) {
        reader.readAsDataURL(inputImageFile);
        console.log('Après lecture: ' + stateNames[reader.readyState]);
        loadImageFile.style.display = 'block';
        uploadImage.style.display = 'none';
        spanImage.style.display = 'none';
        console.log(inputImageFile)
    }
    
};


// fonction (insérée dans la fn addWorks) pour envoyer le projet à l'API
async function postDatas() {
    //e.preventDefault;
    const inputImageFile = document.querySelector('#formAddWorks input[type=file]').files[0];
    const inputTitleValue = document.querySelector('#formAddWorks input[type=text]').value;
    const selectCategoryValue = document.querySelector('#formAddWorks select').selectedIndex;
    console.log(inputImageFile.result)
    const formData = new FormData();
        formData.append('image', inputImageFile);
        formData.append('title', inputTitleValue);
        formData.append('category', selectCategoryValue)
    
    try {
        const reponse = await fetch(urlWorks, {
            method: 'POST',
            headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${tokenBearer}`
            },
            body: formData
        });
        
        const data = await reponse.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


