"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutClient() {
    const router = useRouter();
    const [status, setStatus] = useState("正在退出...");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/auth/logout", { method: "POST" });
                if (res.ok) {
                    setStatus("退出成功，3 秒后跳转...");
                    setTimeout(() => router.push("/"), 3000);
                } else {
                    setStatus("退出失败，稍后重试");
                }
            } catch (e) {
                setStatus("网络错误");
            }
        })();
    }, [router]);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            {status}
        </div>
    );
}
