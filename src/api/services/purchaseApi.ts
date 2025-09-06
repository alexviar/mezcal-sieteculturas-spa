import { appApi } from "../appApi";
import { IndexParams, Paginated } from "../types";

export type PurchaseData = {
  id: number
  date: string
  value: number
  shippingFee: number
  shippingDate: string | null
  shipped: boolean
  paid: boolean
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
  status: string
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

    makePurchase: build.mutation<PurchaseResponse, Omit<PurchaseData, 'id' | 'date' | 'shippingFee' | 'shippingDate' | 'shipped' | 'paid'>>({
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

    generatePurchaseReceipt: build.mutation<{ downloadUrl: string }, number>({
      query: (id) => ({
        method: 'GET',
        url: `/purchases/${id}/download`,
      }),
    }),
  })
})

export const {
  useGetPurchasesQuery,
  useMakePurchaseMutation,
  useUpdatePurchaseMutation,
  useGeneratePurchaseReceiptMutation
} = purchaseApi