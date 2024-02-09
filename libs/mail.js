import { Resend } from 'resend';

const resend = new Resend(process.env.Resend_secret);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
    email,
    token
) => {
    await resend.emails.send({
        from: "mail@auth-masterclass-tutorial.com",
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA code: ${token}</p>`
    });
};

export const sendPasswordResetEmail = async (
    email,
    token
) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    await resend.emails.send({
        from: "mail@auth-masterclass-tutorial.com",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    });
};

export const sendVerificationEmail = async (email, token) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "anishgshrestha@gmail.com",
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    });
};
