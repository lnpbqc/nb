'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import {useState} from "react";
import {useRouter} from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
            {pending ? '注册中...' : '注册'}
        </button>
    );
}

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name,email, password,repassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || '注册失败');
            }

            // 登录成功：重定向到首页
            router.push('/');
            router.refresh(); // 可选：刷新服务端数据
        } catch (err: any) {
            setError(err.message || '注册失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">注册</h2>

            {error && (
                <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>
            )}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名字"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

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
            <input
                type="password"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="再输一次密码"
                required
                className={"w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" + (repassword !== repassword ? "text-red-700" : "")}
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isSubmitting ? '注册中...' : '注册'}
            </button>

            <div className="text-sm text-center text-gray-600">
                <Link href="/auth/signin" className="text-blue-600 hover:underline">
                    有账号？去登录
                </Link>
                {' · '}
                <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                    忘记密码？
                </Link>
            </div>
        </form>
    );
}