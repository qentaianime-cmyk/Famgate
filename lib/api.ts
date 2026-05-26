import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_URL!

export const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('famsaas_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('famsaas_token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; display_name: string }) =>
    api.post('/auth.php?action=register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth.php?action=login', data),
}

// ── Profile ───────────────────────────────────────────────────────
export const meApi = {
  get: () => api.get('/me.php'),
  updateName: (display_name: string) => api.post('/me.php', { display_name }),
  uploadAvatar: (image: string) => api.post('/upload-avatar.php', { image }),
}

// ── Dashboard ─────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => api.get('/dashboard-stats.php'),
}

// ── Transactions ──────────────────────────────────────────────────
export const transactionsApi = {
  list: (params: { page?: number; limit?: number; status?: string; search?: string }) =>
    api.get('/transactions.php', { params }),
}

// ── Settings ──────────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get('/settings.php'),
  save: (data: {
    upi_id?: string
    gmail_user?: string
    gmail_app_password?: string
    webhook_url?: string
  }) => api.post('/settings.php', { action: 'save', ...data }),
  regenKeys: () => api.post('/settings.php', { action: 'regen_keys' }),
}
