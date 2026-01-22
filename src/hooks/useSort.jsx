import { useState, useMemo, useEffect } from 'react';

export const useSort = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  useEffect(() => {
    if (config !== null) {
      setSortConfig(config);
    }
  }, [config]);

  const getValue = (obj, path) => {
    if (!path) return '';

    return path.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : '';
    }, obj);
  };

  const sortedItems = useMemo(() => {
    if (!items || items.length === 0) return items;
    
    let sortableItems = [...items];
    
    if (sortConfig !== null && sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = getValue(a, sortConfig.key);
        let bValue = getValue(b, sortConfig.key);

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};