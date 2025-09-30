import React, { useEffect, useState } from 'react';

type MapPoint = { city: string; performance: number; region?: string };

const MapVisualization: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);

  useEffect(() => {
    // For now, reuse hierarchy-performance to simulate area points by store names
    fetch('/api/hierarchy-performance')
      .then(r => r.json())
      .then((data: Array<{ store: string; performance: number }>) => {
        const mapped: MapPoint[] = data.map((d) => ({ city: d.store, performance: d.performance }));
        setPoints(mapped);
      })
      .catch(() => setPoints([]));
  }, []);

  const getCircleColor = (performance: number) => {
    if (performance >= 75) return '#10B981';
    if (performance >= 65) return '#F59E0B';
    return '#EF4444';
  };

  const getCircleSize = (performance: number) => {
    // Responsive sizing based on viewport width
    const baseSize = window.innerWidth < 640 ? 6 : window.innerWidth < 1024 ? 8 : 10;
    const maxSize = window.innerWidth < 640 ? 16 : window.innerWidth < 1024 ? 20 : 24;
    return Math.max(baseSize, (performance / 100) * maxSize);
  };

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-teal-50 rounded-lg overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-teal-200 opacity-50">
        <svg 
          viewBox="0 0 800 400" 
          className="w-full h-full" 
          style={{ filter: 'opacity(0.3)' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <path 
            d="M 100 100 L 700 100 L 700 300 L 100 300 Z" 
            fill="none" 
            stroke="#14B8A6" 
            strokeWidth="2" 
            strokeDasharray="5,5" 
          />
        </svg>
      </div>

      {/* Data points */}
      {points.map((location, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{
            left: `${15 + (index % (window.innerWidth < 640 ? 4 : window.innerWidth < 1024 ? 6 : 8)) * (70 / (window.innerWidth < 640 ? 4 : window.innerWidth < 1024 ? 6 : 8))}%`,
            top: `${15 + Math.floor(index / (window.innerWidth < 640 ? 4 : window.innerWidth < 1024 ? 6 : 8)) * (window.innerWidth < 640 ? 20 : 15)}%`,
          }}
        >
          <div
            className="rounded-full border-2 border-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: getCircleColor(location.performance),
              width: `${getCircleSize(location.performance)}px`,
              height: `${getCircleSize(location.performance)}px`,
            }}
          />

          {/* Tooltip */}
          <div className="absolute bottom-full mb-1 sm:mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="bg-gray-900 text-white text-xs sm:text-sm px-2 py-1 rounded whitespace-nowrap max-w-[200px] sm:max-w-none">
              <div className="font-medium truncate sm:whitespace-nowrap">{location.city}</div>
              <div className="text-teal-300">{location.performance}%</div>
              {location.region && <div className="text-gray-300 text-xs">{location.region}</div>}
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-md max-w-[180px] sm:max-w-none">
        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Area Hierarchy</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0"></div>
            <span className="text-gray-600 text-xs sm:text-sm">75%+ Performance</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
            <span className="text-gray-600 text-xs sm:text-sm">65-74% Performance</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 flex-shrink-0"></div>
            <span className="text-gray-600 text-xs sm:text-sm">&lt;65% Performance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapVisualization;