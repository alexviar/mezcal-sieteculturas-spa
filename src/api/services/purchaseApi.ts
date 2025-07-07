import { appApi } from "../appApi";
import { IndexParams, Paginated } from "../types";
import { keysToCamel } from "../utils";

export type PurchaseData = {
  id: number
  date: string
  value: number
  shippingFee: number
  shippingDate: string | null
  shipped: boolean
  customerName: string
  customerMail: string
  customerAddress: string
  customerState: string
  customerCity: string
  customerZip: string
  customerPhone: string
  paymentType: string
  paymentMethod?: string
  items: {
    productId: number
    quantity: number
  }[]
}

type PurchaseResponse = {
  clientSecret?: string
}

export type PurchaseWithProduct = PurchaseData & {
  product: {
    name: string
  }
}

export type PurchaseFilter = Partial<{
  status: string
}>

const purchaseApi = appApi.enhanceEndpoints({
  addTagTypes: ['Purchases']
}).injectEndpoints({
  endpoints: (build) => ({
    getPurchases: build.query<Paginated<PurchaseWithProduct>, IndexParams<PurchaseFilter>>({
      query: (params) => ({
        url: 'purchases',
        params
      }),
      providesTags: ['Purchases']
    }),

    makePurchase: build.mutation<PurchaseResponse, Omit<PurchaseData, 'id' | 'date' | 'shippingFee' | 'shippingDate' | 'shipped'>>({
      query: (body) => ({
        method: 'POST',
        url: '/purchases',
        body,
      })
    }),

    updatePurchase: build.mutation<PurchaseResponse, Pick<PurchaseData, 'id' | 'shipped' | 'shippingDate' | 'items'>>({
      query: ({ id, ...body }) => ({
        method: 'PUT',
        url: '/purchases/' + id,
        body,
      }),
      invalidatesTags: (result) => result !== undefined ? ['Purchases'] : []
    }),

    downloadPurchase: build.mutation({
      queryFn: async ({ id, onDownloaded }, _, __, baseQuery) => {
        try {
          const result = await baseQuery({
            url: `/purchases/${id}/download`,
            responseHandler: async (response: any) => {
              if (response.ok) {
                onDownloaded(await response.blob())
                return null
              }
              return response.json()
            },
          })
          result.error = keysToCamel(result.error)
          return result
        }
        catch (error) {
          return { error: error as any }
        }
      },
    }),
  })
})

export const {
  useGetPurchasesQuery,
  useMakePurchaseMutation,
  useUpdatePurchaseMutation,
  useDownloadPurchaseMutation
} = purchaseApi