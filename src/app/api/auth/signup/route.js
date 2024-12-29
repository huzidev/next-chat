import { auth } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
    const { email, password } = req.body;
    console.log("Signup Called");
    try {
        const response = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        return res.status(200).json({ uid: response.user.uid });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(400).json({ error: error.message });
    }
}