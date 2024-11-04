import { useCallback, useEffect, useRef } from "react"
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
      listCats("/images/search?limit=16&has_breeds=1"),
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

interface CatListPageProps {
  initialCats: Cat[]
  initialCategories: Category[]
}

export default function CatListPage({
  initialCats,
  initialCategories,
}: CatListPageProps) {
  const { cats, category, categories, setCats, setCategory, setCategories } =
    useCatStore()

  const isFirstRender = useRef(true)
  const categoryRef = useRef(category)

  useEffect(() => {
    setCats(initialCats)
    setCategories(initialCategories)
  }, [initialCats, initialCategories])

  useEffect(() => {
    categoryRef.current = category
  }, [category])

  const fetchCats = useCallback(async () => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    try {
      const baseUrl = "/images/search?limit=20"

      const categoryId = category?.current ? category.current?.id : null

      const newCats = await listCats(
        `${baseUrl}${
          categoryId ? `&category_ids=${categoryId}` : "&has_breeds=1"
        }`,
      )

      if (category?.current?.id !== category?.previous?.id) {
        setCats(newCats)
      } else {
        setCats([...cats, ...newCats])
      }
    } catch (error) {
      console.error("Failed to load cats:", error)
    }
  }, [category])

  useEffect(() => {
    fetchCats()
  }, [category])

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
      setCategory(categoryRef.current!.current!)
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
          cat === category?.current
            ? "bg-black text-white"
            : "bg-transparent text-black"
        } 
      `}
            onClick={() => {
              if (!category || cat.id !== category.current?.id) {
                setCategory(cat)
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
