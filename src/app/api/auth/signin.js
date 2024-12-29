import { auth } from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
    const { email, password } = req.body;
    try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        return res.status(200).json({ uid: response.user.uid });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
