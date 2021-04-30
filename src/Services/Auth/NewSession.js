import api from '@/Services'

export default async ({ email, password }) => {
  const response = await api.post('auth/sign_in', { email, password })
  return response.data
}
