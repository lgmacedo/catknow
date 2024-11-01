import { useEffect } from "react";
import useCatStore from "@/stores/catStore";

export default function CatListPage() {
  const { cats, loadCats, category, categories, fetchCategories } =
    useCatStore();

  useEffect(() => {
    loadCats();
  }, [loadCats]);

  const handleScroll = () => {
    const bottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (bottom) {
      loadCats();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex flex-col items-start p-4 max-w-screen-lg mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-black w-full text-center">
        CATKNOW
      </h1>

      <div className="flex flex-wrap mb-4">
        {categories.map((cat) => (
          <span
            key={cat.id}
            className={`cursor-pointer rounded-full border-2 mr-2 mb-2 flex items-center justify-center h-[31px] px-4 border-black 
              ${
                cat === category
                  ? "bg-black text-white"
                  : "bg-transparent text-black"
              } 
            `}
            onClick={() => {
              if (!category || cat.id !== category.id) {
                loadCats(cat);
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
          <div
            key={cat.id}
            onClick={() => console.log(`Selected cat ID: ${cat.id}`)}
            className="border border-black rounded-lg cursor-pointer w-[209px] h-[240px] overflow-hidden"
          >
            <img
              src={cat.url}
              alt="Cat"
              className="w-full h-[209px] object-cover"
            />
            <p className="flex items-center justify-center h-[31px] text-center text-black font-inter font-bold text-[12px]">
              {cat.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
