import theCatAPI from "@/config/catApi"
import { Cat } from "@/models/cat"

export const showCat = async (id: string): Promise<Cat[]> => {
  const response = await theCatAPI.get<Cat[]>(`images/${id}`)
  return response.data
}
