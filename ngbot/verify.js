(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/dev-infra-private/ngbot/verify", ["require", "exports", "fs", "path", "yaml", "@angular/dev-infra-private/utils/config", "@angular/dev-infra-private/utils/console"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verify = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var fs_1 = require("fs");
    var path_1 = require("path");
    var yaml_1 = require("yaml");
    var config_1 = require("@angular/dev-infra-private/utils/config");
    var console_1 = require("@angular/dev-infra-private/utils/console");
    function verify() {
        /** Full path to NgBot config file */
        var NGBOT_CONFIG_YAML_PATH = path_1.resolve(config_1.getRepoBaseDir(), '.github/angular-robot.yml');
        /** The NgBot config file */
        var ngBotYaml = fs_1.readFileSync(NGBOT_CONFIG_YAML_PATH, 'utf8');
        try {
            // Try parsing the config file to verify that the syntax is correct.
            yaml_1.parse(ngBotYaml);
            console_1.info(console_1.green('√') + "  Valid NgBot YAML config");
        }
        catch (e) {
            console_1.error(console_1.red('!') + " Invalid NgBot YAML config");
            console_1.error(e);
            process.exitCode = 1;
        }
    }
    exports.verify = verify;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyaWZ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL25nYm90L3ZlcmlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCx5QkFBZ0M7SUFDaEMsNkJBQTZCO0lBQzdCLDZCQUF3QztJQUV4QyxrRUFBK0M7SUFDL0Msb0VBQXlEO0lBRXpELFNBQWdCLE1BQU07UUFDcEIscUNBQXFDO1FBQ3JDLElBQU0sc0JBQXNCLEdBQUcsY0FBTyxDQUFDLHVCQUFjLEVBQUUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBRXRGLDRCQUE0QjtRQUM1QixJQUFNLFNBQVMsR0FBRyxpQkFBWSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9ELElBQUk7WUFDRixvRUFBb0U7WUFDcEUsWUFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JCLGNBQUksQ0FBSSxlQUFLLENBQUMsR0FBRyxDQUFDLDhCQUEyQixDQUFDLENBQUM7U0FDaEQ7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLGVBQUssQ0FBSSxhQUFHLENBQUMsR0FBRyxDQUFDLCtCQUE0QixDQUFDLENBQUM7WUFDL0MsZUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBaEJELHdCQWdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtyZWFkRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCB7cmVzb2x2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQge3BhcnNlIGFzIHBhcnNlWWFtbH0gZnJvbSAneWFtbCc7XG5cbmltcG9ydCB7Z2V0UmVwb0Jhc2VEaXJ9IGZyb20gJy4uL3V0aWxzL2NvbmZpZyc7XG5pbXBvcnQge2Vycm9yLCBncmVlbiwgaW5mbywgcmVkfSBmcm9tICcuLi91dGlscy9jb25zb2xlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeSgpIHtcbiAgLyoqIEZ1bGwgcGF0aCB0byBOZ0JvdCBjb25maWcgZmlsZSAqL1xuICBjb25zdCBOR0JPVF9DT05GSUdfWUFNTF9QQVRIID0gcmVzb2x2ZShnZXRSZXBvQmFzZURpcigpLCAnLmdpdGh1Yi9hbmd1bGFyLXJvYm90LnltbCcpO1xuXG4gIC8qKiBUaGUgTmdCb3QgY29uZmlnIGZpbGUgKi9cbiAgY29uc3QgbmdCb3RZYW1sID0gcmVhZEZpbGVTeW5jKE5HQk9UX0NPTkZJR19ZQU1MX1BBVEgsICd1dGY4Jyk7XG5cbiAgdHJ5IHtcbiAgICAvLyBUcnkgcGFyc2luZyB0aGUgY29uZmlnIGZpbGUgdG8gdmVyaWZ5IHRoYXQgdGhlIHN5bnRheCBpcyBjb3JyZWN0LlxuICAgIHBhcnNlWWFtbChuZ0JvdFlhbWwpO1xuICAgIGluZm8oYCR7Z3JlZW4oJ+KImicpfSAgVmFsaWQgTmdCb3QgWUFNTCBjb25maWdgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yKGAke3JlZCgnIScpfSBJbnZhbGlkIE5nQm90IFlBTUwgY29uZmlnYCk7XG4gICAgZXJyb3IoZSk7XG4gICAgcHJvY2Vzcy5leGl0Q29kZSA9IDE7XG4gIH1cbn1cbiJdfQ==