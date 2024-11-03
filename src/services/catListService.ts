import theCatAPI from "@/config/catApi"
import { Cat } from "@/models/cat"
import { Category } from "@/models/category"

export const listCats = async (url: string): Promise<Cat[]> => {
  const response = await theCatAPI.get<Cat[]>(url)
  return response.data
}

export const listCategories = async (): Promise<Category[]> => {
  const response = await theCatAPI.get<Category[]>("/categories")
  return response.data
}
