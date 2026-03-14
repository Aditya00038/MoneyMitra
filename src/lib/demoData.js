export function formatINR(value) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
      value,
    )
  } catch {
    return `₹${value}`
  }
}
