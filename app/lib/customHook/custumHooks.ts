// hooks/useUser.ts

import { useState, useEffect } from 'react';
import { getUser } from '../auth/getUser';
import { User } from '../auth/interface';

export function useUser() : User | null {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function getUserClient() {
            const res: User | null = await getUser()
            if (res) {
                setUser(res)
            }
        }
        getUserClient()
    }, [])

    return user;
}