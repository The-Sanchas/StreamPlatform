import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface AccauntDeletionTemplateProps {
    domain: string
}

export function AccauntDeletionTemplate({domain}: AccauntDeletionTemplateProps){
    const registerLink = `https://${domain}/account/create`

    return (
        <Html>
            <Head />
            <Preview>Аккаунт удален</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center'>
                        <Heading className='text-3xl text-black font-bold'>
                            Ваш аккаунт был полностью удален
                        </Heading>
                        <Text className='text-base text-black mt-2'>
                            Ваш аккаунт был полностью удален из базы данных
                            платформы <b>MyStream</b>. Все ваши данные были
                            удалены без возможности восстановления.
                        </Text>
                    </Section>

                    <Section className='bg-white text-black text-center rounded-lg shadow-md p-6 mb-4'>
                        <Text>
                            Вы больше не будете получать уведомления на почту и в Telegtam
                        </Text> 
                        <Text>
                            Если вы захотите вернуться на платформу, вы можете
                            зарегистрироваться по следующей ссылке:
                        </Text> 
                        <Link 
                            href={registerLink}
                            className='inline-flex justify-center items-center
                            rounded-md mt-2 text-sm font-medium text-white
                            bg-[#18B9AE] px-5 py-2 rounded-full'
                            >
                                Зарегистрироваться на MyStream
                        </Link>
                        
                     </Section>
                    <Section className='text-center text-black'>
                        <Text>
                            Спасибо, что были с нами! Мы всегда будем рады видеть вас
                            на платформе <b>MyStream</b>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}