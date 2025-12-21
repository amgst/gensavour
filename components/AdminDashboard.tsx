
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MenuItem, Category } from '../types';
import { generateDescription, suggestPrice } from '../services/geminiService';

type SortKey = keyof MenuItem;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 8;

interface ValidationErrors {
  name?: string;
  description?: string;
  price?: string;
}

interface AdminDashboardProps {
  menuItems: MenuItem[];
  onUpdateMenu: (updatedMenu: MenuItem[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ menuItems, onUpdateMenu }) => {
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'name', direction: 'asc' });

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'name':
        if (!value || value.trim().length < 3) return 'Dish name must be at least 3 characters.';
        return undefined;
      case 'description':
        if (!value || value.trim().length < 10) return 'Description should be at least 10 characters.';
        return undefined;
      case 'price':
        if (value === undefined || value === null || isNaN(value)) return 'Price is required.';
        if (value <= 0) return 'Price must be a positive number.';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof MenuItem, value: any) => {
    if (!editingItem) return;
    
    const newItem = { ...editingItem, [field]: value };
    setEditingItem(newItem);
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setErrors({});
    setTouched({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this dish from the menu?')) {
      const updated = menuItems.filter(item => item.id !== id);
      onUpdateMenu(updated);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      const remainingOnPage = displayItems.length - 1;
      const maxPage = Math.max(1, Math.ceil(remainingOnPage / ITEMS_PER_PAGE));
      if (currentPage > maxPage) setCurrentPage(maxPage);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select an image under 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Final validation check
    const newErrors: ValidationErrors = {
      name: validateField('name', editingItem.name),
      description: validateField('description', editingItem.description),
      price: validateField('price', editingItem.price),
    };

    if (Object.values(newErrors).some(err => err !== undefined)) {
      setErrors(newErrors);
      setTouched({ name: true, description: true, price: true });
      return;
    }

    let updatedMenu: MenuItem[];
    if (editingItem.id) {
      updatedMenu = menuItems.map(item => item.id === editingItem.id ? editingItem as MenuItem : item);
    } else {
      const newItem = {
        ...editingItem,
        id: Date.now().toString(),
        image: editingItem.image || 'https://images.unsplash.com/photo-1547928576-a4a33237ce35?q=80&w=1770&auto=format&fit=crop'
      } as MenuItem;
      updatedMenu = [...menuItems, newItem];
    }
    
    onUpdateMenu(updatedMenu);
    setEditingItem(null);
  };

  const handleAIDescription = async () => {
    if (!editingItem?.name || !editingItem?.category) {
      alert("Please provide a dish name and category first.");
      return;
    }
    setIsLoadingAI(true);
    const description = await generateDescription(editingItem.name, editingItem.category);
    handleInputChange('description', description);
    setIsLoadingAI(false);
  };

  const handleAISuggestPrice = async () => {
    if (!editingItem?.name || !editingItem?.category) {
      alert("Please provide a dish name and category first.");
      return;
    }
    setIsLoadingAI(true);
    const price = await suggestPrice(editingItem.name, editingItem.category);
    handleInputChange('price', price);
    setIsLoadingAI(false);
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortConfig?.key !== key) return <span className="text-stone-300 ml-1">⇅</span>;
    return sortConfig.direction === 'asc' ? <span className="text-emerald-600 ml-1">↑</span> : <span className="text-emerald-600 ml-1">↓</span>;
  };

  // Intermediate state for counts: items that match the current search term
  const searchMatchedItems = useMemo(() => {
    if (!searchTerm) return menuItems;
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);

  // Calculate counts per category based on search matches
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    searchMatchedItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [searchMatchedItems]);

  const displayItems = useMemo(() => {
    let items = [...searchMatchedItems];
    
    // Filter by Category
    if (filterCategory !== 'All') {
      items = items.filter(item => item.category === filterCategory);
    }

    // Sorting
    if (sortConfig) {
      items.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === undefined || valB === undefined) return 0;
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [searchMatchedItems, filterCategory, sortConfig]);

  const totalPages = Math.ceil(displayItems.length / ITEMS_PER_PAGE);
  const paginatedItems = displayItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selection Logic
  const toggleSelectAll = () => {
    const allPaginatedSelected = paginatedItems.every(item => selectedIds.has(item.id));
    if (allPaginatedSelected) {
      const next = new Set(selectedIds);
      paginatedItems.forEach(item => next.delete(item.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginatedItems.forEach(item => next.add(item.id));
      setSelectedIds(next);
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkMarkPopular = (status: boolean) => {
    const updated = menuItems.map(item => 
      selectedIds.has(item.id) ? { ...item, isPopular: status } : item
    );
    onUpdateMenu(updated);
  };

  const handleBulkChangeCategory = (cat: Category) => {
    const updated = menuItems.map(item => 
      selectedIds.has(item.id) ? { ...item, category: cat } : item
    );
    onUpdateMenu(updated);
  };

  const inputErrorClass = (field: keyof ValidationErrors) => {
    return touched[field] && errors[field] ? 'border-red-500 ring-4 ring-red-500/10 focus:border-red-500' : 'border-stone-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10';
  };

  const isAllPaginatedSelected = paginatedItems.length > 0 && paginatedItems.every(item => selectedIds.has(item.id));

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn pb-24 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-stone-800 font-serif">Menu Management</h1>
          <p className="text-stone-500 text-sm mt-1">Refine your offerings and update visuals.</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem({ category: Category.ENTREES, price: 0 });
            setErrors({});
            setTouched({});
          }}
          className="bg-emerald-800 text-white px-6 py-2 rounded-lg hover:bg-emerald-900 shadow-md transition-all whitespace-nowrap active:scale-[0.98]"
        >
          + Add New Item
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap">Viewing:</label>
            <select 
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
                setSelectedIds(new Set()); // Clear selection when filter changes
              }}
              className="w-full sm:w-auto border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none bg-stone-50 transition-all cursor-pointer"
            >
              <option value="All">All Categories ({searchMatchedItems.length})</option>
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({categoryCounts[cat] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-stone-400 text-sm italic">
          Showing {displayItems.length > 0 ? Math.min(displayItems.length, (currentPage - 1) * ITEMS_PER_PAGE + 1) : 0}-{Math.min(displayItems.length, currentPage * ITEMS_PER_PAGE)} of {displayItems.length} items
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto border border-stone-200 animate-slideUp">
            <button 
              onClick={() => setEditingItem(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold mb-8 font-serif text-emerald-900">
              {editingItem.id ? 'Modify Dish' : 'Add New Dish'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Dish Name</label>
                  <input 
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onBlur={() => handleBlur('name')}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className={`w-full border bg-stone-50 rounded-xl px-4 py-3 outline-none transition-all duration-200 shadow-sm ${inputErrorClass('name')}`}
                    placeholder="e.g. Lamb Kabob"
                  />
                  {touched.name && errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Category</label>
                  <select 
                    value={editingItem.category}
                    onChange={e => handleInputChange('category', e.target.value as Category)}
                    className="w-full border border-stone-200 bg-stone-50 rounded-xl px-4 py-3 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 shadow-sm cursor-pointer"
                  >
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest">Description</label>
                  <button 
                    type="button"
                    onClick={handleAIDescription}
                    disabled={isLoadingAI}
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold p-1.5 border border-emerald-100 rounded-lg bg-emerald-50 transition-colors"
                  >
                    {isLoadingAI ? '...' : '✨ Gemini AI'}
                  </button>
                </div>
                <textarea 
                  required
                  rows={3}
                  value={editingItem.description || ''}
                  onBlur={() => handleBlur('description')}
                  onChange={e => handleInputChange('description', e.target.value)}
                  className={`w-full border bg-stone-50 rounded-xl px-4 py-3 outline-none transition-all duration-200 shadow-sm text-sm resize-none ${inputErrorClass('description')}`}
                  placeholder="Describe the flavors..."
                />
                {touched.description && errors.description && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest">Price ($)</label>
                    <button 
                      type="button"
                      onClick={handleAISuggestPrice}
                      disabled={isLoadingAI}
                      className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold p-1.5 border border-emerald-100 rounded-lg bg-emerald-50 transition-colors"
                    >
                      AI Suggest
                    </button>
                  </div>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={editingItem.price ?? ''}
                    onBlur={() => handleBlur('price')}
                    onChange={e => handleInputChange('price', parseFloat(e.target.value))}
                    className={`w-full border bg-stone-50 rounded-xl px-4 py-3 outline-none transition-all duration-200 shadow-sm ${inputErrorClass('price')}`}
                  />
                  {touched.price && errors.price && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Image</label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                      {editingItem.image ? (
                        <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">🖼️</div>
                      )}
                    </div>
                    <div className="flex-grow flex gap-2">
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-grow py-2 bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        Upload
                      </button>
                      {editingItem.image && (
                        <button type="button" onClick={() => handleInputChange('image', '')} className="text-[10px] text-red-500 px-2 font-bold uppercase">X</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
                <input 
                  type="checkbox"
                  id="isPopular"
                  checked={editingItem.isPopular || false}
                  onChange={e => handleInputChange('isPopular', e.target.checked)}
                  className="w-5 h-5 text-emerald-600 border-stone-300 rounded cursor-pointer"
                />
                <label htmlFor="isPopular" className="text-sm font-semibold text-stone-700 cursor-pointer">Chef's Recommendation</label>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-stone-100">
                <button type="button" onClick={() => setEditingItem(null)} className="px-6 py-2 text-stone-500 font-bold uppercase text-xs tracking-widest hover:text-stone-800 transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={Object.values(errors).some(e => !!e)}
                  className="px-8 py-3 bg-emerald-800 text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Actions Floating Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-8 animate-slideUp border border-stone-700/50 min-w-[300px] md:min-w-[600px] justify-between">
          <div className="flex items-center gap-4">
            <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">{selectedIds.size}</span>
            <span className="text-xs font-bold uppercase tracking-widest">Selected</span>
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="text-[10px] text-stone-400 hover:text-white uppercase tracking-wider font-bold"
            >
              Clear
            </button>
          </div>
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkMarkPopular(true)}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-emerald-800/50 border border-emerald-500/30 rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Featured
              </button>
              <button 
                onClick={() => handleBulkMarkPopular(false)}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-lg hover:bg-stone-700 transition-colors"
              >
                Standard
              </button>
            </div>
            
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Move to:</span>
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkChangeCategory(e.target.value as Category);
                    e.target.value = '';
                  }
                }}
                className="bg-stone-800 border border-stone-700 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 rounded-lg outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="">Choose...</option>
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-5 w-12">
                   <input 
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-emerald-600 border-stone-300 rounded cursor-pointer accent-emerald-600"
                  />
                </th>
                <th 
                  className="px-6 py-5 font-bold text-stone-600 cursor-pointer hover:text-emerald-800 transition-colors text-[10px] uppercase tracking-[0.2em]"
                  onClick={() => requestSort('name')}
                >
                  Dish {getSortIndicator('name')}
                </th>
                <th 
                  className="px-6 py-5 font-bold text-stone-600 cursor-pointer hover:text-emerald-800 transition-colors text-[10px] uppercase tracking-[0.2em]"
                  onClick={() => requestSort('category')}
                >
                  Category {getSortIndicator('category')}
                </th>
                <th 
                  className="px-6 py-5 font-bold text-stone-600 cursor-pointer hover:text-emerald-800 transition-colors text-[10px] uppercase tracking-[0.2em]"
                  onClick={() => requestSort('price')}
                >
                  Price {getSortIndicator('price')}
                </th>
                <th className="px-6 py-5 font-bold text-stone-600 text-right text-[10px] uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedItems.map(item => (
                <tr key={item.id} className={`hover:bg-stone-50/50 transition-colors group ${selectedIds.has(item.id) ? 'bg-emerald-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 text-emerald-600 border-stone-300 rounded cursor-pointer accent-emerald-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.image || 'https://via.placeholder.com/150'} 
                        alt="" 
                        className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-stone-900 truncate font-serif flex items-center gap-2">
                          {item.name}
                          {item.isPopular && <span className="w-2 h-2 rounded-full bg-amber-400" title="Featured"></span>}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate max-w-[200px]">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full uppercase tracking-wider border border-stone-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-800 font-serif">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(item)} className="text-emerald-700 hover:text-emerald-900 mr-4 font-bold text-[10px] uppercase tracking-widest">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-bold text-[10px] uppercase tracking-widest">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {displayItems.length === 0 && (
          <div className="py-24 text-center text-stone-400 italic bg-stone-50/30">
            {searchTerm ? `No dishes matching "${searchTerm}" found.` : "No dishes found in this category."}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <button 
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="px-4 py-2 border border-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === page ? 'bg-emerald-800 text-white shadow-md' : 'bg-white border border-stone-200 text-stone-500 hover:border-emerald-800'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="px-4 py-2 border border-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
