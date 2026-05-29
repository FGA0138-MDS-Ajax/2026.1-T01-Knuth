import React, { useState } from 'react';

export default function LoginForms() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [erro, setErro] = useState('');
	const [sucesso, setSucesso] = useState('');
	const [carregando, setCarregando] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();

		setErro('');
		setSucesso('');
		setCarregando(true);

		try {
			const resposta = await fetch('http://127.0.0.1:8000/api/login/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			});

			const dados = await resposta.json();

			if (!resposta.ok) {
				throw new Error(dados.erro || 'Erro ao fazer login.');
			}

			console.log('Login realizado:', dados);
			setSucesso('Login realizado com sucesso!');

			// Aqui depois vocês podem redirecionar o usuário.
			// Exemplo, se estiverem usando React Router:
			// navigate('/dashboard');

		} catch (error) {
			console.error('Erro no login:', error);
			setErro(error.message);
		} finally {
			setCarregando(false);
		}
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
					required
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
					required
				/>
			</div>

			{erro && (
				<p className="mb-4 text-sm text-red-400">
					{erro}
				</p>
			)}

			{sucesso && (
				<p className="mb-4 text-sm text-green-400">
					{sucesso}
				</p>
			)}

			<button
				type="submit"
				disabled={carregando}
				className="w-full py-2 bg-blue-600 text-white rounded font-medium disabled:opacity-60"
			>
				{carregando ? 'Entrando...' : 'Entrar'}
			</button>
		</form>
	);
}
