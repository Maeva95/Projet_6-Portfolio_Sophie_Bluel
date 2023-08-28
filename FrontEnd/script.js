const urlWorks = 'http://localhost:5678/api/works';
const urlCategories = 'http://localhost:5678/api/categories';
const urlUsersLogin = 'http://localhost:5678/api/users/login';
const userId = window.localStorage.getItem('userId');
const userToken = window.localStorage.getItem('token');
const loggedIn = userId && userToken ? true : false;
const loggedOut = !loggedIn;
const tokenBearer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MzIxMDkzOCwiZXhwIjoxNjkzMjk3MzM4fQ.VJQFHdxi0yhs341MleS9v-Ygjs8AFm6_8_j-91n6CNc';

///// enregistrer le token dans le LS /////
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

///// Affichage de tous les projets dans la galerie /////

async function displayWorks(works) {
    
    document.querySelector('.gallery').innerHTML = '';
    for (const work of works) {
        const worksGallery = document.querySelector('.gallery');
        const workElement = document.createElement('figure');
        workElement.setAttribute ('id', `${work.id}`);
        const workImage = document.createElement('img');
        workImage.src = work.imageUrl;
        workImage.alt = work.title;
        const workDetail = document.createElement('figcaption')
        workDetail.innerText = work.title;
        // rattachement des balises aux DOM
        worksGallery.appendChild(workElement);
        workElement.appendChild(workImage);
        workElement.appendChild(workDetail);
    };
}
fetch(urlWorks)
.then((response) => response.json())
.then((works) => displayWorks(works))
.catch((error) => {console.log(`Une erreur dans la fn displayWorks est survenue : ${error.message}`)})

///// création des buttons de filtres des projets /////

function createFiltersButtons(datas) {
    const containerFilterWorks = document.querySelector('#portfolio .categories');
    const categoryButtonSelected = document.createElement('button');
    categoryButtonSelected.className = `filter-btn category-btn-selected`;
    categoryButtonSelected.textContent = 'Tous';
    categoryButtonSelected.setAttribute('id', '0');;
    containerFilterWorks.appendChild(categoryButtonSelected);
    for (const category of datas) {
        const categoryButton = document.createElement('button');
        categoryButton.className = `filter-btn`;
        categoryButton.textContent = category.name;
        categoryButton.setAttribute('id', `${category.id}`);
        containerFilterWorks.appendChild(categoryButton);
    };
    filtersWorks();
}

///// Ajout des eventListeners sur les boutons /////

async function filtersWorks(works) {
    const reponse = await fetch(urlWorks)
    works = await reponse.json()
    const filterContainer = document.querySelectorAll('.categories button');
    for (let i = 0; i < filterContainer.length; i++) {
        const filterButton = document.querySelector(`.categories button:nth-child(${i+1})`);
        // ajout d'un eventListener pour chacun des boutons
        filterButton.addEventListener('click', (e) => {
            
            //activer ou désactiver les boutons de filtre
            const filterButtonSelect = document.querySelector('.category-btn-selected');
            filterButtonSelect.classList.remove('category-btn-selected');
            filterButton.classList.add('category-btn-selected');
            
            // création des projets filtrés par catégorie
            const worksFiltered = works.filter((work) => {
                return work.categoryId === i || i === 0;
            });
            //afficher les projets filtrés
            return displayWorks(worksFiltered)
        });
    }     
}


///// Retrait des filtres du protfolio lorsque nous sommes déconnectés /////
const navLogin = document.querySelector('nav li:nth-child(3) a');

if (!loggedIn) {
    fetch(urlCategories)
    .then((response) => response.json())
    .then((datas) => createFiltersButtons(datas))
    .catch((error) => {console.log(`Une erreur createFilters est survenue : ${error.message}`)})
    
}

//navLogin.addEventListener('click', () => {
 //   if (loggedOut) {
//        window.location.href = "./login/login.html";
 //   }
//})

        ////////////////////////////////////////////
        //                                        //
        //         création Homepage Edit         //
        //                                        //
        ////////////////////////////////////////////

if (loggedIn){
    
    //modif texte lien nav 'login' en 'logout'
    navLogin.textContent = 'logout';

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

    // intégration de la modale
    createModal();
    // Event listener du bouton "Publier modifications" pour retour homepage
    const buttonPublicationChange = document.querySelector('.publicationChange');
    buttonPublicationChange.addEventListener('click', (event) => {
        if (loggedIn) {
            event.preventDefault();
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('token');
            window.location.href = './index.html';
        }
    });
    // Event listener pour logout
    navLogin.addEventListener('click', (event) => {
        event.preventDefault();
        window.localStorage.removeItem('userId');
        window.localStorage.removeItem('token');
        window.location.href = "./login/login.html";
    });
    // Event listener du bouton "modifier la section intro"
    buttonEditGalleryIntro.addEventListener ('click', () => {
        editIntro();
    });
    // Event listener du bouton "modifier portfolio"
    buttonEditGalleryPortfolio.addEventListener('click', () => {
        const sectionModal = document.querySelector('.modal');
        sectionModal.style.display = 'block';
        const galleryContentModal = document.querySelector('.section-gallery');
        galleryContentModal.style.display = 'flex';
    });
}


//// modification section Intro (en option) ////
/*function editIntro () {
    const imageIntroSource = document.querySelector('#introduction img').src;
    const titleIntroValue = document.querySelector('#introduction h2').value;
    const articleIntroValue = document.querySelectorAll('#introduction p').value
    const formData = new FormData();
        formData.append('image', imageIntroSource);
        formData.append('title', titleIntroValue);
        formData.append('title', articleIntroValue);

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
    .then(data => (data))
    .catch(error => console.console.error(error))
}
*/

///// Création de la fenêtre modale /////

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

    displayWorksModal();
    formAddWork();

    // ajout des event listeners sur la flèche "retour à la galerie modale", 
    returnModalWorks.addEventListener('click', ()=>{
        returnModalWorks.style.display = 'none';
        formContentModal.style.display = 'none';
        galleryContentModal.style.display = 'flex';
    });
    // sur l'icone 'x', fermer la fenetre sectionModal
    iconCloseModal.addEventListener('click', closeModal);
    // sur le lien "Supprimer la galerie",
    deleteAllWorks (buttonCancelGallery)
    // et sur les boutons "Ajouter un projet", 
    buttonAddWork.addEventListener('click', ()=> {
        returnModalWorks.style.display = 'block';
        formContentModal.style.display = 'flex';
        galleryContentModal.style.display = 'none';
    });
    // fermer la fenetre sectionModal hors de la fenêtre
    window.addEventListener('click', (event)=> {
        event.stopPropagation();
        if (event.target == sectionModal) {
            closeModal();
        }
    });
    window.addEventListener('keydown', (event) => {
        event.stopPropagation();
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

///// générer les travaux de la modale /////
async function displayWorksModal () {
    try {
        const data = await fetchDatas();
        document.querySelector('.modal-gallery').innerHTML = '';

        for (work of data) {
            const modalWorksGallery = document.querySelector('.modal-gallery');
            const modalWorkElement = document.createElement('figure');
            modalWorkElement.setAttribute ('id', `${work.id}`);
            const modalWorkImage = document.createElement('img');
            modalWorkImage.src = work.imageUrl;
            modalWorkImage.dataset.id = work.id;
            const modalIconDeleteWork = document.createElement('i');
            modalIconDeleteWork.setAttribute('id', `${work.id}`);;
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

            modalWorkElement.addEventListener('mouseover', function () {
                modalIconMoveWork.style.visibility = 'visible';
            }, false);

            modalWorkElement.addEventListener('mouseleave', function () {
                modalIconMoveWork.style.visibility = 'hidden';
            }, false);

            deleteWorkModal(modalIconDeleteWork)

        }
    } catch (error) {
        console.table('Message erreur des travaux de la modale: ' + (error.message) )
    }
}

///// fonctions de suppression de projets dans la modale et le portfolio /////
    
function deleteWorkModal(modalIconDeleteWork) {
    modalIconDeleteWork.addEventListener('click', async (e)=> {
        e.preventDefault();
        const idWork = modalIconDeleteWork.parentElement.id;
        try {
            const requestOptionsDelete = {
                method: "DELETE",
                headers: {
                    "accept": "*/*",
                    "Authorization": `Bearer ${tokenBearer}`
                },
            };
            await fetch(urlWorks + `/${idWork}`, requestOptionsDelete);
            const modalWorkContainer = modalIconDeleteWork.parentElement;
            modalWorkContainer.remove();
            const workContainer = document.getElementById(idWork);
            if (workContainer) {
                workContainer.remove()
            }
        } catch (error) {
            console.log('Un problème avec la fn "deleteWorkModal" est survenue')
        }
    }, false);
}

function deleteAllWorks (buttonCancelGallery) {
    buttonCancelGallery.addEventListener('click', async (e)=> {
        e.preventDefault();
        const figurWorkElements = document.querySelectorAll('#portfolio .gallery figure');
        figurWorkElements.forEach(workElement => {
            work.id = workElement.id
            const requestOptionsDelete = {
                method: "DELETE",
                headers: {
                    "accept": "*/*",
                    "Authorization": `Bearer ${tokenBearer}`
                },
            };
            fetch(urlWorks + `/${work.id}`, requestOptionsDelete)
            .then ((data) => console.log(data))
        });
        try {
            
            const workElements = document.querySelector('#portfolio .gallery');
            while (workElements.firstChild) {
                workElements.removeChild(workElements.firstChild)
            }
            const modalWorksGallery = document.querySelector('.modal-gallery');
            while (modalWorksGallery.firstChild) {
                modalWorksGallery.removeChild(modalWorksGallery.firstChild)
            }
            
        } catch (error) {
            
        }
    }, false);
}


/////// fonction ajout projet à la modale /////

function formAddWork () {
    const formContentModal = document.querySelector('.section-form');
    const formAddWorks = document.createElement('form');
    formAddWorks.setAttribute('id', 'form-add-works');
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
    inputTitle.required = true;
    const labelCategory = document.createElement('label');
    labelCategory.setAttribute('for', 'category');
    labelCategory.textContent = 'Catégorie';
    const selectCategory = document.createElement('select');
    selectCategory.setAttribute('id', 'category');
    selectCategory.setAttribute('name', 'category');
    selectCategory.required = true;
    const optionCategoryNull = document.createElement('option');
    optionCategoryNull.textContent = '';
    const lineForm = document.createElement('div');
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
        //e.preventDefault();
        if (inputTitle !== "") {
            inputTitle.classList.add('valid');
        }
    });

    selectCategory.addEventListener('change', () => {
        const optionSelected = document.getElementById('category').selectedIndex;
        console.log(optionSelected);
        if (optionSelected !== "0") {
            selectCategory.classList.add('valid');
        }
        if (inputTitle.value !== "" && optionSelected !== "0") {
            submitFormAddWorks.classList.add('valid');
        }
    });
    
    
    formAddWorks.addEventListener('submit', (e) => {
        e.preventDefault();
        postWorks();

    }), false;
};


/////// création des options de l'input select /////
async function createOption() {
    const reponse = await fetch(urlCategories);
    const category = await reponse.json();
    const selectCategory = document.querySelector('select');

    for (let i = 0; i < category.length; i++) {
        const option = category[i];
        const optionCategory = document.createElement('option');
        optionCategory.setAttribute('id', `${option.id}`);
        optionCategory.setAttribute('value', `${option.id}`);
        optionCategory.textContent = option.name;
        selectCategory.appendChild(optionCategory);
    }
}

///// fonction pour prévisualiser l'image chargée dans formAddWorks /////


function previewFileLoaded () {
    const loadImageFile = document.querySelector('#form-add-works img');
    const inputImageFile = document.querySelector('#form-add-works input[type=file]').files[0];
    const uploadImage = document.querySelector('.upload');
    const spanImage = document.querySelector('#form-add-works span');
    const reader  = new FileReader();
    reader.addEventListener('load', () => {
        loadImageFile.src = reader.result;
    }, false);

    if (inputImageFile) {
        reader.readAsDataURL(inputImageFile);
        loadImageFile.style.display = 'block';
        uploadImage.style.display = 'none';
        spanImage.style.display = 'none';
        //console.log(inputImageFile);
    }
};

/////// fonction pour envoyer le projet à l'API /////

function postWorks () {
    const inputImageFile = document.querySelector('#form-add-works input[type=file]').files[0];
    const inputTitleValue = document.querySelector('#form-add-works input[type=text]').value;
    const optionSelected = document.querySelector('#form-add-works select').selectedIndex;

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
    .then(reponse =>  {
        if (!reponse.ok) {
            alert("Votre projet n'a pas été initié car les valeurs du formulaire sont incomplètes ou incorrectes");
        } else {
            return reponse.json();
        }
    })
    //.then(data => console.log(data))
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
            workElement.setAttribute('id', `${work.id}`);
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

const returnGalleryModal = () => {
    const returnModalWorks = document.querySelector('.return');
    returnModalWorks.style.display = 'none';
    const formContentModal = document.querySelector('.section-form');
    formContentModal.style.display = 'none';
    const galleryContentModal = document.querySelector('.section-gallery')
    galleryContentModal.style.display = 'flex';
    document.querySelector('.preview-file').style.display = 'none';
    document.querySelector('.upload').style.display = 'block';
    document.querySelector('.label-photo span').style.display = 'block';
    document.getElementById('title').value = '';
    document.getElementById('title').classList.remove('valid');
    document.getElementById('category').selectedIndex = '0';
    document.querySelector('.submit').classList.remove('valid');
}



/////// fonction fetch pour récupérer les travaux de la modale /////
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

