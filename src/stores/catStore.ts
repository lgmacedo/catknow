import { create } from "zustand";
import theCatAPI from "../config/catApi";
import { Category } from "../models/category";
import { Cat } from "../models/cat";

interface CatStore {
  cats: Cat[];
  category?: Category;
  categories: Category[];

  loadCats: (seelctedCategory?: Category) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

const useCatStore = create<CatStore>((set, get) => ({
  cats: [],
  category: undefined,
  categories: [],

  loadCats: async (selectedCategory?: Category) => {
    try {
      const currentCategory = get().category;

      const baseUrl = `/images/search?limit=20`;

      const categoryId = selectedCategory
        ? selectedCategory.id
        : currentCategory?.id;

      const response = await theCatAPI.get(
        `${baseUrl}${categoryId ? `&category_ids=${categoryId}` : ""}`
      );
      const newCats = response.data;

      set((state) => ({
        cats: selectedCategory != null ? [...newCats] : [...state.cats, ...newCats],
        category: selectedCategory ?? state.category,
      }));
    } catch (error) {
      console.error("Failed to load cats:", error);
    }
  },

  fetchCategories: async () => {
    if (get().categories.length > 0) return;

    const url = "/categories";

    try {
      const response = await theCatAPI.get<Category[]>(url);
      const categories = response.data;

      set({ categories });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },
}));

export default useCatStore;
