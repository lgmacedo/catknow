import { create } from "zustand";
import { Category } from "../models/category";
import { Cat } from "../models/cat";

interface CatStore {
  cats: Cat[];
  category?: { previous: Category | undefined; current: Category | undefined };
  categories: Category[];

  setCats: (fetchedCats: Cat[]) => void;
  setCategory: (category: Category) => void;
  setCategories: (fetchedCategories: Category[]) => void;
}

const useCatStore = create<CatStore>((set, get) => ({
  cats: [],
  category: { previous: undefined, current: undefined },
  categories: [],

  setCats: (fetchedCats: Cat[]) => {
    set({ cats: fetchedCats });
  },

  setCategory: (selectedCategory: Category) => {
    set({
      category: {
        previous: get().category?.current,
        current: selectedCategory,
      },
    });
  },

  setCategories: (fetchedCategories: Category[]) => {
    set({ categories: fetchedCategories });
  },
}));

export default useCatStore;
