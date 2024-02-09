import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "../app/data/verificiation-token";
import db from "./prismadb"



export const generateVerificationToken = async (email) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000) //valid for an hour long
    const existingToken = await getVerificationTokenByEmail(email);
    console.log("existingToken", existingToken, "email", email)

    if (existingToken) {
        await db.verificationtoken.delete({

            where: {
                id: existingToken.id,
            }
        })
    }



    const verificationToken = await db.verificationtoken.create({

        data: {
            email,
            token,
            expires,
        }
    })

    return verificationToken
}