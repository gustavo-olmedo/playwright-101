'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '../components/LoginForm/LoginForm';
import { USERS } from '../data/users';
import { InstructionsLogin } from '../components/Instructions/Instructions';
import { Status } from '../types/statusLogin';
import { StatusLogin } from '../components/Status/Status';
import Accounts from '../components/Accounts/Accounts';

export default function LoginPage() {
  const [status, setStatus] = useState<Status>(null);
  const [tentative, setTentative] = useState(0);

  const router = useRouter();

  const handleLogin = (username: string, password: string) => {
    setTentative((prevTentative) => {
      if (username === USERS.regular.login && password !== USERS.regular.pass) {
        const newTentative = prevTentative + 1;

        if (newTentative >= 3) {
          setStatus('temporary_block');
        } else {
          setStatus('invalid_pass');
        }

        return newTentative;
      } else if (
        username === USERS.regular.login &&
        password === USERS.regular.pass
      ) {
        setStatus('logged_in');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
        return 0;
      } else if (
        username === USERS.bloqueado.login &&
        password === USERS.bloqueado.pass
      ) {
        setStatus('blocked');
        return 0;
      } else {
        setStatus('not_found');
        return prevTentative;
      }
    });
  };

  return (
    <div
      className="bg-gray-800 min-h-screen flex flex-col items-center justify-start pt-2 px-4 sm:px-6 lg:px-8"
      id="loginPage"
    >
      <div className="w-full max-w-2xl mx-auto relative">
        <InstructionsLogin />
        <div className="flex justify-center">
          <LoginForm onSubmit={handleLogin} />
        </div>
        <StatusLogin status={status} />
        <Accounts />
      </div>
    </div>
  );
}
