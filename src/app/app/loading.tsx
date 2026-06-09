export default function Loading() {
  return (
    <div className="px-5 pt-5">
      <div className="skeleton h-36 w-full rounded-3xl" />
      <div className="mt-4 flex gap-2">
        {[64, 80, 72].map((w, i) => <div key={i} className="skeleton h-8 rounded-full" style={{ width: w }} />)}
      </div>
      <div className="mt-7 flex gap-4 overflow-hidden">
        {[0, 1].map((i) => (
          <div key={i} className="w-[15.5rem] shrink-0 overflow-hidden rounded-3xl border border-line">
            <div className="skeleton h-44 w-full" />
            <div className="space-y-2 p-4">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-9 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
