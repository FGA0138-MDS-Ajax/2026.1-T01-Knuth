import React, { useState } from 'react';

export default function LoginForms() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleSubmit(event) {
		event.preventDefault();
		console.log('submit', { email, password });
	}

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-sm mt-6">
			<div className="mb-4">
				<label className="block text-sm text-gray-200 mb-1" htmlFor="email">
					Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					className="w-full px-3 py-2 rounded bg-white/5 text-white border border-white/10"
				/>
			</div>

			<div className="mb-6">
				<label className="block text-sm text-gray-200 mb-1" htmlFor="password">
					Senha
				</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					className="w-full px-3 py-2 rounded bg-white/5 text-white border border-white/10"
				/>
			</div>

			<button
				type="submit"
				className="w-full py-2 bg-blue-600 text-white rounded font-medium"
			>
				Entrar
			</button>
		</form>
	);
}