import { create } from "zustand";
import { Image } from "../models/image";
import { Category } from "../models/category";
import { TheCatAPI } from "@thatapicompany/thecatapi";
import { getCategoryFromString } from "../helpers/categories";

const theCatAPI = new TheCatAPI(process.env.NEXT_PUBLIC_CAT_API_KEY || "", {
  host: "https://api.thecatapi.com/v1",
});

interface CatStore {
  cats: Image[];
  selectedCategory: Category;
  categories: Category[];
  page: number;
  loadCats: (category: Category) => Promise<void>;
  selectCategory: (cat: Category) => void;
  fetchCategories: () => Promise<void>;
}

const useCatStore = create<CatStore>((set, get) => ({
  cats: [],
  selectedCategory: { id: 5, name: 'boxes' },
  categories: [],
  page: 1,

  loadCats: async (category: Category) => {
    try {
      console.log(`category dentro: ${JSON.stringify(category)}`)
      console.log(`cateGORUY: ${getCategoryFromString(category.name)}`)
      const newCats: Image[] = await theCatAPI.images.searchImages({
        limit: 10,
        page: get().page,
        categories: [getCategoryFromString(category.name)!],
      });
      console.log(`2`)
      set((state) => ({
        cats: [...state.cats, ...newCats],
        page: state.page + 1,
      }));
      console.log(`3`)
    } catch (error) {
      console.error("Failed to load cats:", error);
    }
  },

  selectCategory: (category: Category) => set({ selectedCategory: category }),

  fetchCategories: async () => {
    if (get().categories.length > 0) return;

    try {
      const categories: Category[] = await fetch(
        "https://api.thecatapi.com/v1/categories"
      ).then((res) => res.json());
      set({ categories });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },
}));

export default useCatStore;
