'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal, Code2 } from 'lucide-react';

interface SdkSnippet {
  language: string;
  label: string;
  code: string;
}

interface SdkSelectorProps {
  title?: string;
  snippets?: SdkSnippet[];
}

const defaultSnippets: SdkSnippet[] = [
  {
    language: 'bash',
    label: 'cURL',
    code: `curl -X POST https://api.addispay.et/api/v1/payments/checkout \\
  -H "Authorization: Bearer sk_test_7f9a8b1c2d3e4f5a" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: idemp_99210" \\
  -d '{
    "amount": 1500.00,
    "currency": "ETB",
    "orderId": "ORD-2026-88219",
    "description": "E-Commerce Purchase: 2 items",
    "returnUrl": "https://merchant.et/checkout/success",
    "customer": {
      "name": "Almaz Bekele",
      "phoneNumber": "+251911223344",
      "email": "almaz@example.et"
    }
  }'`,
  },
  {
    language: 'typescript',
    label: 'Node.js (TS)',
    code: `import { AddisPayClient } from '@addispay/node';

const addispay = new AddisPayClient({
  apiKey: process.env.ADDISPAY_SECRET_KEY,
  environment: 'sandbox', // or 'production'
});

const session = await addispay.checkout.create({
  amount: 1500.00,
  currency: 'ETB',
  orderId: 'ORD-2026-88219',
  description: 'E-Commerce Purchase: 2 items',
  returnUrl: 'https://merchant.et/checkout/success',
  customer: {
    name: 'Almaz Bekele',
    phoneNumber: '+251911223344',
    email: 'almaz@example.et',
  },
});

console.log('Redirect customer to:', session.checkoutUrl);`,
  },
  {
    language: 'python',
    label: 'Python',
    code: `import os
from addispay import AddisPay

client = AddisPay(
    api_key=os.environ.get("ADDISPAY_SECRET_KEY"),
    environment="sandbox"
)

session = client.checkout.create(
    amount=1500.00,
    currency="ETB",
    order_id="ORD-2026-88219",
    description="E-Commerce Purchase: 2 items",
    return_url="https://merchant.et/checkout/success",
    customer={
        "name": "Almaz Bekele",
        "phone_number": "+251911223344",
        "email": "almaz@example.et"
    }
)

print(f"Customer Checkout URL: {session.checkout_url}")`,
  },
  {
    language: 'go',
    label: 'Go',
    code: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/addispay/addispay-go"
)

func main() {
	client := addispay.NewClient(
		os.Getenv("ADDISPAY_SECRET_KEY"),
		addispay.WithSandbox(),
	)

	session, err := client.Checkout.Create(context.Background(), &addispay.CheckoutParams{
		Amount:      1500.00,
		Currency:    "ETB",
		OrderID:     "ORD-2026-88219",
		Description: "E-Commerce Purchase: 2 items",
		ReturnURL:   "https://merchant.et/checkout/success",
		Customer: addispay.Customer{
			Name:        "Almaz Bekele",
			PhoneNumber: "+251911223344",
			Email:       "almaz@example.et",
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("Checkout URL: %s\\n", session.CheckoutURL)
}`,
  },
  {
    language: 'php',
    label: 'PHP (Laravel)',
    code: `use AddisPay\\Laravel\\Facades\\AddisPay;

$session = AddisPay::checkout()->create([
    'amount'      => 1500.00,
    'currency'    => 'ETB',
    'orderId'     => 'ORD-2026-88219',
    'description' => 'E-Commerce Purchase: 2 items',
    'returnUrl'   => route('checkout.success'),
    'customer'    => [
        'name'        => 'Almaz Bekele',
        'phoneNumber' => '+251911223344',
        'email'       => 'almaz@example.et',
    ],
]);

return redirect($session->checkoutUrl);`,
  },
  {
    language: 'dart',
    label: 'Flutter (Dart)',
    code: `import 'package:addispay_flutter/addispay_flutter.dart';

final session = await AddisPay.instance.startCheckout(
  context: context,
  amount: 1500.00,
  currency: AddisPayCurrency.etb,
  orderId: 'ORD-2026-88219',
  onSuccess: (result) {
    print('Payment successful: \${result.transactionId}');
  },
  onError: (error) {
    print('Payment failed: \${error.message}');
  },
);`,
  },
];

export function SdkSelector({ title = 'SDK & cURL Integration', snippets = defaultSnippets }: SdkSelectorProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentSnippet = snippets[activeTab] || snippets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 font-mono text-xs shadow-md dark:border-gray-800">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-800 bg-gray-900/90 px-3 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {snippets.map((snip, index) => (
            <button
              key={snip.label}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === index
                  ? 'bg-[#00A36D] text-white shadow-sm'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              {snip.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container */}
      <div className="max-h-96 overflow-auto p-4 text-gray-100">
        <pre className="leading-relaxed">
          <code>{currentSnippet.code}</code>
        </pre>
      </div>
    </div>
  );
}
