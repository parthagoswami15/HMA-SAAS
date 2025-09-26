"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVitalsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_vitals_dto_1 = require("./create-vitals.dto");
class UpdateVitalsDto extends (0, swagger_1.PartialType)(create_vitals_dto_1.CreateVitalsDto) {
}
exports.UpdateVitalsDto = UpdateVitalsDto;
//# sourceMappingURL=update-vitals.dto.js.map