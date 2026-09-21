export default function MulaiBelajarLoading() {
  return (
    <div className="relative flex h-dvh flex-col bg-white overflow-hidden">
      <div className="relative z-50 bg-gradient-to-r from-blue-600 to-blue-400 shadow-md shrink-0">
        <div className="mx-auto flex h-14 max-w-lg items-center px-4">
          <div className="h-9 w-9 rounded-full bg-white/20 animate-pulse" />
          <div className="ml-3 h-4 w-40 bg-white/30 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="flex-1 flex flex-col mx-auto w-full max-w-lg px-5 pt-4 pb-20">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="h-1.5 w-full bg-gray-100" />
              <div className="flex flex-1 flex-col items-center px-3 pt-4 pb-3">
                <div className="h-12 w-12 rounded-2xl bg-gray-100 animate-pulse" />
                <div className="mt-2 h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="mt-1.5 h-2 w-24 bg-gray-50 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
