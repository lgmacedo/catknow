import { useEffect, useRef } from "react";
import useCatStore from "@/stores/catStore";
import theCatAPI from "../config/catApi";
import { Category } from "../models/category";
import { Cat } from "../models/cat";
import { getRandomNumber } from "../helpers/utils";
import Link from "next/link";

export default function CatListPage() {
  const { cats, category, categories, setCats, setCategory, setCategories } =
    useCatStore();

  const categoryRef = useRef(category);
  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const baseUrl = "/images/search?limit=20";

        const categoryId = category?.current ? category.current?.id : null;

        const response = await theCatAPI.get<Cat[]>(
          `${baseUrl}${
            categoryId ? `&category_ids=${categoryId}` : "&has_breeds=1"
          }`
        );
        const newCats = response.data;

        if (category?.current?.id !== category?.previous?.id) {
          setCats(newCats);
        } else {
          setCats([...cats, ...newCats]);
        }
      } catch (error) {
        console.error("Failed to load cats:", error);
      }
    };

    fetchCats();
  }, [category]);

  useEffect(() => {
    const fetchCategories = async () => {
      const url = "/categories";

      try {
        const response = await theCatAPI.get<Category[]>(url);
        const categories = response.data;

        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = async () => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
    if (nearBottom) {
      setCategory(categoryRef.current!.current!);
    }
  };

  return (
    <div className="flex flex-col items-start p-4 max-w-screen-lg mx-auto min-h-screen">
      <h1 className="text-6xl font-bold mb-6 text-black w-full text-center">
        CATKNOW
      </h1>

      <div className="flex flex-wrap mb-4">
        {categories.map((cat) => (
          <span
            key={cat.id}
            className={`cursor-pointer rounded-full border-2 mr-2 mb-2 flex items-center justify-center h-[31px] px-4 border-black 
              ${
                cat === category?.current
                  ? "bg-black text-white"
                  : "bg-transparent text-black"
              } 
            `}
            onClick={() => {
              if (!category || cat.id !== category.current?.id) {
                setCategory(cat);
              }
            }}
          >
            <span className="text-sm font-normal">
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </span>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {cats.map((cat) => (
          <Link href={`/cat/${cat.id}`} key={getRandomNumber().toString()}>
            <div className="border border-black rounded-lg cursor-pointer w-[209px] h-[240px] overflow-hidden">
              <img
                src={cat.url}
                alt="Cat"
                className="w-full h-[209px] object-cover"
              />
              <p className="flex items-center justify-center h-[31px] text-center text-black font-inter font-bold text-[12px]">
                {cat.breeds && cat.breeds.length > 0
                  ? cat.breeds[0].name
                  : cat.id}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
