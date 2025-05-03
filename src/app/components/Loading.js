const Loading = () => {
  return (
    <div className="animate-pulse overflow-x-hidden ">
      <div className=" mb-8">
        <div className="h-185 bg-gray-800 rounded-xl w-full"></div>
      </div>

      <div className="md:p-4 md:pt-0 mb-8">
        <div className="h-12 bg-gray-800 w-64 mb-4 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Latest Completed Loading */}
      <div className="md:p-4 md:pt-0 mb-8">
        <div className="h-12 bg-gray-800 w-64 mb-4 rounded"></div>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-64 w-48 bg-gray-800 rounded-lg flex-shrink-0"
            ></div>
          ))}
        </div>
      </div>

      {/* Anime Sections Loading */}
      <div className="md:pb-4 md:pt-0 pb-2 pt-4">
        <div className="h-8 bg-gray-800 w-48 ml-10 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
        ))}
      </div>

      {/* Trailers Loading */}
      <div className="md:pb-4 pb-2 pt-3">
        <div className="h-8 bg-gray-800 w-64 ml-10 rounded"></div>
      </div>
      <div className="flex overflow-x-auto gap-4 p-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-64 w-96 bg-gray-800 rounded-lg flex-shrink-0"
          ></div>
        ))}
      </div>

      {/* Recommendation Loading */}
      <div className="p-4">
        <div className="h-8 bg-gray-800 w-64 mb-4 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Manga Loading */}
      <div className="md:pb-4 md:pt-0 pb-2 pt-4">
        <div className="h-8 bg-gray-800 w-48 ml-10 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
        ))}
      </div>

      {/* Character Loading */}
      <div className="p-4">
        <div className="h-8 bg-gray-800 w-48 mb-4 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
