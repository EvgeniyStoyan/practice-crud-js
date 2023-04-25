import './css/styles.css';

import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from "./js/api-service"
import { renderImages, galleryList } from "./js/render-images";


const form = document.querySelector(".search-form")
const loadMoreBtn = document.querySelector(".load-more")

form.addEventListener("submit", submitForm)
loadMoreBtn.addEventListener('click', onLoadMore);

const imagesApiService = new ImagesApiService();

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: "alt",
  captionDelay: 250,
  animationSpeed: 350,
});

async function submitForm(e) {
  e.preventDefault()

  clearImagesGallery()
  const searchQuery = imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim()
  if (!searchQuery) {
    enterWithoutRequest();
    return;
  }

  imagesApiService.resetPage()

  try {
    const response = await imagesApiService.fetchImages(searchQuery)
    const totalHits = response.totalHits
    getImages(response.hits)

    Notify.info(`Hooray! We found ${totalHits} images.`,
      {
        timeout: 4000,
        width: '400px',
        fontSize: "18px",
        position: 'right-top',
      },);

    lightbox.refresh();
    form.reset()
  } catch (error) {
    errorMessage
  }
}


function getImages(images) {

  if (images.length === 0) {
    errorMessage();
    return;
  }

  renderImages(images)
  loadMoreBtn.classList.remove('is-hidden');
}

async function onLoadMore(searchQuery) {

  try {
    const response = await imagesApiService.fetchImages(searchQuery)
    const totalImages = imagesApiService.page * imagesApiService.per_page

    if (totalImages >= response.totalHits) {

      loadMoreBtn.classList.add('is-hidden')
      Notify.failure("We're sorry, but you've reached the end of search results!",
        {
          timeout: 4000,
          width: '400px',
          fontSize: "18px",
          position: 'right-top',
        },);
      return
    }

    getImages(response.hits)

    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

    lightbox.refresh();
  } catch (error) {
    errorMessage
  }
}

function clearImagesGallery() {
  galleryList.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
}

function enterWithoutRequest() {
  Notify.warning("Please enter a value to search for!",
    {
      timeout: 4000,
      width: '400px',
      fontSize: "18px",
      position: 'right-top',
    },);
}

function errorMessage() {
  Notify.failure("Sorry, there are no images matching your search query. Please try again!",
    {
      timeout: 4000,
      width: '400px',
      fontSize: "18px",
      position: 'right-top',
    },);
}