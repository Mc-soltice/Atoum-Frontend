// components/admin/Filter.tsx

import { useState, useEffect } from "react";
import { Search, Calendar, X, Filter as FilterIcon } from "lucide-react";

interface FilterProps<T> {
  options?: {
    [key: string]: any[];
  };
  onFilterChange: (filters: any) => void;
}

function Filter<T>({ options, onFilterChange }: FilterProps<T>) {
  const [filters, setFilters] = useState({
    search: "",
    movement_type: "",
    dateFilter: "all", // all, exact, range
    exactDate: "",
    startDate: "",
    endDate: ""
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Appliquer les filtres à chaque changement
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateFilterChange = (type: string) => {
    setFilters(prev => ({ ...prev, dateFilter: type }));
  };

  const resetDateFilters = () => {
    setFilters(prev => ({
      ...prev,
      dateFilter: "all",
      exactDate: "",
      startDate: "",
      endDate: ""
    }));
  };

  const resetAllFilters = () => {
    setFilters({
      search: "",
      movement_type: "",
      dateFilter: "all",
      exactDate: "",
      startDate: "",
      endDate: ""
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.movement_type) count++;
    if (filters.dateFilter !== "all") count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header avec bouton d'expansion */}
      <div

        className="px-6 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-100 "
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <FilterIcon className="w-5 h-5 text-slate-900" />
          <h3 className="font-medium text-slate-900">Filtres</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button className="text-slate-900 hover:text-slate-700">
          <svg
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Contenu des filtres */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-200 space-y-6">
          {/* Recherche textuelle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                placeholder="Rechercher ..."
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: "" }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Type de mouvement */}
          {options?.movement_type && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Type de mouvement
              </label>
              <select
                name="movement_type"
                value={filters.movement_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Tous les types</option>
                <option value="in">Entrées</option>
                <option value="out">Sorties</option>
              </select>
            </div>
          )}

          {/* Filtres par date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Période
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleDateFilterChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters.dateFilter === "all"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => handleDateFilterChange("exact")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters.dateFilter === "exact"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Date précise
              </button>
              <button
                type="button"
                onClick={() => handleDateFilterChange("range")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters.dateFilter === "range"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Intervalle
              </button>
            </div>

            {/* Date précise */}
            {filters.dateFilter === "exact" && (
              <div className="animate-fadeIn">
                <input
                  type="date"
                  name="exactDate"
                  value={filters.exactDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Intervalle de dates */}
            {filters.dateFilter === "range" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                />
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {/* Résumé des filtres actifs */}
            {activeFiltersCount > 0 && (
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-900">
                  <span className="font-medium">Filtres actifs:</span>
                  <span className="flex flex-wrap gap-1">
                    {filters.search && (
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        "{filters.search}"
                      </span>
                    )}
                    {filters.movement_type && (
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {filters.movement_type === 'in' ? 'Entrées' : 'Sorties'}
                      </span>
                    )}
                    {filters.dateFilter === "exact" && filters.exactDate && (
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {new Date(filters.exactDate).toLocaleDateString()}
                      </span>
                    )}
                    {filters.dateFilter === "range" && filters.startDate && filters.endDate && (
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        du {new Date(filters.startDate).toLocaleDateString()} au {new Date(filters.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={resetAllFilters}
              className=" rounded-lg relative px-4 py-2 text-sm font-medium text-slate-900 hover:text-white transition-colors duration-300 overflow-hidden group ml-auto"
            >
              <span className="relative z-10">Réinitialiser tout</span>
              <div className="absolute inset-0 bg-slate-900 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Filter;