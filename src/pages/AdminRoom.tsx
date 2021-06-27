import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import '../styles/room.scss';
import { FiLogOut } from 'react-icons/fi';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
	id: string;
};

export function AdminRoom() {
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const history = useHistory();
	const { questions, title } = useRoom(roomId);
	const { user, signOut } = useAuth();

	async function handleSignOut() {
		await signOut();
		history.push('/');
	}

	return (
		<div id='page-room'>
			<header>
				<div className='content'>
					<img src={logoImg} alt='Letmeask' />
					<div className='menu'>
						<RoomCode code={params.id} />
						<Button isOutlined>Encerrar sala</Button>
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
					<h1>{title}</h1>
					{questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>

				<div className='question-list'>
					{questions.map((question) => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
							/>
						);
					})}
				</div>
			</main>
		</div>
	);
}
