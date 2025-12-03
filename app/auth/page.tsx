// app/(auth)/page.tsx
import { redirect } from 'next/navigation';

export default function AuthHome() {
    redirect('/auth/signin');
}