'use client'

import { useState } from 'react'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async (plan: string) => {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Checkout failed')
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-8">Choose a Plan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Free</h2>
          <p className="mb-6 text-gray-600">Basic workflow generation</p>
          <button className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed" disabled>
            Current Plan
          </button>
        </div>

        {/* Starter Plan */}
        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Starter</h2>
          <p className="mb-6 text-gray-600">£19/month – More workflows & history</p>
          <button
            onClick={() => handleCheckout('starter')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Choose Starter'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Pro</h2>
          <p className="mb-6 text-gray-600">£39/month – Unlimited access</p>
          <button
            onClick={() => handleCheckout('pro')}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Choose Pro'}
          </button>
        </div>
      </div>
    </div>
  )
}
