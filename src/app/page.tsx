export default function Home() {
  return (
    <main className="flex min-h-screen flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          GPU-Accelerated PDF Compression
        </h1>
        <p className="mt-6 text-xl text-gray-500">
          Compress PDF documents using efficient Huffman encoding accelerated with CUDA on GPUs
        </p>
        <div className="mt-10 flex justify-center">
          <div className="rounded-md shadow">
            <a
              href="/compress"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Compress PDF
            </a>
          </div>
          <div className="ml-3 rounded-md shadow">
            <a
              href="/decompress"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
            >
              Decompress File
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          How it works
        </h2>
        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
              1
            </div>
            <h3 className="text-lg font-medium text-gray-900">Upload PDF</h3>
            <p className="mt-2 text-base text-gray-500">
              Upload any PDF document to our system for processing.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
              2
            </div>
            <h3 className="text-lg font-medium text-gray-900">GPU Processing</h3>
            <p className="mt-2 text-base text-gray-500">
              Our system extracts the text and compresses it using GPU-accelerated Huffman encoding.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
              3
            </div>
            <h3 className="text-lg font-medium text-gray-900">Download Results</h3>
            <p className="mt-2 text-base text-gray-500">
              Download the compressed file, which can be up to 70% smaller than the original.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Technical Details
        </h2>
        <div className="mt-6 prose prose-lg prose-blue text-gray-500 mx-auto">
          <p>
            This application uses Huffman coding, a lossless data compression algorithm, 
            to efficiently compress text data in PDF documents. The compression process is 
            accelerated using CUDA on GPUs for faster performance.
          </p>
          <p>
            Huffman coding works by assigning variable-length codes to input characters, 
            with shorter codes for more frequent characters. This approach creates the most 
            efficient code possible for the given text data.
          </p>
          <p>
            Our implementation parallelizes the frequency counting step on the GPU, 
            which significantly speeds up the compression process for large documents.
          </p>
        </div>
      </div>
    </main>
  );
}
