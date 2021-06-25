import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import '../styles/room.scss';
import { FiLogOut } from 'react-icons/fi';
import { RoomCode } from '../components/RoomCode';

type RoomParams = {
	id: string;
};

export function Room() {
	const params = useParams<RoomParams>();
	const history = useHistory();
	const { user, signOut, signInWithGoogle } = useAuth();

	async function handleSignOut() {
		await signOut();
		history.push('/');
	}

	async function handleSignIn() {
		if (!user) {
			await signInWithGoogle();
		}
	}

	return (
		<div id='page-room'>
			<header>
				<div className='content'>
					<img src={logoImg} alt='Letmeask' />
					<div className='menu'>
						<RoomCode code={params.id} />
						<Button className='btn-outline'>Encerrar sala</Button>
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
			</header>

			<main>
				<div className='room-title'>
					<h1>Next Level Week Together</h1>
					<span>4 perguntas</span>
				</div>

				<form>
					<textarea placeholder='O que você quer perguntar?' />

					<div className='form-footer'>
						<span>
							Para enviar uma pergunta,
							<button onClick={handleSignIn}> faça seu login</button>
						</span>
						<Button id='send-question' disabled={!user} type='submit'>
							Enviar pergunta
						</Button>
					</div>
				</form>
			</main>
		</div>
	);
}
