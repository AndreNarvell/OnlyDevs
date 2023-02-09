import { Profile } from "../types/Profile"
import { fetcher } from "../utils/fetcher"
import useSWR from "swr"

export const useUser = () => {
  const {
    data: profile,
    error,
    isLoading,
  } = useSWR<Profile>("/api/me", fetcher)

  return {
    profile,
    error,
    isLoading,
  }
}
