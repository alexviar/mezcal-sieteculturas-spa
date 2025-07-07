import { UserType } from "@/models/entities";
import { appApi } from "../appApi";
import { logout } from "@/models/redux/user";

type LoginResponse = {
  token: string
  user: UserType
}

type LoginCredentials = {
  email: string
  password: string
}

export const authApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginCredentials>({
      query: (body) => ({
        method: 'POST',
        url: '/auth/login',
        body
      })
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        method: 'POST',
        url: '/auth/logout'
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try{
          await queryFulfilled
          dispatch(logout())
        }catch{}
      }
    })
  })
})

export const {
  useLoginMutation,
  useLogoutMutation
} = authApi