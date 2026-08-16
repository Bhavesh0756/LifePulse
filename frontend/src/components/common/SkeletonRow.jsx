import React from 'react';

export default function SkeletonRow({ count = 3, type = 'card' }) {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <>
        {items.map((_, i) => (
          <tr key={i} className="border-b border-slate-100">
            <td className="py-4 px-4"><div className="h-4 skeleton-shimmer rounded-lg w-3/4" /></td>
            <td className="py-4 px-4"><div className="h-4 skeleton-shimmer rounded-lg w-1/2 mx-auto" /></td>
            <td className="py-4 px-4"><div className="h-4 skeleton-shimmer rounded-lg w-1/2 mx-auto" /></td>
            <td className="py-4 px-4"><div className="h-4 skeleton-shimmer rounded-lg w-1/3 ml-auto" /></td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 skeleton-shimmer rounded-lg w-1/3" />
            <div className="h-4 skeleton-shimmer rounded-lg w-1/6" />
          </div>
          <div className="h-3 skeleton-shimmer rounded-lg w-2/3" />
          <div className="h-8 skeleton-shimmer rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
}
