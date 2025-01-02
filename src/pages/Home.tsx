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

const books = [
    {
      title: "The Quantum Garden",
      pages: 342,
      description: "A physicist discovers parallel universes in her backyard garden, leading to an adventure across multiple dimensions."
    },
    {
      title: "Midnight in the Kitchen",
      pages: 256,
      description: "A chef's memoir of running an underground restaurant in Paris, featuring recipes that blur the line between science and magic."
    },
    {
      title: "The Last Algorithm",
      pages: 423,
      description: "In 2045, an AI researcher finds a mysterious code that seems to predict the future - but at what cost?"
    },
    {
      title: "Echoes of Yesterday",
      pages: 298,
      description: "A collection of interconnected short stories about memories, featuring characters who can trade their recollections like currency."
    },
    {
      title: "The Lighthouse Keeper's Daughter",
      pages: 312,
      description: "Historical fiction following three generations of women who maintain a mysterious lighthouse off the coast of Nova Scotia."
    },
    {
      title: "Silicon Dreams",
      pages: 189,
      description: "A startup founder's journey through the tech bubble of the 90s, with lessons that resonate in today's AI boom."
    },
    {
      title: "The Art of Forgetting",
      pages: 276,
      description: "A neuroscientist's guide to memory, focusing on why forgetting might be more important than remembering."
    },
    {
      title: "Wolves of the Digital Age",
      pages: 398,
      description: "A cybersecurity thriller about a team of white-hat hackers racing to prevent a global financial meltdown."
    },
    {
      title: "The Spice Merchant's Equation",
      pages: 289,
      description: "A mathematical mystery set in 17th century India, combining historical fiction with complex number theory."
    },
    {
      title: "Tomorrow's Canvas",
      pages: 245,
      description: "An artist discovers her paintings predict future events, forcing her to choose between prevention and preservation."
    }
  ];

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
