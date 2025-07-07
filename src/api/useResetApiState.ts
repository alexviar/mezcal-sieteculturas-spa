import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { appApi } from "./appApi"

export function useResetApiState() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(appApi.util.resetApiState())
  }, [dispatch])
}