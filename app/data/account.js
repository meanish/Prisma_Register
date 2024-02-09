import prisma from "../libs/prismadb";

export const getAccountByUserId = async (userId) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId }
    });

    return account;
  } catch {
    return null;
  }
};
