'use client';

import Link from 'next/link';
import {useState} from "react";
import {useRouter} from "next/navigation";



export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || '登录失败');
            }

            // 登录成功：重定向到首页
            router.push('/');
            router.refresh(); // 可选：刷新服务端数据
        } catch (err: any) {
            setError(err.message || '登录失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">登录</h2>

            {error && (
                <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>
            )}

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isSubmitting ? '登录中...' : '登录'}
            </button>

            <div className="text-sm text-center text-gray-600">
                <Link href="/auth/signup" className="text-blue-600 hover:underline">
                    没有账号？去注册
                </Link>
                {' · '}
                <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                    忘记密码？
                </Link>
            </div>
        </form>
    );
}