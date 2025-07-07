import { createApi, retry } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import { keysToCamel, keysToUnderscore } from './utils'

const staggeredBaseQuery = retry<typeof baseQuery>((async (args, api, extraOptions) => {
  if (typeof args === 'string') {
    args = {
      url: args,
    }
  }
  if (args.body && !(args.body instanceof FormData)) args.body = keysToUnderscore(args.body)

  const result = await baseQuery(args, api, extraOptions)

  result.data = keysToCamel(result.data)
  result.error = keysToCamel(result.error)

  if (result.error && result.meta?.request.method !== 'GET') {
    retry.fail(result.error)
  }

  const status = result.error?.status
  if (typeof status === 'number') {
    retry.fail(result.error)
  }

  return result

}) as typeof baseQuery, {
  maxRetries: 1,
})

export const appApi = createApi({
  baseQuery: staggeredBaseQuery,
  endpoints: () => ({}),
  keepUnusedDataFor: 60 * 60 * 24,
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
})
