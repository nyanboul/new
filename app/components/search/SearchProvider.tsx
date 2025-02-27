'use client';

import { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SearchContextType {
  searchResults: any[];
  searchQuery: string;
  loading: boolean;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

const SearchContext = createContext<SearchContextType>({
  searchResults: [],
  searchQuery: '',
  loading: false,
  search: async () => {},
  clear: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    setLoading(true);
    setSearchQuery(query);

    try {
      // タイトルとタグの両方で検索するようにクエリを変更
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          seller:profiles(id, username, rating),
          images:item_images(id, url, is_primary)
        `)
        .or(`title.ilike.%${query}%, tags.cs.{${query}}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider value={{ searchResults, searchQuery, loading, search, clear }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext); 