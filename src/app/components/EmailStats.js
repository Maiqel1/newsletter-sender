import React from "react";
import { AlertCircle, CheckCircle, Clock, Mail } from "lucide-react";

export default function EmailStats({ stats, isLoading }) {
  if (!stats && !isLoading) return null;

  if (isLoading) {
    return (
      <div className='mt-6 p-4 bg-white rounded-lg shadow'>
        <div className='flex items-center space-x-2'>
          <Clock className='w-5 h-5 text-blue-500 animate-spin' />
          <span>Sending newsletters...</span>
        </div>
      </div>
    );
  }

  const {
    sentCount = 0,
    errorCount = 0,
    errors = [],
    totalSubscribers = 0,
  } = stats;

  return (
    <div className='mt-6 space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Sent Successfully</p>
              <p className='text-2xl font-bold text-green-600'>{sentCount}</p>
            </div>
            <CheckCircle className='w-8 h-8 text-green-500' />
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Failed</p>
              <p className='text-2xl font-bold text-red-600'>{errorCount}</p>
            </div>
            <AlertCircle className='w-8 h-8 text-red-500' />
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Total Recipients</p>
              <p className='text-2xl font-bold text-blue-600'>
                {totalSubscribers}
              </p>
            </div>
            <Mail className='w-8 h-8 text-blue-500' />
          </div>
        </div>
      </div>

      {errorCount > 0 && (
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-medium text-red-600 mb-2'>
            Failed Deliveries
          </h3>
          <div className='space-y-2'>
            {errors.map((error, index) => (
              <div key={index} className='p-2 bg-red-50 rounded'>
                <p className='text-sm text-gray-700'>
                  <span className='font-medium'>{error.email}</span>
                  <span className='text-gray-500 ml-2'>- {error.error}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
