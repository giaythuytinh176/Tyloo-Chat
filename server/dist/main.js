"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const response_interceptor_1 = require("./common/interceptor/response.interceptor");
const path_1 = require("path");
const redis_io_adapter_1 = require("./adapters/redis-io.adapter");
const fix_socket_io_bug = require('./fix');
async function bootstrap() {
    await fix_socket_io_bug();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    app.useWebSocketAdapter(new redis_io_adapter_1.RedisIoAdapter(app));
    app.use(logger_middleware_1.logger);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useStaticAssets(path_1.join(__dirname, '../public', '/'), {
        prefix: '/',
        setHeaders: (res) => {
            res.set('Cache-Control', 'max-age=2592000');
        },
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map