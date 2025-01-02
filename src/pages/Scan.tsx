const BookCard = ({ title, pages, description }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white max-w-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="text-gray-500 text-sm italic">{pages} pages</span>
      </div>
      <p className="text-gray-700 line-clamp-2">{description}</p>
    </div>
  );
};

const books = [];

// Example usage component
const HomePage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {books.map((book, index) => (
        <BookCard key={index} {...book} />
      ))}
    </div>
  );
};

export default HomePage;
