// app/logout/page.tsx
import LogoutClient from "./LogoutClient";

export default function LogoutPage() {
    // 不在这里删除 cookie（否则会报错）
    return <LogoutClient />;
}
