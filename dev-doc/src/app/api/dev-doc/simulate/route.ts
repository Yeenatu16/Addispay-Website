import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { endpoint, method = 'POST', payload = {} } = body;

    // Simulate realistic network latency (120ms - 280ms)
    await new Promise((resolve) => setTimeout(resolve, 180));

    const now = new Date().toISOString();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const txnId = `TXN_ETB_${Date.now().toString().slice(-8)}_${randomSuffix}`;

    // Normalize endpoint path
    const normalized = (endpoint || '').toLowerCase().trim();

    // 1. Checkout Session Creation
    if (normalized.includes('checkout') || normalized === '/payments/checkout') {
      const amount = Number(payload.amount) || 1500.0;
      const currency = payload.currency || 'ETB';
      const orderId = payload.orderId || `ORD-2026-${randomSuffix}`;
      const sessionId = `chk_sess_${Buffer.from(txnId).toString('hex').slice(0, 24)}`;

      return NextResponse.json(
        {
          status: 'SUCCESS',
          code: 200,
          message: 'Checkout session created successfully',
          data: {
            sessionId,
            checkoutUrl: `https://checkout.addispay.et/pay/${sessionId}`,
            transactionId: txnId,
            orderId,
            amount,
            currency,
            status: 'PENDING',
            availableMethods: ['TELEBIRR', 'CBE_BIRR', 'AWASH_PAY', 'AMOLE_DASHEN', 'ETHSWITCH_CARD', 'VISA_MASTERCARD'],
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            createdAt: now,
          },
        },
        { status: 200 }
      );
    }

    // 2. Direct Charge (USSD Push / Wallet Prompt)
    if (normalized.includes('direct-charge') || normalized === '/payments/direct-charge') {
      const paymentMethod = payload.paymentMethod || 'TELEBIRR_USSD';
      const customerPhone = payload.customerPhone || '+251911223344';
      const amount = Number(payload.amount) || 500.0;

      let promptMessage = `USSD STK Push prompt sent to ${customerPhone}. Awaiting customer PIN authorization.`;
      if (paymentMethod === 'CBE_BIRR') {
        promptMessage = `CBE Birr push notification sent to ${customerPhone}. Confirmation pending.`;
      } else if (paymentMethod === 'AWASH_PAY') {
        promptMessage = `Awash Birr debit request dispatched to ${customerPhone}.`;
      }

      return NextResponse.json(
        {
          status: 'SUCCESS',
          code: 200,
          message: 'Direct payment request initiated',
          data: {
            transactionId: txnId,
            orderId: payload.orderId || `DIR-${randomSuffix}`,
            amount,
            currency: 'ETB',
            paymentMethod,
            customerPhone,
            status: 'PENDING_PIN_ENTRY',
            promptMessage,
            pollingUrl: `/api/v1/payments/${txnId}/status`,
            expiresInSeconds: 180,
            initiatedAt: now,
          },
        },
        { status: 200 }
      );
    }

    // 3. Dynamic QR Code Generation (EthQR Standard)
    if (normalized.includes('qr') || normalized === '/payments/qr/generate') {
      const amount = Number(payload.amount) || 450.0;
      const orderId = payload.orderId || `QR-${randomSuffix}`;
      const storeName = payload.storeName || 'AddisPay Merchant Store';
      
      const emvPayload = `00020101021226580010ET.ETHIO.ETHQR0116ADDISPAY${randomSuffix}020477215204581453032305406${amount.toFixed(2)}5802ET59${storeName.length < 10 ? '0' + storeName.length : storeName.length}${storeName}6011Addis Ababa6304${randomSuffix.toString().slice(0, 4)}`;

      return NextResponse.json(
        {
          status: 'SUCCESS',
          code: 200,
          message: 'Dynamic EthQR generated',
          data: {
            transactionId: txnId,
            orderId,
            amount,
            currency: 'ETB',
            storeName,
            qrString: emvPayload,
            qrCodeDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FFFFFF"/><rect x="10" y="10" width="30" height="30" fill="%2300A36D"/><rect x="60" y="10" width="30" height="30" fill="%2300A36D"/><rect x="10" y="60" width="30" height="30" fill="%2300A36D"/><rect x="45" y="45" width="10" height="10" fill="%23F5A414"/></svg>`,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            status: 'ACTIVE_AWAITING_SCAN',
          },
        },
        { status: 200 }
      );
    }

    // 4. Payment Verification Status
    if (normalized.includes('status') || normalized.includes('verification')) {
      const queryTxn = payload.transactionId || txnId;
      return NextResponse.json(
        {
          status: 'SUCCESS',
          code: 200,
          data: {
            transactionId: queryTxn,
            orderId: payload.orderId || `ORD-2026-${randomSuffix}`,
            amount: 1500.0,
            currency: 'ETB',
            fee: 15.0,
            netAmount: 1485.0,
            status: 'COMPLETED',
            paymentMethod: 'TELEBIRR',
            payerPhone: '+251911223344',
            rrn: `AP${Date.now().toString().slice(-8)}`,
            stan: `${randomSuffix}`,
            settlementStatus: 'SETTLED_T0',
            completedAt: now,
          },
        },
        { status: 200 }
      );
    }

    // 5. Refunds
    if (normalized.includes('refund')) {
      return NextResponse.json(
        {
          status: 'SUCCESS',
          code: 200,
          message: 'Refund executed successfully',
          data: {
            refundId: `REF_${randomSuffix}`,
            originalTransactionId: payload.transactionId || txnId,
            amount: Number(payload.amount) || 1500.0,
            currency: 'ETB',
            status: 'COMPLETED',
            reason: payload.reason || 'Customer request refund',
            refundedAt: now,
          },
        },
        { status: 200 }
      );
    }

    // 6. Balances
    if (normalized.includes('balance')) {
      return NextResponse.json(
        {
          status: 'SUCCESS',
          code: 200,
          data: {
            merchantId: 'MCH-ADDIS-8821',
            etb: {
              available: 489250.75,
              pendingSettlement: 15400.0,
              currency: 'ETB',
            },
            usd: {
              available: 18450.0,
              pendingSettlement: 1200.0,
              currency: 'USD',
            },
            lastSettlementDate: '2026-08-27T16:00:00Z',
          },
        },
        { status: 200 }
      );
    }

    // 7. SoftPOS Contactless Authorization
    if (normalized.includes('softpos') || normalized.includes('terminal')) {
      return NextResponse.json(
        {
          status: 'SUCCESS',
          code: 200,
          message: 'Contactless EMV tap processed',
          data: {
            authCode: `AP${randomSuffix.toString().slice(0, 6)}`,
            rrn: `20260827${randomSuffix}`,
            terminalId: payload.terminalId || 'TERM-SPOS-0084',
            cardMask: '4111********1111',
            cardBrand: 'VISA_CONTACTLESS',
            amount: Number(payload.amount) || 890.0,
            currency: 'ETB',
            status: 'APPROVED',
            stan: `${randomSuffix}`,
            timestamp: now,
          },
        },
        { status: 200 }
      );
    }

    // Fallback Generic Mock Response
    return NextResponse.json(
      {
        status: 'SUCCESS',
        code: 200,
        message: 'AddisPay Sandbox Simulator executed request',
        data: {
          endpoint: normalized,
          method,
          transactionId: txnId,
          receivedPayload: payload,
          timestamp: now,
          sandboxNotice: 'This is simulated output from AddisPay Sandbox Dev-Doc Engine.',
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'ERROR',
        code: 500,
        message: err.message || 'Internal simulation error',
      },
      { status: 500 }
    );
  }
}
