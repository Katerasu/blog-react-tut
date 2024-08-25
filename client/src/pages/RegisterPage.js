import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function register(ev) {
        ev.preventDefault();
        const response = await fetch("http://localhost:4000/register", {
            method: "POST",
            body: JSON.stringify({username, password}),
            headers: {"Content-Type": "application/json"},
        });
        if (response.status === 200) {
            alert('Registration successful');
        } else {
            alert('Registration failed');
        }
    }
    return (
        <
// @ts-ignore
        form className="register" onSubmit={register}>
            <
// @ts-ignore
            h1>Register</h1>
            <
// @ts-ignore
            input type="text" 
                placeholder="username" 
                value={username} 
                onChange={ev => setUsername(ev.target.value)} />
            <
// @ts-ignore
            input type="password" 
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)} />
            <
// @ts-ignore
            button>Register</button>
        </form>
    );
}