"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export function BuyAbilityInline() {
  const [income, setIncome] = useState(35000)
  const [deposit, setDeposit] = useState(100000)
  const [rate, setRate] = useState(11.75) // Prime rate default
  const [term, setTerm] = useState(20)

  // Simple calculation logic (placeholder)
  const interestRate = rate / 100 / 12
  const numberOfPayments = term * 12
  
  // Rule of thumb: max repayment is 30% of gross income
  const maxRepayment = income * 0.30

  // PV = PMT * (1 - (1 + r)^-n) / r
  const loanAmount = maxRepayment * (1 - Math.pow(1 + interestRate, -numberOfPayments)) / interestRate
  const targetPrice = loanAmount + deposit

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <Card className="w-full bg-slate-50 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          BuyAbility™ Calculator
        </CardTitle>
        <CardDescription>
          Estimate your affordability and filter homes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="income">Gross Monthly Income</Label>
            <Input 
              id="income" 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deposit">Deposit Available</Label>
            <Input 
              id="deposit" 
              type="number" 
              value={deposit} 
              onChange={(e) => setDeposit(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rate">Interest Rate (%)</Label>
            <Input 
              id="rate" 
              type="number" 
              step="0.25"
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Loan Term (Years)</Label>
            <Select value={term.toString()} onValueChange={(val) => setTerm(Number(val))}>
              <SelectTrigger id="term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 Years</SelectItem>
                <SelectItem value="30">30 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Estimated Target Price</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(targetPrice)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Est. Monthly Repayment</span>
            <span className="font-medium">{formatCurrency(maxRepayment)}</span>
          </div>
        </div>

        <Button className="w-full" variant="secondary">
          Filter to Affordable Homes
        </Button>
      </CardContent>
    </Card>
  )
}
