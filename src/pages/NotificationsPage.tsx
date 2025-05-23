import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { getMemberNotifications } from "../lib/firebase"

// 알림 타입 정의
interface Notification {
    id: number
    title: string
    message: string
    status: string
    sentAt: string
    notificationType: string
}

export default function NotificationsPage() {
    const { user, isAuthenticated } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<string>("")
    const navigate = useNavigate()

    useEffect(() => {
        // 디버깅 정보 추가
        console.log("인증 상태:", isAuthenticated)
        console.log("사용자 정보:", user)
        setDebugInfo(`인증 상태: ${isAuthenticated ? "로그인됨" : "로그인 안됨"}, 사용자 ID: ${user?.id || "없음"}`)

        async function fetchNotifications() {
            // 로컬 스토리지에서 사용자 정보 직접 확인 (디버깅용)
            const localUser = localStorage.getItem("infoUser")
            console.log("로컬 스토리지 사용자 정보:", localUser)

            let userId = user?.id

            // 로컬 스토리지에서 사용자 ID를 가져오는 대체 방법
            if (!userId && localUser) {
                try {
                    const parsedUser = JSON.parse(localUser)
                    userId = parsedUser.id
                    console.log("로컬 스토리지에서 가져온 사용자 ID:", userId)
                } catch (err) {
                    console.error("로컬 스토리지 사용자 정보 파싱 오류:", err)
                }
            }

            if (!userId) {
                setError("로그인이 필요합니다")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                // SENT 상태의 알림만 가져오기
                const data = await getMemberNotifications(userId, "SENT")
                console.log("가져온 알림 데이터:", data)
                setNotifications(data)
                setError(null)
            } catch (err) {
                console.error("알림 목록 조회 오류:", err)
                setError("알림을 불러오는 중 오류가 발생했습니다")
            } finally {
                setLoading(false)
            }
        }

        // 인증 상태가 확인되면 알림 데이터 가져오기
        if (isAuthenticated) {
            fetchNotifications()
        } else {
            // 로컬 스토리지에서 사용자 정보 확인
            const localUser = localStorage.getItem("infoUser")
            if (localUser) {
                console.log("로컬 스토리지에 사용자 정보가 있지만 인증 상태가 false입니다.")
                fetchNotifications() // 로컬 스토리지 정보로 시도
            } else {
                setError("로그인이 필요합니다")
                setLoading(false)
            }
        }
    }, [isAuthenticated, user])

    // 알림 타입에 따른 아이콘 및 색상 설정
    const getNotificationStyle = (type: string) => {
        switch (type) {
            case "RESERVATION_24H":
                return {
                    icon: "🕒",
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-800",
                    label: "예약 24시간 전 알림",
                }
            case "RESERVATION_3H":
                return {
                    icon: "⏰",
                    bgColor: "bg-yellow-100",
                    textColor: "text-yellow-800",
                    label: "예약 3시간 전 알림",
                }
            case "RESERVATION_1H":
                return {
                    icon: "🔔",
                    bgColor: "bg-orange-100",
                    textColor: "text-orange-800",
                    label: "예약 1시간 전 알림",
                }
            case "REVIEW_REQUEST":
                return {
                    icon: "✍️",
                    bgColor: "bg-green-100",
                    textColor: "text-green-800",
                    label: "리뷰 요청 알림",
                }
            case "WELCOME":
                return {
                    icon: "🎉",
                    bgColor: "bg-purple-100",
                    textColor: "text-purple-800",
                    label: "환영 알림",
                }
            default:
                return {
                    icon: "📩",
                    bgColor: "bg-gray-100",
                    textColor: "text-gray-800",
                    label: "일반 알림",
                }
        }
    }

    // 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "yyyy년 MM월 dd일 HH:mm", { locale: ko })
        } catch (e) {
            return dateString
        }
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
                {/* 디버깅 정보 표시 */}
                <div className="text-gray-500 text-sm mb-4">{debugInfo}</div>
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-main text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                    홈으로 돌아가기
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-[80px]">
            <h1 className="text-2xl font-bold text-main mb-6">내 알림 목록</h1>

            {notifications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">알림이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => {
                        const style = getNotificationStyle(notification.notificationType)

                        return (
                            <div
                                key={notification.id}
                                className={`p-4 ${style.bgColor} rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-start">
                                    <div className="text-2xl mr-3">{style.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`font-bold ${style.textColor}`}>{notification.title || style.label}</h3>
                                                <p className="text-gray-700 mt-1">{notification.message}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">{formatDate(notification.sentAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
