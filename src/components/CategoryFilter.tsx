interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full transition-all transform ${
            selected === category
              ? 'bg-zhuhong text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-zhuhong/10 hover:scale-105'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
