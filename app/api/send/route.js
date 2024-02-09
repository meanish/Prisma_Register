
import { Resend } from 'resend';
import * as React from 'react';


const resend = new Resend(re_EqMB11ig_HGuaMJcdK4pjJJWnLtywaZNo);


export async function POST() {
    // console.log("request", request)
    // const body = await request.json();
    // const { email, token } = body;
    try {


        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: "anishgshrestha@gmail.com",
            subject: 'Confirm your email',
            html: `<p>Click <a href="/">here</a> to confirm email.</p>`
        });


        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
}