import { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { firebase, auth } from './services/firebase';

type User = {
	id: string;
	name: string;
	avatar: string;
};

type AuthContextType = {
	user: User | undefined;
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

function App() {
	const [user, setUser] = useState<User>();

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				const { displayName, photoURL, uid } = user;

				if (!displayName || !photoURL) {
					throw new Error('Missing information from Google Account.');
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL,
				});
			}
		});
	}, []);

	async function signInWithGoogle() {
		const provider = new firebase.auth.GoogleAuthProvider();

		const response = await auth.signInWithPopup(provider);

		if (response.user) {
			const { displayName, photoURL, uid } = response.user;

			if (!displayName || !photoURL) {
				throw new Error('Missing information from Google Account.');
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL,
			});
		}
	}

	async function signOut() {
		await auth.signOut();
		setUser(undefined);
	}

	return (
		<BrowserRouter>
			<AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
				<Route path='/' exact component={Home} />
				<Route path='/rooms/new' component={NewRoom} />
			</AuthContext.Provider>
		</BrowserRouter>
	);
}

export default App;
