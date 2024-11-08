import { useRouter } from "next/router"
import { Cat } from "../../models/cat"
import { listCats } from "../../services/catListService"
import { showCat } from "../../services/catShowService"
import Image from "next/image"
import useCatStore from "../../stores/catStore"

export async function getStaticPaths() {
  const cats = await listCats("/images/search?limit=100&has_breeds=1")

  const paths = cats.map((cat) => ({
    params: { id: cat.id },
  }))

  return { paths, fallback: "blocking" }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params

  try {
    const cat = await showCat(id)

    return {
      props: {
        cat,
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Failed to fetch cat:", error)
    return {
      notFound: true,
    }
  }
}

interface CatDetailPageProps {
  cat: Cat
}

export default function CatDetailPage({ cat }: CatDetailPageProps) {
  const { setCategory } = useCatStore()

  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const handleNavigation = () => {
    setCategory(undefined)
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center p-6 max-w-screen-lg mx-auto min-h-screen">
      <h1
        onClick={handleNavigation}
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center font-inter cursor-pointer"
      >
        CATKNOW
      </h1>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
        <div className="w-[253px] sm:w-[431px] h-[227px] sm:h-[386px] flex flex-col items-center border border-black rounded-[16px]">
          <div className="rounded-t-[16px] overflow-hidden w-[253px] sm:w-[431px] h-[208px] sm:h-[431px] relative">
            <Image
              src={cat?.url}
              alt="Cat"
              className="w-full h-full object-cover"
              fill={true}
            />
          </div>
          <p className="w-full text-center bg-white text-black font-inter font-bold text-[12px] py-2 rounded-b-[16px]">
            {cat?.breeds && cat.breeds.length > 0
              ? cat.breeds[0].name
              : cat?.id || "Unknown"}
          </p>
        </div>
        <div className="flex flex-col text-left space-y-4 font-inter">
          <ul className="space-y-2 text-lg">
            <li>
              <strong className="font-medium">Name:</strong>{" "}
              {cat?.breeds && cat.breeds.length > 0
                ? cat.breeds[0].name
                : "N/A"}
            </li>
            <li>
              <strong className="font-medium">Description:</strong>{" "}
              {cat?.breeds && cat.breeds.length > 0
                ? cat.breeds[0].description
                : "N/A"}
            </li>
            <li>
              <strong className="font-medium">Life Span:</strong>{" "}
              {cat?.breeds && cat.breeds.length > 0
                ? `${cat.breeds[0].life_span} years`
                : "N/A"}
            </li>
            <li>
              <strong className="font-medium">Origin:</strong>{" "}
              {cat?.breeds && cat.breeds.length > 0
                ? cat.breeds[0].origin
                : "N/A"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
