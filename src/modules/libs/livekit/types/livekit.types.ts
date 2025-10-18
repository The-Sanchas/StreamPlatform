import type { FactoryProvider, ModuleMetadata } from "@nestjs/common"


export const LiveKitOtionsSumbol = Symbol('LiveKitOtionsSumbol')

export type TypeLivekitOptions = {
    apiUrl: string
    apiKey: string
    apiSecret: string
}

export type TypeLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<TypeLivekitOptions>, 'useFactory' | 'inject'>