'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface FavoriteItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Update localStorage and calculate total when favorites change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setTotalFavorites(favorites.length);
    }
  }, [favorites, isInitialized]);

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites(prevItems => {
      // Check if item already exists in favorites
      const existingItem = prevItems.find(favItem => favItem._id === item._id);
      
      if (existingItem) {
        toast.error('Item already in favorites');
        return prevItems;
      } else {
        // Add new item to favorites
        toast.success('Added to favorites');
        return [...prevItems, item];
      }
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== id);
      toast.success('Removed from favorites');
      return updatedItems;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item._id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.success('Favorites cleared');
  };

  // Don't render children until initialization is complete
  if (!isInitialized) {
    return null;
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites,
      totalFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 