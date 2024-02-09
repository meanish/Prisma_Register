import db from "../../libs/prismadb";

export const getVerificationTokenByToken = async (
  token
) => {
  try {
    const verificationToken = await db.verificationtoken.findUnique({
      where: { token }
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email
) => {
  try {
    const verificationToken = await db.verificationtoken.findFirst({
      where: { email }
    });


    console.log("Toke Yes", verificationToken)
    return verificationToken;
  } catch {
    return null;
  }
}