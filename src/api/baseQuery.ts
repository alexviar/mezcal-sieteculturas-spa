import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import Qs from 'qs'
import { keysToUnderscore } from "./utils"

export const apiUrl = process.env.NEXT_PUBLIC_API

export const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: async (headers, { getState }) => {
    const { user: { token } } = getState() as { user: { token: string } }
    headers.set("Accept", "application/json")
    headers.set("Authorization", "Bearer " + token)
    return headers
  },
  paramsSerializer: params => {
    return Qs.stringify(keysToUnderscore(params), {
      arrayFormat: "brackets",
      encode: false,
      filter: (_, value) => {
        if (typeof value === "boolean") {
          return value ? 1 : 0
        }
        if (value === "") return undefined
        return value
      }
    });
  }
})