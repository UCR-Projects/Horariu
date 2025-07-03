export const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
  const cookies: Record<string, string> = {}
  if (!cookieHeader) return cookies

  cookieHeader.split(';').forEach(cookie => {
    const [key, value] = cookie.split('=').map(part => part.trim())
    if (key && value) {
      cookies[key] = value
    }
  })

  return cookies
}

export const setCookie = (name: string, value: string, options: Record<string, string | number | boolean>): string => {
  const cookieParts = [`${name}=${value}`]

  if (options.HttpOnly) cookieParts.push('HttpOnly')
  if (options.Secure) cookieParts.push('Secure')
  if (options.MaxAge) cookieParts.push(`Max-Age=${options.MaxAge}`)
  if (options.Path) cookieParts.push(`Path=${options.Path}`)

  return cookieParts.join('; ')
}
