export const saveToken   = (t: string) => typeof window !== 'undefined' && localStorage.setItem('qash_token', t)
export const getToken    = ()           => typeof window !== 'undefined' ? localStorage.getItem('qash_token') : null
export const removeToken = ()           => typeof window !== 'undefined' && localStorage.removeItem('qash_token')
