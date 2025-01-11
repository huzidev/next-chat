
export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <div className="flex flex-col items-center">
        <svg
          className="w-16 h-16 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12h3m-3-4h3m-3 8h3m-6 4H7c-2.21 0-4-1.79-4-4V7c0-2.21 1.79-4 4-4h10c2.21 0 4 1.79 4 4v6.5M8 15h.01M12 15h.01M12 11h.01M8 11h.01M8 7h.01M12 7h.01M16 11h.01M16 7h.01"
          />
        </svg>
        <h1 className="mt-4 text-xl font-semibold text-gray-700">
          {message}
        </h1>
      </div>
    </div>
  );
}
