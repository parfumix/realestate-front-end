<template>
  <div class="container">
    <h1>Mortgage Loan Calculator</h1>
    <form @submit.prevent="calculateMortgage">
      <div class="input-group">
        <label for="loanAmount">Loan Amount</label>
        <input type="number" v-model="loanAmount" id="loanAmount" required />
      </div>

      <div class="input-group">
        <label for="interestRate">Annual Interest Rate (%)</label>
        <input type="number" v-model="interestRate" id="interestRate" required />
      </div>

      <div class="input-group">
        <label for="loanTerm">Loan Term (Years)</label>
        <input type="number" v-model="loanTerm" id="loanTerm" required />
      </div>

      <button type="submit">Calculate</button>
    </form>

    <div v-if="monthlyPayment !== null" class="result">
      <h2>Monthly Payment: {{ formatCurrency(monthlyPayment) }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loanAmount = ref(0)
const interestRate = ref(0)
const loanTerm = ref(0)
const monthlyPayment = ref(null)

const calculateMortgage = () => {
  const principal = parseFloat(loanAmount.value)
  const interest = parseFloat(interestRate.value) / 100 / 12
  const payments = parseInt(loanTerm.value) * 12

  if (interest === 0) {
    monthlyPayment.value = principal / payments
  } else {
    const x = Math.pow(1 + interest, payments)
    monthlyPayment.value = (principal * x * interest) / (x - 1)
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.result {
  margin-top: 20px;
}
</style>
