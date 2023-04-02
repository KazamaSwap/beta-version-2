export const getDisplayApr = (kazamaRewardsApr?: number, lpRewardsApr?: number) => {
  if (kazamaRewardsApr && lpRewardsApr) {
    return (kazamaRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (kazamaRewardsApr) {
    return kazamaRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
