import { create } from "zustand"
import { Category } from "../models/category"
import { Cat } from "../models/cat"
import { listCategories, listCats } from "../services/catListService"

interface CatStore {
  cats: Cat[]
  category?: Category
  categories: Category[]

  getCats: (seelctedCategory?: Category) => Promise<void>
  getCategories: () => Promise<void>

  setCats: (cats: Cat[]) => void
  setCategories: (categories: Category[]) => void
  setCategory: (category: Category | undefined) => void
}

const useCatStore = create<CatStore>((set, get) => ({
  cats: [],
  category: undefined,
  categories: [],

  getCats: async (selectedCategory?: Category) => {
    try {
      const currentCategory = get().category

      const baseUrl = `/images/search?limit=20`

      const categoryId = selectedCategory
        ? selectedCategory.id
        : currentCategory?.id

      const newCats = await listCats(
        `${baseUrl}${categoryId ? `&category_ids=${categoryId}` : "&has_breeds=1"}`,
      )

      set((state) => ({
        cats:
          selectedCategory != null ? [...newCats] : [...state.cats, ...newCats],
        category: selectedCategory ?? state.category,
      }))
    } catch (error) {
      console.error("Failed to load cats:", error)
    }
  },

  getCategories: async () => {
    if (get().categories.length > 0) return

    try {
      const categories = await listCategories()

      set({ categories })
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  },

  setCats: (cats: Cat[]) => {
    set({ cats })
  },

  setCategories: (categories: Category[]) => {
    set({ categories })
  },

  setCategory: (category: Category | undefined) => {
    set({ category })
  },
}))

export default useCatStore
