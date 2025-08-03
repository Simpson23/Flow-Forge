'use client';

export function TestCheckout() {
  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Failed to redirect to Stripe checkout');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={handleCheckout} className="bg-black text-white px-6 py-3 rounded">
        Test Stripe Checkout
      </button>
    </div>
  );
}
