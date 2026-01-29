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
    const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    
    return normalizedPath.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : '';
    }, obj);
  };

  const sortedItems = useMemo(() => {
    if (!items || items.length === 0) return items;
    
    let sortableItems = [...items];
    const sortKey = sortConfig?.sortKey ?? sortConfig?.key;
    
    if (sortConfig !== null && sortKey) {
      sortableItems.sort((a, b) => {
        let aValue = getValue(a, sortKey);
        let bValue = getValue(b, sortKey);

        const isNumeric = !isNaN(aValue) && !isNaN(bValue) && aValue !== '' && bValue !== '';
        
        if (!isNumeric) {
          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        } else {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (sortKey) => {
    let direction = 'asc';
    const currentSortKey = sortConfig?.sortKey ?? sortConfig?.key;
    if (sortConfig && currentSortKey === sortKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ sortKey, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};