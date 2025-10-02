function validateEnv(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url) {
    throw new Error(
      'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
      'Please add it to your .env.local file'
    )
  }

  if (!key) {
    throw new Error(
      'Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\n' +
      'Please add it to your .env.local file'
    )
  }

  if (!url.startsWith('http')) {
    throw new Error(
      'Invalid NEXT_PUBLIC_SUPABASE_URL: Must be a valid URL starting with http:// or https://'
    )
  }

  return { url, key }
}

const env = validateEnv()

export const SUPABASE_URL = env.url
export const SUPABASE_ANON_KEY = env.key
