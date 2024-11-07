import { useEffect } from "react"
import useCatStore from "@/stores/catStore"
import { Category } from "../models/category"
import { Cat } from "../models/cat"
import { getRandomNumber } from "../helpers/utils"
import Link from "next/link"
import { listCategories, listCats } from "../services/catListService"
import Image from "next/image"

export async function getServerSideProps() {
  try {
    const [cats, categories] = await Promise.all([
      listCats("/images/search?limit=20&has_breeds=1"),
      listCategories(),
    ])

    return {
      props: {
        initialCats: cats,
        initialCategories: categories,
      },
    }
  } catch (error) {
    console.error("Failed to load data:", error)
    return {
      props: {
        initialCats: [],
        initialCategories: [],
      },
    }
  }
}

interface MainPageProps {
  initialCategories: Category[]
  initialCats: Cat[]
}

export default function CatListPage({
  initialCats,
  initialCategories,
}: MainPageProps) {
  const { cats, category, categories, getCats, setCats, setCategories } =
    useCatStore()

  useEffect(() => {
    setCats(initialCats)
    setCategories(initialCategories)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleScroll = async () => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    if (nearBottom) {
      getCats()
    }
  }

  return (
    <div className="flex flex-col items-start p-4 max-w-screen-lg mx-auto min-h-screen">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black w-full text-center">
        CATKNOW
      </h1>

      <div className="flex flex-wrap mb-4">
        {categories.map((cat) => (
          <span
            key={cat.id}
            className={`cursor-pointer rounded-full border-2 mr-2 mb-2 flex items-center justify-center h-[24px] px-3 border-black 
        ${
          cat.id === category?.id
            ? "bg-black text-white"
            : "bg-transparent text-black"
        } 
      `}
            onClick={() => {
              if (!category || cat.id !== category.id) {
                getCats(cat)
              }
            }}
          >
            <span className="text-xs md:text-sm font-normal">
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </span>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {cats.map((cat) => (
          <Link href={`/cat/${cat.id}`} key={getRandomNumber().toString()}>
            <div className="border border-black rounded-lg cursor-pointer w-full h-[240px] flex flex-col overflow-hidden">
              <div className="relative w-full h-[208px]">
                <Image
                  src={cat.url}
                  alt="Cat"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <p className="flex items-center justify-center h-[32px] text-center text-black font-inter font-bold text-[12px]">
                {cat.breeds && cat.breeds.length > 0
                  ? cat.breeds[0].name
                  : cat.id}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
