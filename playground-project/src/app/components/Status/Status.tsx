import { Status } from '@/app/types/statusLogin';
import React from 'react';

export type StatusLoginProps = {
  status: Status;
};

export function StatusLogin({ status }: StatusLoginProps) {
  return (
    <>
      {status === 'logged_in' && (
        <div id="statusLoggedIn" className="text-center text-green-500 mt-4">
          User successfully logged in! Redirecting...
        </div>
      )}
      {status === 'blocked' && (
        <div id="statusBlocked" className="text-center text-red-400 mt-4">
          User blocked!
        </div>
      )}
      {status === 'not_found' && (
        <div id="statusNotFound" className="text-center text-orange-300 mt-4">
          User not found!
        </div>
      )}
      {status === 'invalid_pass' && (
        <div
          id="statusInvalidPass"
          className="text-center text-orange-300 mt-4"
        >
          Incorrect username or password!
        </div>
      )}
      {status === 'temporary_block' && (
        <div
          id="statusTemporaryBlock"
          className="text-center text-orange-300 mt-4"
        >
          User temporarily blocked!
        </div>
      )}
    </>
  );
}
