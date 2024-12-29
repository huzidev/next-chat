import { auth } from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
    console.log("signin called");
    const { email, password } = req.body;
    try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log("response form api auth", response);
        return res.status(200).json({ uid: response.user.uid });
    } catch (error) {
        console.log("Error while signin: ", error);
        return res.status(400).json({ error: error.message });
    }
}
