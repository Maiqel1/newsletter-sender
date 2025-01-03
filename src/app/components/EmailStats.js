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

  const uniqueErrors = errors.reduce((acc, curr) => {
    const existingError = acc.find((e) => e.error === curr.error);
    if (existingError) {
      existingError.emails.push(curr.email);
    } else {
      acc.push({ error: curr.error, emails: [curr.email] });
    }
    return acc;
  }, []);

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
          <h3 className='text-lg font-medium text-red-600 mb-4'>
            Failed Deliveries
          </h3>
          <div className='space-y-4'>
            {uniqueErrors.map((errorGroup, index) => (
              <div key={index} className='p-4 bg-red-50 rounded'>
                <p className='font-medium text-red-800 mb-2'>
                  {errorGroup.error}
                </p>
                <div className='pl-4 space-y-1'>
                  {errorGroup.emails.map((email, emailIndex) => (
                    <p key={emailIndex} className='text-sm text-gray-700'>
                      {email}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
