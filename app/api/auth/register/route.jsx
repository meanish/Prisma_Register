
"use server";


import bcrypt from 'bcrypt'
import prisma from '../../../../libs/prismadb'
import { NextResponse } from 'next/server'
import { generateVerificationToken } from '../../../../libs/tokens';
import { getUserByEmail } from '../../data/user';
import axios from 'axios';

export async function POST(request) {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
        return new NextResponse({ error: 'Missing Fields' }, { status: 400 })
    }

    const exist = await getUserByEmail(email)

    if (exist) {
        console.log("Existed")
        return NextResponse.json({ error: "Email already existed" });
    }
    console.log("No existed")
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedpassword
        }
    });

    const verificationToken = await generateVerificationToken(email);
    // const verificationemail = await sendVerificationEmail(
    //     verificationToken.email,
    //     verificationToken.token,
    // );

    return NextResponse.json(user);
}