export default function Loader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#E07B39]/20 border-t-[#E07B39] rounded-full animate-spin"></div>
        <p className="text-center text-[#E07B39] mt-4 text-sm">Loading...</p>
      </div>
    </div>
  );
}