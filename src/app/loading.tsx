export default function Loading() {
  return (
    <>
      <div className="w-full h-full p-8">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <h1 className="text-4xl font-bold mb-4 bg-gray-300 w-1/4 h-12 rounded"></h1>
            <div className="mb-8">
              <p className="text-xl mb-4 bg-gray-300 w-3/4 h-8 rounded"></p>
              <div className="bg-gray-300 w-1/4 h-12 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-md animate-pulse"
                >
                  <div className="mb-4">
                    <h2 className="bg-gray-300 w-3/4 h-8 rounded"></h2>
                  </div>
                  <div className="bg-gray-300 w-full h-64 rounded"></div>
                </div>
              ))}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mb-8 animate-pulse">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-primary-600 mb-4 bg-gray-300 w-1/4 h-12 rounded"></h1>
            </div>
            <div className="bg-gray-300 w-full h-96 rounded"></div>
          </div>
        </div>
      </div>
    </>
  );
}
