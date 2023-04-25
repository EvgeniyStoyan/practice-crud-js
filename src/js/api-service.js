import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '22499741-87b5d21a315c32b3b505be895';

export default class ImageApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40
    }

    async fetchImages() {

        const searchParams = new URLSearchParams({
            key: API_KEY,
            q: this.searchQuery,
            page: this.page,
            per_page: this.per_page,
            image_type: "photo",
            orientation: "horizontal",
        })

        const url = `${BASE_URL}?${searchParams}`;

        try {
            const response = await axios.get(url)
            this.incrementPage()

            return response.data
        } catch (error) {
            Notify.failure("A request error occurred!",
                {
                    timeout: 4000,
                    width: '400px',
                    fontSize: "18px",
                    position: 'right-top',
                },);
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}







