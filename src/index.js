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
const buttonLoadMore = document.querySelector('div.load-wrapper');
buttonLoadMore.setAttribute('hidden', true);
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

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
            <a class="gallery__link" href=${hit.largeImageURL} ><img class="gallery__image" src=${hit.previewURL} alt=${hit.tags} loading="lazy" /></a>
            <div class="info">
              <p class="info-item">
                <b>Likes </b>${hit.likes}
              </p>
              <p class="info-item">
                <b>Views </b>${hit.views}
              </p>
              <p class="info-item">
                <b>Comments </b>${hit.comments}
              </p>
              <p class="info-item">
                <b>Downloads </b>${hit.downloads}
              </p>
            </div>
          </div>`
      )
      .join('');
    buttonLoadMore.removeAttribute('hidden', true);
    if (response.data.totalHits === 0) {
      buttonLoadMore.setAttribute('hidden', true);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      if (page === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
    }
    if ((response.data.totalHits <= page * 40) & (page !== 1)) {
      buttonLoadMore.setAttribute('hidden', true);
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    myList.insertAdjacentHTML('beforeend', markup);

    lightbox.refresh();

    if (page > 1) {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 1.5,
        behavior: 'smooth',
      });
    }
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
