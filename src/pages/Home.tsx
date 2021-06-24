import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import illustrationImg from '../assets/images/illustration.svg';
import logo from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import { FiLogIn } from 'react-icons/fi';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';

export function Home() {
	const history = useHistory();
	const { user, signInWithGoogle } = useAuth();

	async function handleCreateRoom() {
		if (!user) {
			await signInWithGoogle();
		}

		history.push('/rooms/new');
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
					<button className='create-room' onClick={handleCreateRoom}>
						<img src={googleIconImg} alt='Google' />
						Crie sua sala com o Google
					</button>
					<div className='separator'>ou entre em uma sala</div>
					<form>
						<input type='text' required placeholder='Digite o código da sala' />
						<Button type='submit'>
							{/* <FaSignInAlt size={20} color='#fff' /> Entrar na sala{' '} */}
							<FiLogIn size={20} color='#fff' className='login-icon' /> Entrar na sala
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
