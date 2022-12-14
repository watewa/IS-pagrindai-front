import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

const NewStore = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState<Array<string>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { user }: any = useAuthContext();

    const CreateStore = async (vnt: any) => {
        vnt.preventDefault();
        let errs: Array<string> = [];
        setErrors([]);
        if (name.length === 0) {
            errs.push("Vardas nenustatytas");
        }
        if (address.length === 0) {
            errs.push("Pavardė nenustatyta");
        }
        
        setErrors(w => [...w, ...errs]);

        if (errs.length === 0 && !isLoading) {
            setIsLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_APIURL}/api/store/new`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        vadovas: name,
                        adresas: address
                    })
                });
                const json = await res.json();
                if (res.ok) {
                    navigate("/store");
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
                const res = await fetch(`${process.env.REACT_APP_APIURL}/api/store`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const json = await res.json();
                console.log(json);
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
            <h2>Nauja parduotuvė</h2>
            <form method="post">
                <div className="grid form center">
                    <label htmlFor="name">Vadovas</label>
                    <input type="text" name="name" value={name} onChange={w => setName(w.target.value)} />

                    <label htmlFor="address">Adresas</label>
                    <input type="text" name="address" value={address} onChange={w => setAddress(w.target.value)} />

                </div>
                <button className="button" disabled={isLoading} onClick={e => CreateStore(e)}>Pateikti</button>
            </form>
            {errors.length > 0 ? <div className="error">{errors.map((w, ind) => (
                <p key={ind}>{w}</p>
            ))}</div> : ""}
        </div>
    )
}
export default NewStore;