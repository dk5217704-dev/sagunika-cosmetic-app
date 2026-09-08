import { Product } from '../types';
import { FilterState } from '../components/ProductCatalogControls';

export function filterAndSortProducts(products: Product[], filters: FilterState): Product[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = products.filter((item) => {
    // 1. Text Search matching
    if (query) {
      const matchName = item.name.toLowerCase().includes(query);
      const matchSubtitle = item.subtitle.toLowerCase().includes(query);
      const matchCategory = item.category.toLowerCase().includes(query);
      const matchBrand = item.brand.toLowerCase().includes(query);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
      const matchIngredients = item.keyIngredients.some((ing) => ing.toLowerCase().includes(query));
      const matchOccasion = item.occasions?.some((occ) => occ.toLowerCase().includes(query));
      const matchDesc = item.description.toLowerCase().includes(query);

      if (
        !matchName &&
        !matchSubtitle &&
        !matchCategory &&
        !matchBrand &&
        !matchTags &&
        !matchIngredients &&
        !matchOccasion &&
        !matchDesc
      ) {
        return false;
      }
    }

    // 2. Category Filter
    if (filters.category !== 'all') {
      if (filters.category === 'wedding') {
        const isWedding =
          item.collection === 'wedding' ||
          item.category === 'wedding' ||
          item.tags.some((t) => t.toLowerCase() === 'wedding');
        if (!isWedding) return false;
      } else if (filters.category === 'groom') {
        const isGroom =
          item.collection === 'groom' ||
          item.category === 'groom' ||
          item.tags.some((t) => t.toLowerCase() === 'groom');
        if (!isGroom) return false;
      } else {
        if (item.category !== filters.category) return false;
      }
    }

    // 2b. Brand Filter
    if (filters.brand && filters.brand !== 'all') {
      if (item.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
    }

    // 3. Price Range Filter
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under-1500':
          if (item.price >= 1500) return false;
          break;
        case '1500-3000':
          if (item.price < 1500 || item.price > 3000) return false;
          break;
        case '3000-5000':
          if (item.price < 3000 || item.price > 5000) return false;
          break;
        case 'above-5000':
          if (item.price <= 5000) return false;
          break;
      }
    }

    // Custom Min / Max Price
    if (filters.minCustomPrice !== undefined && item.price < filters.minCustomPrice) {
      return false;
    }
    if (filters.maxCustomPrice !== undefined && item.price > filters.maxCustomPrice) {
      return false;
    }

    // 4. Occasion Filter
    if (filters.occasion !== 'all') {
      const occasionKey = filters.occasion.toLowerCase();
      const hasOccasion =
        item.occasions?.some((o) => o.toLowerCase() === occasionKey) ||
        item.tags.some((t) => t.toLowerCase().includes(occasionKey)) ||
        (occasionKey === 'wedding' && item.collection === 'wedding');
      if (!hasOccasion) return false;
    }

    // 5. In-Stock Filter
    if (filters.inStockOnly && item.stockQuantity <= 0) {
      return false;
    }

    // 6. Minimum Rating Filter
    if (filters.minRating !== undefined && item.rating < filters.minRating) {
      return false;
    }

    return true;
  });

  // 7. Sorting
  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case 'bestseller':
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
      case 'newest':
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating;
    }
  });
}
