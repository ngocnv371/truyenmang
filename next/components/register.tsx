'use client';

import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { Container } from './container';
import { Button } from './elements/button';
import { Logo } from './logo';
import { useAuth } from '@/lib/auth-context';

export const Register = () => {
  const router = useRouter();
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(username, email, password);
      router.push('/');
    } catch {
      // error is handled by context
    }
  };

  return (
    <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
      <Logo />
      <h1 className="text-xl md:text-4xl font-bold my-4">
        Sign up for LaunchPad
      </h1>

      {error && (
        <p className="w-full text-sm text-red-400 mb-4 bg-red-400/10 px-4 py-3 rounded-md">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="w-full my-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <Button
          variant="muted"
          type="submit"
          className="w-full py-3"
          disabled={loading}
        >
          <span className="text-sm">
            {loading ? 'Signing up...' : 'Sign up'}
          </span>
        </Button>
      </form>

      <p className="mt-8 text-sm text-neutral-400">
        Already have an account?{' '}
        <Link
          href={`/${locale}/sign-in`}
          className="text-white hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Container>
  );
};

const Divider = () => {
  return (
    <div className="relative w-full py-8">
      <div className="w-full h-px bg-neutral-700 rounded-tr-xl rounded-tl-xl" />
      <div className="w-full h-px bg-neutral-800 rounded-br-xl rounded-bl-xl" />
      <div className="absolute inset-0 h-5 w-5 m-auto rounded-md px-3 py-0.5 text-xs bg-neutral-800 shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center">
        OR
      </div>
    </div>
  );
};
