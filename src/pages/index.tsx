import { useEffect } from "react";
import useCatStore from "@/stores/catStore";

export default function CatListPage() {
  const { cats, loadCats, selectCategory, selectedCategory, fetchCategories, categories } = useCatStore();

  console.log(`cats: ${JSON.stringify(cats)}`)

  // Carregar gatos ao montar o componente
  useEffect(() => {
    loadCats(selectedCategory); // Carrega os gatos na inicialização
  }, [loadCats]);

  // Chama a função para carregar mais gatos ao rolar até o final
  const handleScroll = () => {
    // Lógica para detectar o scroll infinito e chamar `loadCats`
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (bottom) {
      loadCats(selectedCategory); // Carrega mais gatos quando estiver perto do final da página
    }
  };

  useEffect(() => {
    // Adiciona o listener para rolagem
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); // Remove o listener ao desmontar
    };
  }, []);

  // Fetch das categorias (pode ser chamado apenas uma vez, dependendo da lógica)
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">CATKNOW</h1>
      
      <div className="flex flex-wrap mb-4">
        {categories.map((category) => (
          <span
            key={category.id}
            className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer"
            onClick={() => {
              // Aqui você pode implementar a lógica de filtrar gatos pela categoria, se desejar
              console.log(`Selected category: ${category}`);
            }}
          >
            {category.name}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cats.map((cat) => (
          <div
            key={cat.id}
            onClick={() => console.log(`àqui`)}
            className="border rounded-lg overflow-hidden cursor-pointer shadow-lg"
          >
            <img src={cat.url} alt="Cat" className="w-full h-32 object-cover" />
            <p className="p-2 text-center">{JSON.stringify(cat) || "Unknown Cat"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
