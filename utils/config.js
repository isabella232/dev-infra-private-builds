/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/dev-infra-private/utils/config", ["require", "exports", "tslib", "fs", "path", "shelljs", "@angular/dev-infra-private/utils/console", "@angular/dev-infra-private/utils/ts-node"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var fs_1 = require("fs");
    var path_1 = require("path");
    var shelljs_1 = require("shelljs");
    var console_1 = require("@angular/dev-infra-private/utils/console");
    var ts_node_1 = require("@angular/dev-infra-private/utils/ts-node");
    /**
     * The filename expected for creating the ng-dev config, without the file
     * extension to allow either a typescript or javascript file to be used.
     */
    var CONFIG_FILE_NAME = '.ng-dev-config';
    /** The configuration for ng-dev. */
    var CONFIG = null;
    /**
     * Get the configuration from the file system, returning the already loaded
     * copy if it is defined.
     */
    function getConfig() {
        // If the global config is not defined, load it from the file system.
        if (CONFIG === null) {
            // The full path to the configuration file.
            var configPath = path_1.join(getRepoBaseDir(), CONFIG_FILE_NAME);
            // Set the global config object.
            CONFIG = readConfigFile(configPath);
        }
        // Return a clone of the global config to ensure that a new instance of the config is returned
        // each time, preventing unexpected effects of modifications to the config object.
        return validateCommonConfig(tslib_1.__assign({}, CONFIG));
    }
    exports.getConfig = getConfig;
    /** Validate the common configuration has been met for the ng-dev command. */
    function validateCommonConfig(config) {
        var errors = [];
        // Validate the github configuration.
        if (config.github === undefined) {
            errors.push("Github repository not configured. Set the \"github\" option.");
        }
        else {
            if (config.github.name === undefined) {
                errors.push("\"github.name\" is not defined");
            }
            if (config.github.owner === undefined) {
                errors.push("\"github.owner\" is not defined");
            }
        }
        assertNoErrors(errors);
        return config;
    }
    /** Resolves and reads the specified configuration file. */
    function readConfigFile(configPath) {
        // If the the `.ts` extension has not been set up already, and a TypeScript based
        // version of the given configuration seems to exist, set up `ts-node` if available.
        if (require.extensions['.ts'] === undefined && fs_1.existsSync(configPath + ".ts") &&
            ts_node_1.isTsNodeAvailable()) {
            // Ensure the module target is set to `commonjs`. This is necessary because the
            // dev-infra tool runs in NodeJS which does not support ES modules by default.
            // Additionally, set the `dir` option to the directory that contains the configuration
            // file. This allows for custom compiler options (such as `--strict`).
            require('ts-node').register({ dir: path_1.dirname(configPath), transpileOnly: true, compilerOptions: { module: 'commonjs' } });
        }
        try {
            return require(configPath);
        }
        catch (e) {
            console_1.error('Could not read configuration file.');
            console_1.error(e);
            process.exit(1);
        }
    }
    /**
     * Asserts the provided array of error messages is empty. If any errors are in the array,
     * logs the errors and exit the process as a failure.
     */
    function assertNoErrors(errors) {
        var e_1, _a;
        if (errors.length == 0) {
            return;
        }
        console_1.error("Errors discovered while loading configuration file:");
        try {
            for (var errors_1 = tslib_1.__values(errors), errors_1_1 = errors_1.next(); !errors_1_1.done; errors_1_1 = errors_1.next()) {
                var err = errors_1_1.value;
                console_1.error("  - " + err);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (errors_1_1 && !errors_1_1.done && (_a = errors_1.return)) _a.call(errors_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        process.exit(1);
    }
    exports.assertNoErrors = assertNoErrors;
    /** Gets the path of the directory for the repository base. */
    function getRepoBaseDir() {
        var baseRepoDir = shelljs_1.exec("git rev-parse --show-toplevel", { silent: true });
        if (baseRepoDir.code) {
            throw Error("Unable to find the path to the base directory of the repository.\n" +
                "Was the command run from inside of the repo?\n\n" +
                ("ERROR:\n " + baseRepoDir.stderr));
        }
        return baseRepoDir.trim();
    }
    exports.getRepoBaseDir = getRepoBaseDir;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3V0aWxzL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCx5QkFBOEI7SUFDOUIsNkJBQW1DO0lBQ25DLG1DQUE2QjtJQUU3QixvRUFBZ0M7SUFDaEMsb0VBQTRDO0lBd0I1Qzs7O09BR0c7SUFDSCxJQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBRTFDLG9DQUFvQztJQUNwQyxJQUFJLE1BQU0sR0FBWSxJQUFJLENBQUM7SUFFM0I7OztPQUdHO0lBQ0gsU0FBZ0IsU0FBUztRQUN2QixxRUFBcUU7UUFDckUsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ25CLDJDQUEyQztZQUMzQyxJQUFNLFVBQVUsR0FBRyxXQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUM1RCxnQ0FBZ0M7WUFDaEMsTUFBTSxHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztRQUNELDhGQUE4RjtRQUM5RixrRkFBa0Y7UUFDbEYsT0FBTyxvQkFBb0Isc0JBQUssTUFBTSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQVhELDhCQVdDO0lBRUQsNkVBQTZFO0lBQzdFLFNBQVMsb0JBQW9CLENBQUMsTUFBNEI7UUFDeEQsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLHFDQUFxQztRQUNyQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsOERBQTRELENBQUMsQ0FBQztTQUMzRTthQUFNO1lBQ0wsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQThCLENBQUMsQ0FBQzthQUM3QztZQUNELElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUErQixDQUFDLENBQUM7YUFDOUM7U0FDRjtRQUNELGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixPQUFPLE1BQXFCLENBQUM7SUFDL0IsQ0FBQztJQUVELDJEQUEyRDtJQUMzRCxTQUFTLGNBQWMsQ0FBQyxVQUFrQjtRQUN4QyxpRkFBaUY7UUFDakYsb0ZBQW9GO1FBQ3BGLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLElBQUksZUFBVSxDQUFJLFVBQVUsUUFBSyxDQUFDO1lBQ3pFLDJCQUFpQixFQUFFLEVBQUU7WUFDdkIsK0VBQStFO1lBQy9FLDhFQUE4RTtZQUM5RSxzRkFBc0Y7WUFDdEYsc0VBQXNFO1lBQ3RFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQ3ZCLEVBQUMsR0FBRyxFQUFFLGNBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUMsRUFBQyxDQUFDLENBQUM7U0FDN0Y7UUFFRCxJQUFJO1lBQ0YsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDNUI7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLGVBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBQzVDLGVBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBZ0IsY0FBYyxDQUFDLE1BQWdCOztRQUM3QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3RCLE9BQU87U0FDUjtRQUNELGVBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDOztZQUM3RCxLQUFrQixJQUFBLFdBQUEsaUJBQUEsTUFBTSxDQUFBLDhCQUFBLGtEQUFFO2dCQUFyQixJQUFNLEdBQUcsbUJBQUE7Z0JBQ1osZUFBSyxDQUFDLFNBQU8sR0FBSyxDQUFDLENBQUM7YUFDckI7Ozs7Ozs7OztRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQVRELHdDQVNDO0lBRUQsOERBQThEO0lBQzlELFNBQWdCLGNBQWM7UUFDNUIsSUFBTSxXQUFXLEdBQUcsY0FBSSxDQUFDLCtCQUErQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFO1lBQ3BCLE1BQU0sS0FBSyxDQUNQLG9FQUFvRTtnQkFDcEUsa0RBQWtEO2lCQUNsRCxjQUFZLFdBQVcsQ0FBQyxNQUFRLENBQUEsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQVRELHdDQVNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2V4aXN0c1N5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCB7ZGlybmFtZSwgam9pbn0gZnJvbSAncGF0aCc7XG5pbXBvcnQge2V4ZWN9IGZyb20gJ3NoZWxsanMnO1xuXG5pbXBvcnQge2Vycm9yfSBmcm9tICcuL2NvbnNvbGUnO1xuaW1wb3J0IHtpc1RzTm9kZUF2YWlsYWJsZX0gZnJvbSAnLi90cy1ub2RlJztcblxuLyoqXG4gKiBEZXNjcmliZXMgdGhlIEdpdGh1YiBjb25maWd1cmF0aW9uIGZvciBkZXYtaW5mcmEuIFRoaXMgY29uZmlndXJhdGlvbiBpc1xuICogdXNlZCBmb3IgQVBJIHJlcXVlc3RzLCBkZXRlcm1pbmluZyB0aGUgdXBzdHJlYW0gcmVtb3RlLCBldGMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR2l0aHViQ29uZmlnIHtcbiAgLyoqIE93bmVyIG5hbWUgb2YgdGhlIHJlcG9zaXRvcnkuICovXG4gIG93bmVyOiBzdHJpbmc7XG4gIC8qKiBOYW1lIG9mIHRoZSByZXBvc2l0b3J5LiAqL1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8qKiBUaGUgY29tbW9uIGNvbmZpZ3VyYXRpb24gZm9yIG5nLWRldi4gKi9cbnR5cGUgQ29tbW9uQ29uZmlnID0ge1xuICBnaXRodWI6IEdpdGh1YkNvbmZpZ1xufTtcblxuLyoqXG4gKiBUaGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNwZWNpZmljIG5nLWRldiBjb21tYW5kLCBwcm92aWRpbmcgYm90aCB0aGUgY29tbW9uXG4gKiBuZy1kZXYgY29uZmlnIGFzIHdlbGwgYXMgdGhlIHNwZWNpZmljIGNvbmZpZyBvZiBhIHN1YmNvbW1hbmQuXG4gKi9cbmV4cG9ydCB0eXBlIE5nRGV2Q29uZmlnPFQgPSB7fT4gPSBDb21tb25Db25maWcmVDtcblxuLyoqXG4gKiBUaGUgZmlsZW5hbWUgZXhwZWN0ZWQgZm9yIGNyZWF0aW5nIHRoZSBuZy1kZXYgY29uZmlnLCB3aXRob3V0IHRoZSBmaWxlXG4gKiBleHRlbnNpb24gdG8gYWxsb3cgZWl0aGVyIGEgdHlwZXNjcmlwdCBvciBqYXZhc2NyaXB0IGZpbGUgdG8gYmUgdXNlZC5cbiAqL1xuY29uc3QgQ09ORklHX0ZJTEVfTkFNRSA9ICcubmctZGV2LWNvbmZpZyc7XG5cbi8qKiBUaGUgY29uZmlndXJhdGlvbiBmb3IgbmctZGV2LiAqL1xubGV0IENPTkZJRzoge318bnVsbCA9IG51bGw7XG5cbi8qKlxuICogR2V0IHRoZSBjb25maWd1cmF0aW9uIGZyb20gdGhlIGZpbGUgc3lzdGVtLCByZXR1cm5pbmcgdGhlIGFscmVhZHkgbG9hZGVkXG4gKiBjb3B5IGlmIGl0IGlzIGRlZmluZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogTmdEZXZDb25maWcge1xuICAvLyBJZiB0aGUgZ2xvYmFsIGNvbmZpZyBpcyBub3QgZGVmaW5lZCwgbG9hZCBpdCBmcm9tIHRoZSBmaWxlIHN5c3RlbS5cbiAgaWYgKENPTkZJRyA9PT0gbnVsbCkge1xuICAgIC8vIFRoZSBmdWxsIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb24gZmlsZS5cbiAgICBjb25zdCBjb25maWdQYXRoID0gam9pbihnZXRSZXBvQmFzZURpcigpLCBDT05GSUdfRklMRV9OQU1FKTtcbiAgICAvLyBTZXQgdGhlIGdsb2JhbCBjb25maWcgb2JqZWN0LlxuICAgIENPTkZJRyA9IHJlYWRDb25maWdGaWxlKGNvbmZpZ1BhdGgpO1xuICB9XG4gIC8vIFJldHVybiBhIGNsb25lIG9mIHRoZSBnbG9iYWwgY29uZmlnIHRvIGVuc3VyZSB0aGF0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb25maWcgaXMgcmV0dXJuZWRcbiAgLy8gZWFjaCB0aW1lLCBwcmV2ZW50aW5nIHVuZXhwZWN0ZWQgZWZmZWN0cyBvZiBtb2RpZmljYXRpb25zIHRvIHRoZSBjb25maWcgb2JqZWN0LlxuICByZXR1cm4gdmFsaWRhdGVDb21tb25Db25maWcoey4uLkNPTkZJR30pO1xufVxuXG4vKiogVmFsaWRhdGUgdGhlIGNvbW1vbiBjb25maWd1cmF0aW9uIGhhcyBiZWVuIG1ldCBmb3IgdGhlIG5nLWRldiBjb21tYW5kLiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVDb21tb25Db25maWcoY29uZmlnOiBQYXJ0aWFsPE5nRGV2Q29uZmlnPikge1xuICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XG4gIC8vIFZhbGlkYXRlIHRoZSBnaXRodWIgY29uZmlndXJhdGlvbi5cbiAgaWYgKGNvbmZpZy5naXRodWIgPT09IHVuZGVmaW5lZCkge1xuICAgIGVycm9ycy5wdXNoKGBHaXRodWIgcmVwb3NpdG9yeSBub3QgY29uZmlndXJlZC4gU2V0IHRoZSBcImdpdGh1YlwiIG9wdGlvbi5gKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoY29uZmlnLmdpdGh1Yi5uYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBcImdpdGh1Yi5uYW1lXCIgaXMgbm90IGRlZmluZWRgKTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5naXRodWIub3duZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3JzLnB1c2goYFwiZ2l0aHViLm93bmVyXCIgaXMgbm90IGRlZmluZWRgKTtcbiAgICB9XG4gIH1cbiAgYXNzZXJ0Tm9FcnJvcnMoZXJyb3JzKTtcbiAgcmV0dXJuIGNvbmZpZyBhcyBOZ0RldkNvbmZpZztcbn1cblxuLyoqIFJlc29sdmVzIGFuZCByZWFkcyB0aGUgc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24gZmlsZS4gKi9cbmZ1bmN0aW9uIHJlYWRDb25maWdGaWxlKGNvbmZpZ1BhdGg6IHN0cmluZyk6IG9iamVjdCB7XG4gIC8vIElmIHRoZSB0aGUgYC50c2AgZXh0ZW5zaW9uIGhhcyBub3QgYmVlbiBzZXQgdXAgYWxyZWFkeSwgYW5kIGEgVHlwZVNjcmlwdCBiYXNlZFxuICAvLyB2ZXJzaW9uIG9mIHRoZSBnaXZlbiBjb25maWd1cmF0aW9uIHNlZW1zIHRvIGV4aXN0LCBzZXQgdXAgYHRzLW5vZGVgIGlmIGF2YWlsYWJsZS5cbiAgaWYgKHJlcXVpcmUuZXh0ZW5zaW9uc1snLnRzJ10gPT09IHVuZGVmaW5lZCAmJiBleGlzdHNTeW5jKGAke2NvbmZpZ1BhdGh9LnRzYCkgJiZcbiAgICAgIGlzVHNOb2RlQXZhaWxhYmxlKCkpIHtcbiAgICAvLyBFbnN1cmUgdGhlIG1vZHVsZSB0YXJnZXQgaXMgc2V0IHRvIGBjb21tb25qc2AuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgdGhlXG4gICAgLy8gZGV2LWluZnJhIHRvb2wgcnVucyBpbiBOb2RlSlMgd2hpY2ggZG9lcyBub3Qgc3VwcG9ydCBFUyBtb2R1bGVzIGJ5IGRlZmF1bHQuXG4gICAgLy8gQWRkaXRpb25hbGx5LCBzZXQgdGhlIGBkaXJgIG9wdGlvbiB0byB0aGUgZGlyZWN0b3J5IHRoYXQgY29udGFpbnMgdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAvLyBmaWxlLiBUaGlzIGFsbG93cyBmb3IgY3VzdG9tIGNvbXBpbGVyIG9wdGlvbnMgKHN1Y2ggYXMgYC0tc3RyaWN0YCkuXG4gICAgcmVxdWlyZSgndHMtbm9kZScpLnJlZ2lzdGVyKFxuICAgICAgICB7ZGlyOiBkaXJuYW1lKGNvbmZpZ1BhdGgpLCB0cmFuc3BpbGVPbmx5OiB0cnVlLCBjb21waWxlck9wdGlvbnM6IHttb2R1bGU6ICdjb21tb25qcyd9fSk7XG4gIH1cblxuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKGNvbmZpZ1BhdGgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IoJ0NvdWxkIG5vdCByZWFkIGNvbmZpZ3VyYXRpb24gZmlsZS4nKTtcbiAgICBlcnJvcihlKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBc3NlcnRzIHRoZSBwcm92aWRlZCBhcnJheSBvZiBlcnJvciBtZXNzYWdlcyBpcyBlbXB0eS4gSWYgYW55IGVycm9ycyBhcmUgaW4gdGhlIGFycmF5LFxuICogbG9ncyB0aGUgZXJyb3JzIGFuZCBleGl0IHRoZSBwcm9jZXNzIGFzIGEgZmFpbHVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5vRXJyb3JzKGVycm9yczogc3RyaW5nW10pIHtcbiAgaWYgKGVycm9ycy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBlcnJvcihgRXJyb3JzIGRpc2NvdmVyZWQgd2hpbGUgbG9hZGluZyBjb25maWd1cmF0aW9uIGZpbGU6YCk7XG4gIGZvciAoY29uc3QgZXJyIG9mIGVycm9ycykge1xuICAgIGVycm9yKGAgIC0gJHtlcnJ9YCk7XG4gIH1cbiAgcHJvY2Vzcy5leGl0KDEpO1xufVxuXG4vKiogR2V0cyB0aGUgcGF0aCBvZiB0aGUgZGlyZWN0b3J5IGZvciB0aGUgcmVwb3NpdG9yeSBiYXNlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJlcG9CYXNlRGlyKCkge1xuICBjb25zdCBiYXNlUmVwb0RpciA9IGV4ZWMoYGdpdCByZXYtcGFyc2UgLS1zaG93LXRvcGxldmVsYCwge3NpbGVudDogdHJ1ZX0pO1xuICBpZiAoYmFzZVJlcG9EaXIuY29kZSkge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgICBgVW5hYmxlIHRvIGZpbmQgdGhlIHBhdGggdG8gdGhlIGJhc2UgZGlyZWN0b3J5IG9mIHRoZSByZXBvc2l0b3J5LlxcbmAgK1xuICAgICAgICBgV2FzIHRoZSBjb21tYW5kIHJ1biBmcm9tIGluc2lkZSBvZiB0aGUgcmVwbz9cXG5cXG5gICtcbiAgICAgICAgYEVSUk9SOlxcbiAke2Jhc2VSZXBvRGlyLnN0ZGVycn1gKTtcbiAgfVxuICByZXR1cm4gYmFzZVJlcG9EaXIudHJpbSgpO1xufVxuIl19