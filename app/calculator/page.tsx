"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calculator, TrendingUp, DollarSign, Home } from "lucide-react"
import { calculateAffordability } from "@/lib/affordability"

export default function CalculatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(50000)
  const [deposit, setDeposit] = useState(200000)
  const [interestRate, setInterestRate] = useState(11.75)

  const result = calculateAffordability({
    monthlyIncome,
    deposit,
    interestRate,
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/50">
        <div className="container py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">BuyAbility Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Calculate what you can afford with our SA-specific calculator including transfer duty, bond costs,
                levies, and rates.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Financial Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Monthly Household Income</Label>
                    <Input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      placeholder="50000"
                    />
                    <p className="text-xs text-muted-foreground">Gross income before deductions</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Deposit Amount</Label>
                    <Input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      placeholder="200000"
                    />
                    <p className="text-xs text-muted-foreground">Cash available for deposit</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Interest Rate: {interestRate}%</Label>
                    </div>
                    <Slider
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      min={8}
                      max={15}
                      step={0.25}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Current prime lending rate ~11.75%</p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>
                        Our calculator uses the 30% rule: your bond repayment should not exceed 30% of your gross
                        monthly income.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Card */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Home className="h-4 w-4" />
                        <span>Maximum Purchase Price</span>
                      </div>
                      <p className="text-4xl font-bold">{formatCurrency(result.maxPurchasePrice)}</p>
                      <p className="text-sm opacity-90">Based on {result.affordabilityPercentage}% of your income</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Bond Repayment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyRepayment)}</p>
                    <p className="text-sm text-muted-foreground mt-1">For 20 years at {interestRate}% interest</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upfront Costs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deposit</span>
                      <span className="font-medium">{formatCurrency(result.deposit)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transfer Duty</span>
                      <span className="font-medium">{formatCurrency(result.transferDuty)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bond Registration</span>
                      <span className="font-medium">{formatCurrency(result.bondRegistration)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Conveyancing Fees</span>
                      <span className="font-medium">{formatCurrency(result.transferCosts)}</span>
                    </div>
                    <div className="pt-3 border-t flex justify-between font-semibold">
                      <span>Total Upfront</span>
                      <span className="text-primary">{formatCurrency(result.totalUpfrontCosts)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Don't Forget Additional Monthly Costs</h3>
                    <p className="text-sm text-muted-foreground">
                      Remember to budget for levies (R1,500 - R4,000), rates (R1,000 - R3,000), homeowner's insurance
                      (R800 - R1,500), and utilities. These can add R3,000 - R8,000+ to your monthly expenses.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button size="lg" asChild>
                <a href="/properties">Browse Properties</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
