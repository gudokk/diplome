import { useState } from "react";

const SearchForm = () => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Поиск по:", query);
    // тут можно вызвать API или обновить фильтр
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6 max-w-7xl mx-auto">
      <div className="w-full ">
        <form className="mt-5 sm:flex sm:items-center" onSubmit={handleSubmit}>
          <input
            id="q"
            name="q"
            type="search"
            placeholder="Введите название курорта"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="inline w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-500 focus:border-blue-700 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-700 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Поиск
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
