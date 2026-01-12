// SA-specific affordability calculations
export interface AffordabilityInput {
  monthlyIncome: number
  deposit: number
  interestRate?: number // Annual rate, defaults to 11.75%
  termYears?: number // Defaults to 20 years
}

export interface AffordabilityResult {
  maxPurchasePrice: number
  monthlyRepayment: number
  deposit: number
  bondAmount: number
  transferDuty: number
  bondRegistration: number
  transferCosts: number
  totalUpfrontCosts: number
  monthlyLevyAndRates: number
  affordabilityPercentage: number
}

// Calculate transfer duty based on SA tax brackets (2024/2025)
export function calculateTransferDuty(propertyPrice: number): number {
  if (propertyPrice <= 1100000) return 0
  if (propertyPrice <= 1512500) return (propertyPrice - 1100000) * 0.03
  if (propertyPrice <= 2117500) return 12375 + (propertyPrice - 1512500) * 0.06
  if (propertyPrice <= 2722500) return 48675 + (propertyPrice - 2117500) * 0.08
  if (propertyPrice <= 12100000) return 97075 + (propertyPrice - 2722500) * 0.11
  return 1128600 + (propertyPrice - 12100000) * 0.13
}

// Estimate conveyancing and bond registration costs
export function estimateConveyancingCosts(propertyPrice: number): number {
  // Approximate attorney's fees
  const baseFee = 15000
  const percentageFee = propertyPrice * 0.01
  return Math.min(baseFee + percentageFee, 50000)
}

export function estimateBondRegistration(bondAmount: number): number {
  // Approximate bond registration costs
  const baseFee = 8000
  const percentageFee = bondAmount * 0.005
  return baseFee + percentageFee
}

// Calculate monthly bond repayment
export function calculateMonthlyRepayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 12 / 100
  const numPayments = termYears * 12

  if (monthlyRate === 0) return principal / numPayments

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  )
}

// Main affordability calculator
export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const { monthlyIncome, deposit, interestRate = 11.75, termYears = 20 } = input

  // Rule: max 30% of gross income for bond repayment
  const maxMonthlyRepayment = monthlyIncome * 0.3

  // Calculate max bond amount based on monthly repayment
  const monthlyRate = interestRate / 12 / 100
  const numPayments = termYears * 12
  const maxBondAmount =
    (maxMonthlyRepayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments))

  // Max purchase price
  const maxPurchasePrice = maxBondAmount + deposit

  // Calculate costs
  const transferDuty = calculateTransferDuty(maxPurchasePrice)
  const transferCosts = estimateConveyancingCosts(maxPurchasePrice)
  const bondRegistration = estimateBondRegistration(maxBondAmount)

  return {
    maxPurchasePrice,
    monthlyRepayment: maxMonthlyRepayment,
    deposit,
    bondAmount: maxBondAmount,
    transferDuty,
    bondRegistration,
    transferCosts,
    totalUpfrontCosts: deposit + transferDuty + bondRegistration + transferCosts,
    monthlyLevyAndRates: 0, // Will be added per property
    affordabilityPercentage: 30,
  }
}

// Check if property is affordable
export function canAffordProperty(
  propertyPrice: number,
  monthlyIncome: number,
  deposit: number,
  monthlyLevy = 0,
  monthlyRates = 0,
  interestRate = 11.75,
  termYears = 20,
): { affordable: boolean; monthlyPayment: number; incomePercentage: number } {
  const bondAmount = propertyPrice - deposit
  const monthlyRepayment = calculateMonthlyRepayment(bondAmount, interestRate, termYears)
  const totalMonthly = monthlyRepayment + monthlyLevy + monthlyRates
  const incomePercentage = (totalMonthly / monthlyIncome) * 100

  return {
    affordable: incomePercentage <= 30,
    monthlyPayment: totalMonthly,
    incomePercentage,
  }
}
