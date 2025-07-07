import { Product } from "@/models/entities";
import { appApi } from "../appApi";
import { IndexParams, Paginated } from "../types";

const storeApi = appApi.enhanceEndpoints({
  addTagTypes: ['Store']
}).injectEndpoints({
  endpoints: (build) => ({
    getCatalog: build.query<Paginated<Product>, IndexParams<{}>>({
      query: (params) => ({
        url: '/store',
        params
      }),
      providesTags: ['Store']
    })
  })
})

export const {
  useGetCatalogQuery
} = storeApi