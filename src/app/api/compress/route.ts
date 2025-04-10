import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File is not a PDF' }, { status: 400 });
    }
    
    // In a real implementation, this would call your Google Colab API
    // For now, we'll create a proxy that forwards the request
    
    const colabApiUrl = `${process.env.COLAB_API_URL}/compress` || 'http://localhost:5000/compress';
    
    // Forward the file to Colab
    const colabFormData = new FormData();
    colabFormData.append('file', file);
    
    const colabResponse = await fetch(colabApiUrl, {
      method: 'POST',
      body: colabFormData,
    });
    console.log(colabApiUrl, colabResponse);
    if (!colabResponse.ok) {
      const errorData = await colabResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Compression failed' }, 
        { status: colabResponse.status }
      );
    }
    
    const compressionResult = await colabResponse.json();
    
    return NextResponse.json(compressionResult);
  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json(
      { error: 'An error occurred during compression' }, 
      { status: 500 }
    );
  }
}