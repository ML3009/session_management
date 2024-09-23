import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import jwt from 'jsonwebtoken'

interface User {
    id: number
    username: string
    password: string
}

interface RequestBody {
    username: string
    password: string
}

let db: Database | null = null

async function initializeDatabase() {
    if (!db) {
        db = await open({
            filename: 'userdatabase.db',
            driver: sqlite3.Database,
        })
    }

    // Créez la table users si elle n'existe pas
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        );
    `)

    // Ajoutez un utilisateur par défaut si la table est vide
    const userCount = await db.get('SELECT COUNT(*) as count FROM users')
    if (userCount.count === 0) {
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', 'admin', 'adminpassword')
    }
}

async function authenticateUser(username: string, password: string): Promise<User | undefined> {
    if (!db) {
        db = await open({
            filename: 'userdatabase.db',
            driver: sqlite3.Database,
        })
    }

    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`
    const user: User | undefined = await db.get(sql, username, password)
    return user
}

export async function POST(req: Request): Promise<NextResponse> {
    const body: RequestBody = await req.json()
    const { username, password } = body

    const user = await authenticateUser(username, password)
    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: '1m',
    })
    return NextResponse.json({ token })

}

// Appelez la fonction d'initialisation au démarrage
initializeDatabase().catch((error) => {
    console.error('Failed to initialize database', error)
})