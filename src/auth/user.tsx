import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import { writable } from 'svelte/store';

interface User {
    alias: string;
    pub: string;
    epub: string;
    priv: string;
    epriv: string;
}

// Database
export const db = GUN();

// Gun User
export const user = db.user().recall({ sessionStorage: true });

// Current User's username
export const username = writable<string>('');

// Update username when user alias changes
user.get('alias').on((data: string) => {
    username.set(data);
});

// Auth event listener
db.on('auth', async () => {
    const alias = await user.get('alias');
    username.set(alias);
    console.log('User Authenticated');
});
