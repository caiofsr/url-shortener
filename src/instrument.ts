import 'dotenv/config';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration(), Sentry.prismaIntegration()],

  tracesSampleRate: 1.0,

  profilesSampleRate: 1.0,

  environment: process.env.NODE_ENV,

  enabled: process.env.NODE_ENV !== 'development',
  enableTracing: process.env.NODE_ENV !== 'development',

  debug: process.env.NODE_ENV === 'development',
});
