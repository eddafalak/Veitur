/**
 * Demo bridge: greiðendur orkumæla filled in Nytenging umsókn are shown in Stöðuyfirlit
 * for the same heimilisfang (sessionStorage).
 */
const STORAGE_KEY = 'veitur-greidendur-orkumaela-v1'

/** Row ids match GreidendurStepContent / GREID_METER_ROWS order (m1…m4 ↔ Stöðuyfirlit table rows). */
export const GREID_ORKU_MAELI_ROW_IDS = ['m1', 'm2', 'm3', 'm4']

export function normalizeUmsoknAddressKey(address) {
  return String(address ?? '')
    .trim()
    .toLowerCase()
}

export function saveGreidendurOrkumaelaDraft(address, meterPayersById) {
  try {
    const all = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
    all[normalizeUmsoknAddressKey(address)] = meterPayersById
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    /* ignore quota / private mode */
  }
}

export function readGreidendurOrkumaelaDraft(address) {
  try {
    const all = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
    return all[normalizeUmsoknAddressKey(address)] ?? null
  } catch {
    return null
  }
}
