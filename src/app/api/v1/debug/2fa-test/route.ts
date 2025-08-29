import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;
    
    if (!secret) {
      return NextResponse.json({ error: 'Secret is required' }, { status: 400 });
    }
    
    // Generate current token
    const currentToken = speakeasy.totp({
      secret: secret,
      encoding: 'base32'
    });
    
    // Generate tokens for the last 2 and next 2 time steps
    const tokens = [];
    for (let i = -2; i <= 2; i++) {
      const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        step: i
      });
      tokens.push({
        step: i,
        token: token,
        isCurrent: i === 0
      });
    }
    
    return NextResponse.json({
      success: true,
      currentToken,
      validTokens: tokens,
      secret: secret,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug 2FA test error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
