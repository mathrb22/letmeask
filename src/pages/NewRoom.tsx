import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { Button } from '../components/Button';
import illustrationImg from '../assets/images/illustration.svg';
import logo from '../assets/images/logo.svg';
import { FiLogOut } from 'react-icons/fi';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

export function NewRoom() {
	const history = useHistory();
	const { user, signOut } = useAuth();
	const [newRoom, setNewRoom] = useState('');

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();

		if (newRoom.trim() === '') return;

		const roomRef = database.ref('rooms'); //FireBase ref

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id,
		});

		history.push(`/rooms/${firebaseRoom.key}`);
	}

	async function handleSignOut() {
		await signOut();
		history.push('/');
	}

	return (
		<div id='page-auth'>
			<aside>
				<img
					src={illustrationImg}
					alt='Ilustração simbolizando perguntas e respostas'
				/>
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire dúvidas da sua audiência em tempo-real</p>
			</aside>
			<main>
				<div className='main-content'>
					<img src={logo} alt='Letmeask' />
					<span>{user?.name ? 'Olá, ' + user?.name + '!' : ''}</span>
					<h2>Crie uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							value={newRoom}
							onChange={(event) => setNewRoom(event.target.value)}
							type='text'
							required
							placeholder='Nome da sala'
						/>
						<Button type='submit'>Criar sala </Button>
					</form>
					<p>
						Quer entrar em uma sala existente? <Link to='/'>Clique aqui</Link>
					</p>

					<div className='user'>
						{user && (
							<div className='userAuthInfo'>
								<img className='avatar' src={user?.avatar} alt='Avatar' />{' '}
								<Button className='sign-out' onClick={handleSignOut} title='Sair'>
									<FiLogOut className='logout-icon' size={20} color='#835afd' />
								</Button>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
