import { NextResponse } from 'next/server';
import openApiSpec from '@/data/dev-doc/openapi.json';

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
