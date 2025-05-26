import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import type { SessionMetadata } from "@/src/shared/types/session-metadata.types"
import * as React from "react"

interface PasswordRecaveryTemplateProps{
    domain: string
    token: string
    metadata: SessionMetadata
}

export function PasswordRecaveryTemplate({ domain, token, metadata }: PasswordRecaveryTemplateProps){
    const resetLink = `${domain}/account/recovery/${token}`

    return (
        <Html>
            <Head />
            <Preview>Сброс пароля</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-56'>
                <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                        Сброс пароля
                        </Heading>
                        <Text className='text-base text-black mt-2'>
                             Вы запросили сбрось пароля для вашей учетной записи.
                        </Text>
                        <Text className='text-base text-black mt-2'>
                             Чтобы создать новый пароль нажмине на кнопку ниже: 
                        </Text>
                        <Link href={resetLink} className='inline-flex 
                        justify-centr itens-centr rounded-full text-sm
                        fount-medium text-white bg-[#18B9AE] px-5 py-2'>
                            Сбросить пароль
                        </Link>
                    </Section>
                    <Section className='bg-gray-100 rounded-lq p-6 mb-6'>
                        <Heading className='text-xl font-semibold text-[#18B9AE]'>
                            Информация о запросе
                        </Heading>
                        <ul className='list-disc list-inside text-black mt-2'>
                            <li>Расположение: {metadata.location.country}.
                                {metadata.location.city}</li>
                            <li>Операционная система: {metadata.device.os}</li>
                            <li>Браузер: {metadata.device.browser}</li>
                            <li>IP-адрес: {metadata.ip}</li>
                        </ul>
                        <Text className='text-gray-600 mt-2'>
                            Если вы не инициализировали этот запрос, пожалуйста,
                            игнорируйте это сообщение
                        </Text>
                    </Section>
                    <Section className='text-center mt-8'>
                        <Text>
                            Если у вас есть вопросы или вы столкнулись с
                            трудностями, не стесняйтесь обращатся в нашу
                            службу поддержки по адресу{' '}
                            <Link
                                href='mailto:thesanchas1310@gmail.com'
                                className='text-[#18b9ae] underline'
                            >
                                thesanchas1310@gmail.com    
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}