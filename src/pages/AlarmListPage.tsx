import type React from "react"
import {useEffect, useState} from "react"
import {getMemberNotifications} from "../lib/firebase"

interface Notification {
    id: number
    status: string
    scheduledAt: string
}

export default function AlarmListPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        // 로그인한 사용자 정보 가져오기 (실제 구현에서는 상태 관리 라이브러리나 컨텍스트에서 가져올 수 있음)
        const user = localStorage.getItem("user")
        if (user) {
            try {
                const userData = JSON.parse(user)
                setUserId(userData.id)
            } catch (err) {
                console.error("사용자 정보 파싱 오류:", err)
                setError("사용자 정보를 불러올 수 없습니다.")
            }
        } else {
            setError("로그인이 필요합니다.")
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!userId) return

        const fetchNotifications = async () => {
            try {
                setLoading(true)
                const data = await getMemberNotifications(userId, statusFilter)
                setNotifications(data)
                setError(null)
            } catch (err) {
                setError("알림을 불러오는 중 오류가 발생했습니다.")
                console.error("알림 목록 조회 오류:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [userId, statusFilter])

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setStatusFilter(value === "ALL" ? undefined : value)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <button
                    onClick={() => (window.location.href = "/")}
                    className="px-4 py-2 bg-main text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                    홈으로 돌아가기
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-main mb-6">알림 목록</h1>

            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center">
                    <label htmlFor="status-filter" className="mr-2 font-medium">
                        상태 필터:
                    </label>
                    <select
                        id="status-filter"
                        value={statusFilter || "ALL"}
                        onChange={handleStatusChange}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main"
                    >
                        <option value="ALL">전체</option>
                        <option value="PENDING">대기 중</option>
                        <option value="SENT">전송됨</option>
                        <option value="FAILED">실패</option>
                    </select>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                    새로고침
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">알림이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">알림 ID: {notification.id}</p>
                                    <p className="text-sm text-gray-500">
                                        예약 시간: {new Date(notification.scheduledAt).toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-sm rounded-full ${
                                        notification.status === "SENT"
                                            ? "bg-green-100 text-green-800"
                                            : notification.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                    }`}
                                >
                  {notification.status === "SENT" ? "전송됨" : notification.status === "PENDING" ? "대기 중" : "실패"}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
