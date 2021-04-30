import api from '@/Services'

export default async (email, password) => {
  const response = await api.post('auth/sign_in', { email, password })

  console.log('coucou', response.data)

  return response.data
}
