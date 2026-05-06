export default function Promocard() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-100 rounded-xl p-6 flex items-center justify-between gap-6 animate-pulse">

      {/* Badge */}
      <div className="absolute top-0 left-0 w-28 h-6 bg-orange-300 rounded-br-xl rounded-tl-xl"></div>

      {/* Texte */}
      <div className="flex flex-col gap-6 w-1/2">
        <div className="flex flex-col gap-3">
          <div className="h-4 bg-gray-300 rounded w-3/4">product name</div>
          <div className="h-4 bg-gray-300 rounded w-3/4">product name</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex h-6  rounded w-1/2 gap-1">
            <div className="bg-gray-300 w-2/3 h-6">new price</div>
            <div className="bg-gray-300 w-1/3 h-4">devise</div>
          </div>
          <div className="flex h-4  rounded w-1/3 gap-1">
            <div className="bg-gray-200 w-2/3 h-4">old price</div>
            <div className="bg-gray-200 w-1/3 h-4">devise</div>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="w-50 h-40 bg-gray-300 rounded">main_image</div>
    </div>
  );
}