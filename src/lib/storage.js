const KEY = 'moneymitra_profile_v1'
const WALLET_KEY = 'moneymitra_wallet_v1'

export function getProfile() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setProfile(profile) {
  localStorage.setItem(KEY, JSON.stringify(profile))
}

export function getWallet() {
  try {
    const raw = localStorage.getItem(WALLET_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setWallet(wallet) {
  localStorage.setItem(WALLET_KEY, JSON.stringify(wallet))
}

