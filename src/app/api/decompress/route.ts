import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { compressed_data } = await request.json();
    
    if (!compressed_data) {
      return NextResponse.json({ error: 'No compressed data provided' }, { status: 400 });
    }
    
    // In a real implementation, this would call your Google Colab API
    // For now, we'll create a proxy that forwards the request
    
    const colabApiUrl = `${process.env.COLAB_API_URL}/decompress` || 'http://localhost:5000/decompress';
    
    const colabResponse = await fetch(colabApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ compressed_data }),
    });
    
    if (!colabResponse.ok) {
      const errorData = await colabResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Decompression failed' }, 
        { status: colabResponse.status }
      );
    }
    
    const decompressionResult = await colabResponse.json();
    
    return NextResponse.json(decompressionResult);
  } catch (error) {
    console.error('Decompression error:', error);
    return NextResponse.json(
      { error: 'An error occurred during decompression' }, 
      { status: 500 }
    );
  }
}
