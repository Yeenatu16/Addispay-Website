import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const {
      secretKey = 'sk_test_51MzAddisPaySecurityKeySecret9921',
      timestamp = Math.floor(Date.now() / 1000).toString(),
      nonce = 'nonce_' + Math.random().toString(36).substring(2, 10),
      rawPayload = '{"amount":1500,"currency":"ETB","orderId":"ORD-88219"}',
    } = await req.json().catch(() => ({}));

    // Canonical string to sign
    const canonicalString = `${timestamp}.${nonce}.${typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload)}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(canonicalString)
      .digest('hex');

    const headerExample = `t=${timestamp},n=${nonce},v1=${signature}`;

    return NextResponse.json({
      status: 'SUCCESS',
      data: {
        canonicalString,
        signature,
        headerExample,
        algorithm: 'HMAC-SHA256',
        secretKeyMasked: secretKey.substring(0, 7) + '...' + secretKey.slice(-4),
        timestamp,
        nonce,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'ERROR',
        message: err.message || 'Signature calculation failed',
      },
      { status: 500 }
    );
  }
}
