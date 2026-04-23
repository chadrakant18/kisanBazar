import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storageService } from '../services/storageService';

const ListingContext = createContext();

export function ListingProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);

  useEffect(() => {
    setListings(storageService.getListings());
    setSavedListings(storageService.getSaved());
  }, []);

  const addListing = useCallback((listing) => {
    const newListing = {
      ...listing,
      id: Date.now().toString(),
      verified: true,
      status: 'active',
      views: 0,
      postedDate: new Date().toISOString().split('T')[0],
    };
    setListings(prev => {
      const updated = [newListing, ...prev];
      storageService.saveListings(updated);
      return updated;
    });
    return newListing;
  }, []);

  const toggleSaved = useCallback((listingId) => {
    setSavedListings(prev => {
      const updated = prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId];
      storageService.setSaved(updated);
      return updated;
    });
  }, []);

  const isSaved = useCallback((listingId) => {
    return savedListings.includes(listingId);
  }, [savedListings]);

  const getMyListings = useCallback((farmerName) => {
    return listings.filter(l => l.farmerName === farmerName);
  }, [listings]);

  const getSavedListingItems = useCallback(() => {
    return listings.filter(l => savedListings.includes(l.id));
  }, [listings, savedListings]);
  
  const incrementView = useCallback((listingId) => {
    setListings(prev => {
      const updated = prev.map(l => l.id === listingId ? { ...l, views: (l.views || 0) + 1 } : l);
      storageService.saveListings(updated);
      return updated;
    });
  }, []);

  const updateListing = useCallback((listingId, updatedData) => {
    setListings(prev => {
      const updated = prev.map(l => l.id === listingId ? { ...l, ...updatedData } : l);
      storageService.saveListings(updated);
      return updated;
    });
  }, []);

  const deleteListing = useCallback((listingId) => {
    setListings(prev => {
      const updated = prev.filter(l => l.id !== listingId);
      storageService.saveListings(updated);
      return updated;
    });
    setSavedListings(prev => {
      const updated = prev.filter(id => id !== listingId);
      storageService.setSaved(updated);
      return updated;
    });
  }, []);

  return (
    <ListingContext.Provider value={{
      listings,
      addListing,
      updateListing,
      deleteListing,
      toggleSaved,
      isSaved,
      getMyListings,
      getSavedListingItems,
      savedListings,
      incrementView
    }}>
      {children}
    </ListingContext.Provider>
  );
}

export const useListings = () => useContext(ListingContext);
