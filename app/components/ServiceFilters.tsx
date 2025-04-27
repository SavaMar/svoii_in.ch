"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCategory } from "../services/types";
import { mockServices } from "../services/mockData";

interface ServiceFiltersProps {
  categories: ServiceCategory[];
  kantons: string[];
  onFilterChange: (filters: {
    category?: ServiceCategory | null;
    kanton?: string | null;
    zipCode?: string | null;
  }) => void;
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  categories,
  kantons,
  onFilterChange,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [selectedKanton, setSelectedKanton] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showKantonDropdown, setShowKantonDropdown] = useState(false);
  const [showZipCodeDropdown, setShowZipCodeDropdown] = useState(false);
  const [availableZipCodes, setAvailableZipCodes] = useState<string[]>([]);

  // Update available zip codes when canton changes
  useEffect(() => {
    if (selectedKanton) {
      // Filter services by the selected canton and extract unique zip codes
      const zipCodes = Array.from(
        new Set(
          mockServices
            .filter((service) => service.kanton === selectedKanton)
            .map((service) => service.zipCode)
        )
      ).sort();
      setAvailableZipCodes(zipCodes);
    } else {
      setAvailableZipCodes([]);
    }
    // Reset zip code when canton changes
    setZipCode("");
  }, [selectedKanton]);

  const handleCategorySelect = (category: ServiceCategory | null) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    onFilterChange({
      category,
      kanton: selectedKanton,
      zipCode: zipCode || null,
    });
  };

  const handleKantonSelect = (kanton: string | null) => {
    setSelectedKanton(kanton);
    setShowKantonDropdown(false);
    onFilterChange({
      category: selectedCategory,
      kanton,
      zipCode: null, // Reset zip code when canton changes
    });
  };

  const handleZipCodeSelect = (code: string) => {
    setZipCode(code);
    setShowZipCodeDropdown(false);
    onFilterChange({
      category: selectedCategory,
      kanton: selectedKanton,
      zipCode: code,
    });
  };

  const handleZipCodeSubmit = () => {
    onFilterChange({
      category: selectedCategory,
      kanton: selectedKanton,
      zipCode: zipCode || null,
    });
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedKanton(null);
    setZipCode("");
    onFilterChange({ category: null, kanton: null, zipCode: null });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8">
      <h2 className="text-lg font-semibold mb-4">Фільтри послуг</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Категорія послуг
          </label>
          <div className="relative">
            <button
              type="button"
              className="flex justify-between items-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-left text-sm"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span className="truncate">
                {selectedCategory || "Всі категорії"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto py-1 border border-gray-200">
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => handleCategorySelect(null)}
                >
                  <div className="flex items-center">
                    {!selectedCategory && (
                      <Check className="h-4 w-4 mr-2 text-blue-600" />
                    )}
                    <span>Всі категорії</span>
                  </div>
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="flex items-center">
                      {selectedCategory === category && (
                        <Check className="h-4 w-4 mr-2 text-blue-600" />
                      )}
                      <span>{category}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kanton Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Кантон
          </label>
          <div className="relative">
            <button
              type="button"
              className="flex justify-between items-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-left text-sm"
              onClick={() => setShowKantonDropdown(!showKantonDropdown)}
            >
              <span className="truncate">
                {selectedKanton || "Всі кантони"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showKantonDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto py-1 border border-gray-200">
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => handleKantonSelect(null)}
                >
                  <div className="flex items-center">
                    {!selectedKanton && (
                      <Check className="h-4 w-4 mr-2 text-blue-600" />
                    )}
                    <span>Всі кантони</span>
                  </div>
                </button>

                {kantons.map((kanton) => (
                  <button
                    key={kanton}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => handleKantonSelect(kanton)}
                  >
                    <div className="flex items-center">
                      {selectedKanton === kanton && (
                        <Check className="h-4 w-4 mr-2 text-blue-600" />
                      )}
                      <span>{kanton}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ZIP Code Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Поштовий індекс
          </label>
          <div className="relative">
            <div className="flex">
              <button
                type="button"
                className={`flex justify-between items-center w-full rounded-l-md border border-gray-300 px-4 py-2 bg-white text-left text-sm ${
                  !selectedKanton ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  selectedKanton && setShowZipCodeDropdown(!showZipCodeDropdown)
                }
                disabled={!selectedKanton}
              >
                <span className="truncate">{zipCode || "Виберіть індекс"}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={handleZipCodeSubmit}
                className={`bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 ${
                  !zipCode ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!zipCode}
              >
                OK
              </button>
            </div>

            {showZipCodeDropdown && selectedKanton && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto py-1 border border-gray-200">
                {availableZipCodes.length > 0 ? (
                  availableZipCodes.map((code) => (
                    <button
                      key={code}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => handleZipCodeSelect(code)}
                    >
                      <div className="flex items-center">
                        {zipCode === code && (
                          <Check className="h-4 w-4 mr-2 text-blue-600" />
                        )}
                        <span>{code}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Немає доступних індексів
                  </div>
                )}
              </div>
            )}
          </div>
          {!selectedKanton && (
            <p className="text-xs text-gray-500 mt-1">
              Спочатку виберіть кантон
            </p>
          )}
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategory || selectedKanton || zipCode) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Активні фільтри:</span>

          {selectedCategory && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {selectedCategory}
              <button
                onClick={() => handleCategorySelect(null)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedKanton && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {selectedKanton}
              <button
                onClick={() => handleKantonSelect(null)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {zipCode && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Індекс: {zipCode}
              <button
                onClick={() => {
                  setZipCode("");
                  onFilterChange({
                    category: selectedCategory,
                    kanton: selectedKanton,
                    zipCode: null,
                  });
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-gray-600"
          >
            Скинути все
          </Button>
        </div>
      )}
    </div>
  );
};
