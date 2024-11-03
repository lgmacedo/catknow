import axios from "axios"

const theCatAPI = axios.create({
  baseURL: "https://api.thecatapi.com/v1",
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_CAT_API_KEY || "",
  },
})

export default theCatAPI
