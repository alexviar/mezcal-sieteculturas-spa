import { appApi } from "../appApi";

const homeApi = appApi.enhanceEndpoints({
  addTagTypes: ['Dashboard']
}).injectEndpoints({
  endpoints: (build)=>({
    getHomeData: build.query<any, void>({
      query: ()=>({
        url: '/dashboard'
      }),
      providesTags: ['Dashboard']
    })
  })
})

export const {
  useGetHomeDataQuery
} = homeApi