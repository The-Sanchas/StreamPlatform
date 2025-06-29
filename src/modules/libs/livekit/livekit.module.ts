import { type DynamicModule, Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { LiveKitOtionsSumbol, type TypeLiveKitAsyncOptions, type TypeLivekitOptions } from './types/livekit.types';

@Module({})
export class LivekitModule {

  public static register(options: TypeLivekitOptions): DynamicModule{

    return {
      module: LivekitModule,
      providers: [
        {
          provide: LiveKitOtionsSumbol,
          useValue: options
        },
        LivekitService
      ],
      exports: [LivekitService],
      global: true
    }
  }

  public static registerAsync(options: TypeLiveKitAsyncOptions): DynamicModule{
    return {
      module: LivekitModule,
      imports: options.imports || [],
      providers: [
        {
          provide: LiveKitOtionsSumbol,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        LivekitService
      ],
      exports: [LivekitService],
      global: true
    }
  }
}


