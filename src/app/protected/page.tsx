'use client'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function ProtectedPage(): JSX.Element {
    const router = useRouter()

    useEffect(() => {
        const token: string | undefined = Cookies.get('token')

        if(!token) {
            router.replace('/')
            return
        }

        const validateToken = async (): Promise<void> => {
            try {
                const res = await fetch('/api/protected', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                
                if (!res.ok) throw new Error('Token validation failed')
            } catch (error) {
                console.error(error)
                router.replace('/')
            }
        }
        validateToken()
    }, [router])

    return <div>Protected Content</div>
}

export default ProtectedPage