import axios from './axios'

export const categoriesService = {
    getAllCategories : () => axios.get('/categories'),
    getSpecificCategory : (id) => axios.get(`/categories/${id}`),
    postCategory : (data) => axios.post('/categories', data),
    patchCategory : (id, data) => axios.patch(`/categories/${id}`, data),
    deleteCategory : (id) => axios.delete(`/categories/${id}`)
}

export const productsService = {
    getAllProducts: () => axios.get('/products'),
    getSpecificProduct: (id) => axios.get(`/products/${id}`),
    postProduct: (data) => axios.post('/products', data),
    putProduct: (id, data) => axios.put(`/products/${id}`, data),     
    patchProduct: (id, data) => axios.patch(`/products/${id}`, data),
    deleteProduct: (id) => axios.delete(`/products/${id}`)
}

export const suppliersService = {
    getAllSuppliers: () => axios.get('/suppliers'),
    getSpecificSupplier: (id) => axios.get(`/suppliers/${id}`),
    postSupplier: (data) => axios.post('/suppliers', data),
    patchSupplier: (id, data) => axios.patch(`/suppliers/${id}`, data),
    deleteSupplier: (id) => axios.delete(`/suppliers/${id}`)
}

export const warehousesService = {
    getAllWarehouses: () => axios.get('/warehouses'),
    getSpecificWarehouse: (id) => axios.get(`/warehouses/${id}`),
    postWarehouse: (data) => axios.post('/warehouses', data),
    patchWarehouse: (id, data) => axios.patch(`/warehouses/${id}`, data),
    deleteWarehouse: (id) => axios.delete(`/warehouses/${id}`)
}

export const inventoriesService = {
    getAllInventories: () => axios.get('/inventories'),
    getSpecificInventory: (id) => axios.get(`/inventories/${id}`),
    postInventory: (data) => axios.post('/inventories', data),
    putInventory: (id, data) => axios.put(`/inventories/${id}`, data),  
    patchInventory: (id, data) => axios.patch(`/inventories/${id}`, data),
    deleteInventory: (id) => axios.delete(`/inventories/${id}`)
}