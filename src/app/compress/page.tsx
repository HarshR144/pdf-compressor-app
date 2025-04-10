import CompressForm from '../components/CompressForm';

export default function CompressPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Compress PDF Document
        </h1>
        <CompressForm />
      </div>
    </div>
  );
}