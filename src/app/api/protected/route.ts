import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(): Promise<NextResponse> {
    try {
        const headersInstance = headers()
        const authHeader: string | null = headersInstance.get('authorization')

        if (!authHeader) {
            return NextResponse.json(
                { message: 'Unauthorized'},
                {
                    status: 400,
                },
            )
        }

        const token: string = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        if (!decoded) {
            return NextResponse.json(
                { message: 'Expired' },
                {
                    status: 400,
                },
            )
        } else if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return NextResponse.json( 
                { message: 'Expired' },
                {
                    status: 400,
                },
            )
        } else {
            return NextResponse.json(
                { data: 'Protected data' },
                {
                    status: 200,
                },
            )
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json(
            { message: 'Unauthorized'},
            {
                status: 400,
            },
        )
    }
}