// app/(auth)/layout.tsx
'use client'; // 👈 必须加这一行！标记为客户端组件

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname(); // 安全获取当前路径

    const navItems = [
        { label: '登录', path: '/auth/signin' },
        { label: '注册', path: '/auth/signup' },
        { label: '忘记密码（待开发）', path: '/auth' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">我的笔记本·Notebook</h1>

                {/* Tab 导航 */}
                <div className="flex border-b border-gray-200">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                pathname === item.path
                                    ? 'text-blue-600 border-b-2 border-blue-6 !border-opacity-100'
                                    : 'text-gray-500 hover:text-blue-500'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* 子页面内容 */}
                <div>{children}</div>
            </div>
        </div>
    );
}