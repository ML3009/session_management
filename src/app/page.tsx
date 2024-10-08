'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'


function LoginPage() {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const router = useRouter()

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault()
		
		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					password,
				}),
			})
			
			if (!response.ok) throw new Error('Login failed')
			
			const { token } = await response.json()
			document.cookie = `token=${token}; path=/`
			router.push('/protected')
		} catch(error) {
			console.error(error)
		}
	}

	return (
		<div>
			<form onSubmit={handleLogin}>
				<label>
					Username:
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<br />
				<label>
					Password:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<br />
				<button type="submit">Log In</button>
			</form>
		</div>
	)
}

export default LoginPage
