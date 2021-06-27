import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import '../styles/room.scss';
import { FiLogOut } from 'react-icons/fi';
import { RoomCode } from '../components/RoomCode';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { useEffect } from 'react';

type FirebaseQuestions = Record<
	string,
	{
		author: {
			name: string;
			avatar: string;
		};
		content: string;
		isHighlighted: boolean;
		isAnswered: boolean;
	}
>;

type Question = {
	id: string;
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	isHighlighted: boolean;
	isAnswered: boolean;
};

type RoomParams = {
	id: string;
};

export function Room() {
	const params = useParams<RoomParams>();
	const [newQuestion, setNewQuestion] = useState('');
	const [questions, setQuestions] = useState<Question[]>([]);
	const [title, setTitle] = useState('');
	const roomId = params.id;
	const history = useHistory();
	const { user, signOut, signInWithGoogle } = useAuth();

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`);

		roomRef.on('value', (room) => {
			const databaseRoom = room.val();
			const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
			const parsedQuestions = Object.entries(firebaseQuestions).map(
				([key, value]) => {
					return {
						id: key,
						content: value.content,
						author: value.author,
						isHighlighted: value.isHighlighted,
						isAnswered: value.isAnswered,
					};
				}
			);

			setTitle(databaseRoom.title);
			setQuestions(parsedQuestions);
		});
	}, [roomId]);

	async function handleSignOut() {
		await signOut();
		history.push('/');
	}

	async function handleSignIn() {
		if (!user) {
			await signInWithGoogle();
		}
	}

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault();
		if (newQuestion.trim() === '') return;

		if (!user) {
			throw new Error('You must be logged in');
		}

		const question = {
			author: {
				name: user.name,
				avatar: user.avatar,
			},
			content: newQuestion,
			isHighlighted: false,
			isAnswered: false,
		};

		await database.ref(`rooms/${roomId}/questions`).push(question);

		setNewQuestion('');
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
					<h1>{title}</h1>
					{questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>

				<form onSubmit={handleSendQuestion}>
					<textarea
						placeholder='O que você quer perguntar?'
						onChange={(event) => setNewQuestion(event.target.value)}
						value={newQuestion}
					/>

					<div className='form-footer'>
						{user ? (
							<div className='user-info'>
								<img src={user.avatar} alt={user.name} />
								<span>{user.name}</span>
							</div>
						) : (
							<span>
								Para enviar uma pergunta,
								<button onClick={handleSignIn}> faça seu login</button>
							</span>
						)}
						<Button id='send-question' disabled={!user} type='submit'>
							Enviar pergunta
						</Button>
					</div>
				</form>

				{JSON.stringify(questions)}
			</main>
		</div>
	);
}
