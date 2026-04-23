import { mockListings } from '../data/mockData';

const LISTINGS_KEY = 'kisanbazaar_listings';
const SAVED_KEY = 'kisanbazaar_saved';

export const storageService = {
  getListings: () => {
    const data = localStorage.getItem(LISTINGS_KEY);
    if (!data) {
      localStorage.setItem(LISTINGS_KEY, JSON.stringify(mockListings));
      return mockListings;
    }
    return JSON.parse(data);
  },
  
  saveListings: (listings) => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  },

  getSaved: () => {
    const data = localStorage.getItem(SAVED_KEY);
    return data ? JSON.parse(data) : [];
  },

  setSaved: (saved) => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }
};
