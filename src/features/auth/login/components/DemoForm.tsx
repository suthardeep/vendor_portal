import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import  Dropdown, { DropdownOption }  from "@/components/base/DropDown";

// Demo Form
const schema = z.object({
  category: z.string().min(1, "Please select a category"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  products: z.array(z.number()).min(1, "Select at least one product"),
  country: z.string().min(1, "Please select a country"),
});

type FormData = z.infer<typeof schema>;

export default function Demo() {
  const [productOptions, setProductOptions] = useState<DropdownOption[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DropdownOption[]>([]);
  const [productPage, setProductPage] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isProductSearchMode, setIsProductSearchMode] = useState(false);

  const [allCountries, setAllCountries] = useState<DropdownOption[]>([]);
  const [countryOptions, setCountryOptions] = useState<DropdownOption[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<DropdownOption[]>([]);
  const [countryPage, setCountryPage] = useState(0);
  const [hasMoreCountries, setHasMoreCountries] = useState(true);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isCountrySearchMode, setIsCountrySearchMode] = useState(false);

  const categoryOptions: DropdownOption[] = [
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "support", label: "Support" },
  ];

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      category: "development",
      categories: ["design", "marketing"],
      products: [],
      country: "IN",
    },
  });

  // Watch the products value to debug
  const productsValue = watch("products");

  // Fetch products from DummyJSON API
  const fetchProducts = async (page: number) => {
    try {
      setIsLoadingProducts(true);
      const limit = 10;
      const skip = page * limit;
      
      const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=id,title,price`
      );
      const data = await response.json();
      
      const newOptions: DropdownOption[] = data.products.map((product: any) => ({
        value: product.id,
        label: `${product.title} - $${product.price}`,
      }));

      // KEY FIX: Use a Set to prevent duplicates
      setProductOptions(prev => {
        const existingIds = new Set(prev.map(p => p.value));
        const uniqueNew = newOptions.filter(p => !existingIds.has(p.value));
        return [...prev, ...uniqueNew];
      });
      
      setFilteredProducts(prev => {
        const existingIds = new Set(prev.map(p => p.value));
        const uniqueNew = newOptions.filter(p => !existingIds.has(p.value));
        return [...prev, ...uniqueNew];
      });
      
      setHasMoreProducts(skip + limit < data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchProductsByIds = async (ids: number[]) => {
    try {
      const promises = ids.map(id => 
        fetch(`https://dummyjson.com/products/${id}?select=id,title,price`)
          .then(res => res.json())
      );
      
      const products = await Promise.all(promises);
      
      const options: DropdownOption[] = products.map((product: any) => ({
        value: product.id,
        label: `${product.title} - $${product.price}`,
      }));

      // KEY FIX: Add to beginning to ensure they're visible
      setProductOptions(prev => {
        const existingIds = new Set(prev.map(p => p.value));
        const newProducts = options.filter(p => !existingIds.has(p.value));
        return [...newProducts, ...prev];
      });
      
      setFilteredProducts(prev => {
        const existingIds = new Set(prev.map(p => p.value));
        const newProducts = options.filter(p => !existingIds.has(p.value));
        return [...newProducts, ...prev];
      });
    } catch (error) {
      console.error("Error fetching products by IDs:", error);
    }
  };

  const fetchCountryByCode = async (code: string) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${code}?fields=name,cca2`
      );
      
      if (!response.ok) return;
      
      const data = await response.json();
      const country: DropdownOption = {
        value: data.cca2,
        label: data.name.common,
      };

      setAllCountries(prev => {
        const exists = prev.some(c => c.value === country.value);
        return exists ? prev : [country, ...prev];
      });
      
      setCountryOptions(prev => {
        const exists = prev.some(c => c.value === country.value);
        return exists ? prev : [country, ...prev];
      });
      
      setFilteredCountries(prev => {
        const exists = prev.some(c => c.value === country.value);
        return exists ? prev : [country, ...prev];
      });
    } catch (error) {
      console.error("Error fetching country by code:", error);
    }
  };

  const fetchAllCountries = async () => {
    try {
      setIsLoadingCountries(true);
      const response = await fetch(`https://restcountries.com/v3.1/all?fields=name,cca2`);
      const data = await response.json();
      
      const sortedData = data.sort((a: any, b: any) => 
        a.name.common.localeCompare(b.name.common)
      );
      
      const allOptions: DropdownOption[] = sortedData.map((country: any) => ({
        value: country.cca2,
        label: country.name.common,
      }));
      
      setAllCountries(allOptions);
      
      const limit = 20;
      const firstPage = allOptions.slice(0, limit);
      setCountryOptions(firstPage);
      setFilteredCountries(firstPage);
      setHasMoreCountries(allOptions.length > limit);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const loadMoreCountries = () => {
    const limit = 20;
    const nextPage = countryPage + 1;
    const startIdx = nextPage * limit;
    const endIdx = startIdx + limit;
    
    const nextBatch = allCountries.slice(startIdx, endIdx);
    
    if (nextBatch.length > 0) {
      setCountryOptions(prev => [...prev, ...nextBatch]);
      setFilteredCountries(prev => [...prev, ...nextBatch]);
      setCountryPage(nextPage);
      setHasMoreCountries(endIdx < allCountries.length);
    } else {
      setHasMoreCountries(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const defaultCountry = "IN";
      if (defaultCountry) {
        await fetchCountryByCode(defaultCountry);
      }
      
      const defaultProducts = [1, 5, 10];
      if (defaultProducts.length > 0) {
        await fetchProductsByIds(defaultProducts);
        setValue("products", defaultProducts);
      }
      
      await fetchProducts(0);
      await fetchAllCountries();
    };
    
    init();
  }, []);

  const handleLoadMoreProducts = async () => {
    if (isProductSearchMode) return;
    
    const nextPage = productPage + 1;
    setProductPage(nextPage);
    await fetchProducts(nextPage);
  };

  const handleLoadMoreCountries = () => {
    if (isCountrySearchMode) return;
    loadMoreCountries();
  };

  const handleProductSearch = async (query: string) => {
    if (!query.trim()) {
      setIsProductSearchMode(false);
      setFilteredProducts(productOptions);
      return;
    }
    
    setIsProductSearchMode(true);
    
    try {
      setIsLoadingProducts(true);
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&select=id,title,price`
      );
      const data = await response.json();
      
      const searchResults: DropdownOption[] = data.products.map((product: any) => ({
        value: product.id,
        label: `${product.title} - $${product.price}`,
      }));
      
      setFilteredProducts(searchResults);
      
      setProductOptions(prev => {
        const existingValues = new Set(prev.map(p => p.value));
        const newProducts = searchResults.filter(p => !existingValues.has(p.value));
        return [...prev, ...newProducts];
      });
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleCountrySearch = async (query: string) => {
    if (!query.trim()) {
      setIsCountrySearchMode(false);
      setFilteredCountries(countryOptions);
      return;
    }
    
    setIsCountrySearchMode(true);
    
    try {
      setIsLoadingCountries(true);
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fields=name,cca2`
      );
      
      if (!response.ok) {
        setFilteredCountries([]);
        setIsLoadingCountries(false);
        return;
      }
      
      const data = await response.json();
      
      const searchResults: DropdownOption[] = data.map((country: any) => ({
        value: country.cca2,
        label: country.name.common,
      }));
      
      setFilteredCountries(searchResults);
      
      setCountryOptions(prev => {
        const existingValues = new Set(prev.map(c => c.value));
        const newCountries = searchResults.filter(c => !existingValues.has(c.value));
        return [...prev, ...newCountries];
      });
      
      setAllCountries(prev => {
        const existingValues = new Set(prev.map(c => c.value));
        const newCountries = searchResults.filter(c => !existingValues.has(c.value));
        return [...prev, ...newCountries];
      });
    } catch (error) {
      console.error("Error searching countries:", error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // alert(JSON.stringify(data, null, 2));
  };

  const loadPreSelectedProducts = async () => {
    try {
      setIsLoadingProducts(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const preSelectedIds = [15, 25, 35];
      
      await fetchProductsByIds(preSelectedIds);
      setValue("products", preSelectedIds);
      
      alert(`Loaded pre-selected products: ${preSelectedIds.join(", ")}`);
    } catch (error) {
      console.error("Error loading pre-selected products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadPreSelectedCountry = async () => {
    try {
      setIsLoadingCountries(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const countryCode = "US";
      
      await fetchCountryByCode(countryCode);
      setValue("country", countryCode);
      
      alert(`Loaded pre-selected country: ${countryCode}`);
    } catch (error) {
      console.error("Error loading pre-selected country:", error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          ✅ Fixed Dropdown - No More Disappearing Selections!
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔧 What Was Fixed:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Selected items no longer disappear when selecting new ones</li>
            <li>✅ ID-based selections work properly</li>
            <li>✅ Duplicate prevention in options array</li>
            <li>✅ Selected items always visible at the top</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Currently Selected Products:</strong> [{productsValue?.join(", ") || "none"}]
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Single Select Category"
                placeholder="Select Category"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.category?.message}
                required
                fullWidth
              />
            )}
          />

          <Controller
            name="categories"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Multi Select Categories"
                placeholder="Select Categories"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.categories?.message}
                multiple
                required
                fullWidth
              />
            )}
          />

          <Controller
            name="products"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Products"
                placeholder="Search products..."
                options={filteredProducts}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.products?.message}
                searchable
                onSearch={handleProductSearch}
                onLoadMore={handleLoadMoreProducts}
                hasMore={hasMoreProducts && !isProductSearchMode}
                isLoading={isLoadingProducts}
                multiple
                required
                fullWidth
              />
            )}
          />

          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Country"
                placeholder="Search countries"
                options={filteredCountries}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.country?.message}
                searchable
                onSearch={handleCountrySearch}
                onLoadMore={handleLoadMoreCountries}
                hasMore={hasMoreCountries && !isCountrySearchMode}
                isLoading={isLoadingCountries}
                required
                fullWidth
              />
            )}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Submit Form
            </button>
            
          
          </div>
        </form>

       
     
      </div>
    </div>
  );
}