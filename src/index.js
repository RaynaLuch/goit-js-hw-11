import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// axios.defaults.headers.common['x-api-key'] =
//     '40907495-9c14517ba43a466c2834937fa';

const API_KEY = '40907495-9c14517ba43a466c2834937fa';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('form.search-form');
const myList = document.querySelector('div.gallery');
const buttonLoadMore = document.querySelector('button.load-more');
buttonLoadMore.setAttribute('hidden', true);

function loadPics(page = 1) {
  const searchQuery = searchForm.elements.searchQuery.value;
  axios(BASE_URL, {
    params: {
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  }).then(response => {
    console.log(response);

    const markup = response.data.hits
      .map(
        hit =>
          // `<li class="gallery__item"><a class="gallery__link" href=${hit.largeImageURL} ><img class="gallery__image" src = ${hit.previewURL} alt = ${hit.tags} /> </a></li>`
          `<div class="photo-card">
            <img src=${hit.previewURL} alt=${hit.tags} loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
              </p>
              <p class="info-item">
                <b>Views</b>
              </p>
              <p class="info-item">
                <b>Comments</b>
              </p>
              <p class="info-item">
                <b>Downloads</b>
              </p>
            </div>
          </div>`
      )
      .join('');
    myList.insertAdjacentHTML('beforeend', markup);
    buttonLoadMore.removeAttribute('hidden', true);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: '250',
    });

    return;
  });
}

searchForm.addEventListener('submit', event => {
  myList.innerHTML = '';
  event.preventDefault();
  pageNumber = 1;
  loadPics();
  buttonLoadMore.setAttribute('hidden', true);
});

let pageNumber;

buttonLoadMore.addEventListener('click', event => {
  event.preventDefault();
  pageNumber += 1;
  loadPics(pageNumber);
});
