export default function HomeLoading() {
  return (
    <div className="relative flex h-dvh flex-col bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-blue-600 to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full px-6 pt-20 pb-24">
        <div className="text-center mb-2">
          <div className="h-4 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-7 w-56 bg-gray-200 rounded-full mx-auto mt-2 animate-pulse" />
          <div className="h-3 w-64 bg-gray-100 rounded-full mx-auto mt-3 animate-pulse" />
        </div>

        <div className="my-2 w-full max-w-[220px] aspect-square flex items-center justify-center">
          <div className="w-full h-full bg-gray-100 rounded-3xl animate-pulse" />
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3 mt-2">
          <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
