import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const {
      targetUrl,
      eventType = 'payment.successful',
      secretKey = 'whsec_test_7f9a8b1c2d3e4f5a6b7c8d9e0f',
      customPayload,
    } = await req.json().catch(() => ({}));

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json(
        {
          status: 'ERROR',
          code: 400,
          message: 'Missing or invalid targetUrl parameter',
        },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const txnId = `TXN_ETB_${Date.now()}_88219`;

    // Construct event payload
    const eventBody =
      customPayload ||
      {
        id: eventId,
        event: eventType,
        apiVersion: '2026-08-01',
        createdAt: new Date().toISOString(),
        data: {
          transactionId: txnId,
          orderId: 'ORD-2026-99201',
          amount: 2500.0,
          currency: 'ETB',
          status: eventType.includes('failed') ? 'FAILED' : 'COMPLETED',
          paymentMethod: 'TELEBIRR',
          customer: {
            name: 'Abebe Bikila',
            phone: '+251911002233',
            email: 'abebe@example.et',
          },
          metadata: {
            storeId: 'BOLE_STORE_1',
            cashier: 'usr_882',
          },
        },
      };

    const payloadString = JSON.stringify(eventBody);
    const signaturePayload = `${timestamp}.${payloadString}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(signaturePayload)
      .digest('hex');

    const signatureHeader = `t=${timestamp},v1=${signature}`;

    const startTime = Date.now();
    let deliveryStatus = 'UNKNOWN';
    let statusCode = 0;
    let responseText = '';
    let errorDetail = null;

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AddisPay-Webhook-Dispatcher/1.0',
          'X-AddisPay-Signature': signatureHeader,
          'X-AddisPay-Event-Id': eventId,
          'X-AddisPay-Event-Type': eventType,
        },
        body: payloadString,
        signal: AbortSignal.timeout(6000), // 6-second timeout
      });

      statusCode = response.status;
      deliveryStatus = response.ok ? 'DELIVERED_SUCCESS' : 'DELIVERED_HTTP_ERROR';
      responseText = await response.text().catch(() => '');
      if (responseText.length > 500) {
        responseText = responseText.substring(0, 500) + '... (truncated)';
      }
    } catch (err: any) {
      deliveryStatus = 'FAILED_NETWORK_ERROR';
      errorDetail = err.message || 'Connection refused or timed out';
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'SUCCESS',
      delivery: {
        targetUrl,
        eventType,
        eventId,
        deliveryStatus,
        statusCode,
        durationMs,
        signatureHeader,
        responseSnippet: responseText || null,
        errorDetail,
        payloadSent: eventBody,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'ERROR',
        code: 500,
        message: err.message || 'Webhook dispatcher failure',
      },
      { status: 500 }
    );
  }
}
