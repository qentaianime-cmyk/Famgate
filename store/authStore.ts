import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  merchantId: string | null
  displayName: string | null
  avatarUrl: string | null
  requiresSetup: boolean
  setAuth: (data: {
    token: string
    merchant_id: string
    display_name?: string
    avatar_url?: string
    requires_setup?: boolean
  }) => void
  setAvatar: (url: string) => void
  setDisplayName: (name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      merchantId: null,
      displayName: null,
      avatarUrl: null,
      requiresSetup: true,

      setAuth: (data) =>
        set({
          token: data.token,
          merchantId: data.merchant_id,
          displayName: data.display_name ?? null,
          avatarUrl: data.avatar_url ?? null,
          requiresSetup: data.requires_setup ?? true,
        }),

      setAvatar: (url) => set({ avatarUrl: url }),
      setDisplayName: (name) => set({ displayName: name }),

      logout: () =>
        set({
          token: null,
          merchantId: null,
          displayName: null,
          avatarUrl: null,
          requiresSetup: true,
        }),
    }),
    {
      name: 'famsaas-auth',
      partialize: (s)  => ({
        token: s.token,
        merchantId: s.merchantId,
        displayName: s.displayName,
        avatarUrl: s.avatarUrl,
        requiresSetup: s.requiresSetup,
      }),
    }
  )
)
