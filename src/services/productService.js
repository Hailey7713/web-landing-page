// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Premium Groundnut Oil',
    description: 'Cold-pressed, unrefined groundnut oil with rich flavor and aroma',
    price: 299,
    image: '/images/groundnut-oil.jpg',
    category: 'oils',
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'Roasted Peanuts',
    description: 'Freshly roasted peanuts, perfect for snacking',
    price: 149,
    image: '/images/roasted-peanuts.jpg',
    category: 'snacks',
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  // Add more products as needed
];

// Simulate API delay
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all products
export const getProducts = async () => {
  await simulateDelay(500); // Simulate network delay
  return [...mockProducts];
};

// Get product by ID
export const getProductById = async (id) => {
  await simulateDelay(300);
  return mockProducts.find(product => product.id === parseInt(id)) || null;
};

// Get products by category
export const getProductsByCategory = async (category) => {
  await simulateDelay(400);
  return mockProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

// Search products
export const searchProducts = async (query) => {
  await simulateDelay(500);
  const searchTerm = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
};
