"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Define a pasta de assets estáticos (por exemplo, imagens, CSS, etc.)
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    // Define a pasta onde ficarão as views (templates)
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    // Define o EJS como template engine
    app.setViewEngine('ejs');
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map