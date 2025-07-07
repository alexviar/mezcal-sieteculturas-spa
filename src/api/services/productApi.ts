import { Product } from "@/models/entities";
import { appApi } from "../appApi";
import { IndexParams, Paginated } from "../types";

type ProductFilter = {

}

const productApi = appApi.enhanceEndpoints({
  addTagTypes: ['Products']
}).injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Paginated<Product>, IndexParams<ProductFilter>>({
      query: (params) => ({
        url: '/products',
        params
      }),
      providesTags: (result) => {
        const tags = []
        if (result !== undefined) {
          result.data.forEach((product) => {
            tags.push({ type: 'Products' as const, id: `${product.id}` })
          })
          tags.push({ type: 'Products' as const, id: '*' })
        }
        return tags
      }
    }),

    createProduct: build.mutation<Product, Omit<Product, 'id'>>({
      query: (data) => {
        const formData = new FormData()
        formData.append("name", data.name);
        formData.append("presentation", data.presentation);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("shipping_value", String(data.shippingValue));
        formData.append("stock", String(data.stock));
        formData.append("status", data.status ? "1" : "0");
        if (data.images?.length > 0) {
          Array.from(data.images).forEach((image: any) => {
            formData.append("images[]", image);
          });
        }
        return {
          method: 'POST',
          url: '/products',
          body: formData
        }
      },
      invalidatesTags: (result) => result !== undefined ? [{ type: 'Products' }] : []
    }),

    updateProduct: build.mutation<Product, Product>({
      query: ({ id, ...data }) => {
        const formData = new FormData()
        formData.append("name", data.name);
        formData.append("presentation", data.presentation);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("shipping_value", String(data.shippingValue));
        formData.append("stock", String(data.stock));
        formData.append("status", data.status ? "1" : "0");
        if (data.images?.length > 0) {
          Array.from(data.images).forEach((image: any) => {
            formData.append("images[]", image);
          });
        }
        formData.append("_method", "PUT");
        return {
          method: 'POST',
          url: `/products/${id}`,
          body: formData
        }
      },
      invalidatesTags: (result) => result !== undefined ? [{ type: 'Products' }] : []
    })
  })
})

export const {
  useGetProductsQuery,

  useCreateProductMutation,
  useUpdateProductMutation
} = productApi