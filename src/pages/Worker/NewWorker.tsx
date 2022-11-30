import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

const NewWorkerPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [date, setDate] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState<Array<string>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uid, setUid] = useState<Number>(-1);
    const [users, setUsers] = useState<Array<any>>([]);

    const { user }: any = useAuthContext();

    const CreateWorker = async (vnt: any) => {
        vnt.preventDefault();
        let errs: Array<string> = [];
        setErrors([]);
        if (name.length === 0) {
            errs.push("Vardas nenustatytas");
        }
        if (surname.length === 0) {
            errs.push("Pavardė nenustatyta");
        }
        if (date.length === 0) {
            errs.push("Data nenustatyta");
        }
        if (uid === -1) {
            errs.push("Nepasirinktas vartotojas");
        }
        if (email.length === 0) {
            errs.push("El. paštas nenustatytas");
        }
        if (address.length === 0) {
            errs.push("Adresas nenustatytas");
        }
        if (code.length === 0) {
            errs.push("Pašto kodas nenustatytas");
        }
        setErrors(w => [...w, ...errs]);

        if (errs.length === 0 && !isLoading) {
            setIsLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_APIURL}/api/workers/new`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: uid,
                        vardas: name,
                        pavarde: surname,
                        data: date,
                        pastas: email,
                        pastoKodas: code,
                        adresas: address
                    })
                });
                const json = await res.json();
                if (res.ok) {
                    navigate("/workerlist");
                } else {
                    throw Error(json.error);
                }
            } catch (err: any) {
                setErrors(w => [...w, err.message]);
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_APIURL}/api/workers/users`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const json = await res.json();
                console.log(json);
                setUsers(json.users);
                if (!res.ok) {
                    throw Error(json.error);
                }
            } catch (err: any) {
                setErrors(w => [...w, err.message]);
            }
        }
        fetchUsers();
    }, [user]);

    return (
        <div className="box">
            <h2>Naujas darbuotojas</h2>
            <form method="post">
                <div className="grid form center">
                    <label htmlFor="name">Vardas</label>
                    <input type="text" name="name" value={name} onChange={w => setName(w.target.value)} />

                    <label htmlFor="surname">Pavardė</label>
                    <input type="text" name="surname" value={surname} onChange={w => setSurname(w.target.value)} />

                    <label htmlFor="date">Gimimo data</label>
                    <input type="date" name="date" value={date} onChange={w => setDate(w.target.value)} />

                    <label htmlFor="email">El. paštas</label>
                    <input type="email" name="email" value={email} onChange={w => setEmail(w.target.value)} />

                    <label htmlFor="address">Adresas</label>
                    <input type="text" name="address" value={address} onChange={w => setAddress(w.target.value)} />

                    <label htmlFor="kodas">Pašto kodas</label>
                    <input type="text" name="kodas" value={code} onChange={w => setCode(w.target.value)} />

                    <label htmlFor="uid">Vartotojas</label>
                    <select defaultValue={-1} name="uid" onChange={(w) => setUid(parseInt(w.target.value))}>
                        <option value="-1">-------</option>
                        {users.map(w => (
                            <option key={w.id_Vartotojas} value={w.id_Vartotojas}>{w.Prisijungimo_vardas}</option>
                        ))}
                    </select>
                </div>
                <button className="button" disabled={isLoading} onClick={e => CreateWorker(e)}>Pateikti</button>
            </form>
            {errors.length > 0 ? <div className="error">{errors.map((w, ind) => (
                <p key={ind}>{w}</p>
            ))}</div> : ""}
        </div>
    )
}
export default NewWorkerPage;