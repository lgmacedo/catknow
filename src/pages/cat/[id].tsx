import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theCatAPI from "@/config/catApi";
import { Cat } from "../../models/cat";
import Link from "next/link";

export default function CatDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [cat, setCat] = useState<Cat | undefined>(undefined);

  useEffect(() => {
    const fetchCat = async () => {
      if (!id) return;

      const baseUrl = `/images/${id}`;

      try {
        const response = await theCatAPI.get<Cat>(baseUrl);
        const cat = response.data;
        setCat(cat);
      } catch (error) {
        console.error("Failed to fetch cat:", error);
      }
    };

    fetchCat();
  }, [id]);

  return (
    <div className="flex flex-col items-center p-6 max-w-screen-lg mx-auto min-h-screen">
      <Link href={"/"}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center font-inter">
          CATKNOW
        </h1>
      </Link>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
        <div className="w-[253px] sm:w-[431px] h-[227px] sm:h-[386px] flex flex-col items-center border border-black rounded-[16px]">
          <div className="rounded-t-[16px] overflow-hidden w-[253px] sm:w-[431px] h-[208px] sm:h-[431px] relative">
            <img
              src={cat?.url}
              alt="Cat"
              className="w-full h-full object-cover"
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
  );
}
