import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function POST(request) {
    try {
        await connectDB()
        const { email, password } = await request.json()

        // Buscar el usuario por email
        let user = await User.findOne({ email })

        if (!user) {
            // Si el usuario no existe, lo creamos
            const hashedPassword = await bcrypt.hash(password, 10)
            user = await User.create({
                email,
                password: hashedPassword
            })

            return NextResponse.json({
                message: 'Usuario creado exitosamente',
                user: { email: user.email }
            })
        }

        // Si el usuario existe, verificamos la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Contraseña inválida' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            message: 'Usuario autenticado exitosamente',
            user: { email: user.email }
        })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Error del Servidor' },
            { status: 500 }
        )
    }
}