import axios from 'axios'
const BASE = process.env.NEXT_PUBLIC_API_URL!

export const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } })
export const googleAuthApi = {
  getUrl: () => api.get('/google-auth.php'),
}
api.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('qash_token')
    if (t) cfg.headers.Authorization = `Bearer ${t}`
  }
  return cfg
})
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('qash_token')
    window.location.href = '/auth/login'
  }
  return Promise.reject(err)
})

export const authApi = {
  register: (d: { email:string; password:string; display_name:string }) => api.post('/auth.php?action=register', d),
  login:    (d: { email:string; password:string })                        => api.post('/auth.php?action=login',    d),
}
export const meApi = {
  get:          ()      => api.get('/me.php'),
  updateName:   (n:string) => api.post('/me.php', { display_name: n }),
  uploadAvatar: (img:string) => api.post('/upload-avatar.php', { image: img }),
}
export const settingsApi = {
  get:      ()    => api.get('/settings.php'),
  save:     (d:any) => api.post('/settings.php', { action:'save', ...d }),
  regenKeys:()    => api.post('/settings.php', { action:'regen_keys' }),
}
export const dashboardApi    = { stats: () => api.get('/dashboard-stats.php') }
export const transactionsApi = {
  list: (p:{ page?:number; limit?:number; status?:string; search?:string }) => api.get('/transactions.php', { params:p }),
}
