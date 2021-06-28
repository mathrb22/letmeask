import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import '../styles/room.scss';
import { FiLogOut } from 'react-icons/fi';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import emptyImg from '../assets/images/empty-questions.svg';

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

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		}
	}

	async function handleEndRoom() {
		if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
			await database.ref(`/rooms/${roomId}`).update({
				endedAt: new Date(),
			});
			history.push('/');
		}
	}

	return (
		<div id='page-room'>
			<header>
				<div className='content'>
					<img src={logoImg} alt='Letmeask' />
					<div className='menu'>
						<RoomCode code={params.id} />
						<Button onClick={handleEndRoom} isOutlined>
							Encerrar sala
						</Button>
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
					{questions.length > 0 && (
						<span>
							{questions.length} pergunta{questions.length > 1 && 's'}
						</span>
					)}
				</div>

				{questions.length === 0 && (
					<div className='no-questions'>
						<img src={emptyImg} alt='Nenhuma pergunta' />
						<strong>Nenhuma pergunta por aqui...</strong>
						<span>
							Envie o código desta sala para seus amigos e comece a responder
							perguntas!
						</span>
					</div>
				)}

				{questions.length > 0 && (
					<div className='question-list'>
						{questions.map((question) => {
							return (
								<Question
									key={question.id}
									content={question.content}
									author={question.author}>
									<button
										type='button'
										className='delete'
										onClick={() => handleDeleteQuestion(question.id)}>
										<svg
											width='24'
											height='24'
											viewBox='0 0 24 24'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												d='M3 5.99988H5H21'
												stroke='#737380'
												strokeWidth='1.5'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
											<path
												d='M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z'
												stroke='#737380'
												strokeWidth='1.5'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
									</button>
								</Question>
							);
						})}
					</div>
				)}
			</main>
		</div>
	);
}
