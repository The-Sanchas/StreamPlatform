import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface VerificationTemplateProps {
    domain: string
    token: string
}

export function VerificationTemplate({ domain, token }:
VerificationTemplateProps) {

    const verificationLink = `${domain}/account/verify?token=${token}`

    return (
        <Html>
            <Head />
            <Preview>Верифиация аккаунта</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-56'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Подтверждение вашей почты
                        </Heading>
                        <Text className='text-base text-black'>
                            Спасибо за регистрацию! Чтобы
                            подтвердить свой адрес электронной
                            почты, перейдите пожалуйста по следующей ссылке:  
                        </Text>
                        <Link href={verificationLink} className='inline-flex 
                        justify-centr itens-centr rounded-full text-sm
                        fount-medium text-white bg-[#18B9AE] px-5 py-2'>
                            Подтвердить почту
                        </Link>
                    </Section>
                    <Section className='text-center mt-8'>
                        <Text>
                            Если у вас есть вопросы или вы столкнулись с
                            трудностями, не стесняйтесь обращатся в нашу
                            службу поддержки по адресу{' '}
                            <Link
                                href='mailto:teastream@mywebua.com'
                                className='text-[#18b9ae] underline'
                            >
                                 teastream@mywebua.com    
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
    }