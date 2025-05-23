
import type React from "react"
import { useState } from "react"
import { deleteFCMToken } from "../../lib/firebase"

interface LogoutButtonProps {
    userId: string | number
    onLogout?: () => void
    className?: string
    children?: React.ReactNode
}

export default function LogoutButton({ userId, onLogout, className = "", children }: LogoutButtonProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)

            // 서버에서 FCM 토큰 삭제
            await deleteFCMToken(userId)

            // 로그아웃
            // const response = await fetch("http://localhost:8080/api/members/logout", {
            const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL || "http://localhost:8080"
            const response = await fetch(`${apiUrl}/api/members/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })

            if (response.ok) {
                // 로그아웃 후 추가 작업
                localStorage.removeItem("user")
                localStorage.removeItem("fcm_token")

                // 콜백 함수
                if (onLogout) {
                    onLogout()
                }

                // 홈페이지로 리다이렉트
                window.location.href = "/"
            } else {
                console.error("로그아웃 실패:", await response.text())
                setIsLoggingOut(false)
            }
        } catch (error) {
            console.error("로그아웃 처리 중 오류:", error)
            setIsLoggingOut(false)
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors ${
                isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
        >
            {children || "로그아웃"}
        </button>
    )
}
