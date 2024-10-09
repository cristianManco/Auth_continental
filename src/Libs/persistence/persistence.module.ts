import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import dbConfig from './db_config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof dbConfig>) => {
        const { db, env } = configService;
        const isProduction = env === process.env.DATABASE_ENV;
        const uriDb = isProduction
          ? `mongodb+srv://${db.user}:${db.password}@${db.cluster}/${db.atlas}?retryWrites=true&w=majority`
          : `mongodb+srv://${db.user}:${db.password}@${db.cluster}/${db.atlas}?retryWrites=true&w=majority`;

        return {
          uri: uriDb,
        };
      },
      inject: [dbConfig.KEY],
    }),
  ],
})
export class PersistenceModule {}
