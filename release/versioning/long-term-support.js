/**
 * @license
 * Copyright Google LLC All Rights Reserved.
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
        define("@angular/dev-infra-private/release/versioning/long-term-support", ["require", "exports", "tslib", "semver", "@angular/dev-infra-private/release/versioning/npm-registry"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLtsNpmDistTagOfMajor = exports.computeLtsEndDateOfMajor = exports.fetchLongTermSupportBranchesFromNpm = void 0;
    var tslib_1 = require("tslib");
    var semver = require("semver");
    var npm_registry_1 = require("@angular/dev-infra-private/release/versioning/npm-registry");
    /**
     * Number of months a major version in Angular is actively supported. See:
     * https://angular.io/guide/releases#support-policy-and-schedule.
     */
    var majorActiveSupportDuration = 6;
    /**
     * Number of months a major version has active long-term support. See:
     * https://angular.io/guide/releases#support-policy-and-schedule.
     */
    var majorLongTermSupportDuration = 12;
    /** Regular expression that matches LTS NPM dist tags. */
    var ltsNpmDistTagRegex = /^v(\d+)-lts$/;
    /** Finds all long-term support release trains from the specified NPM package. */
    function fetchLongTermSupportBranchesFromNpm(config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, distTags, time, today, active, inactive, npmDistTag, version, branchName, majorReleaseDate, ltsEndDate, ltsBranch;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, npm_registry_1.fetchProjectNpmPackageInfo(config)];
                    case 1:
                        _a = _b.sent(), distTags = _a["dist-tags"], time = _a.time;
                        today = new Date();
                        active = [];
                        inactive = [];
                        // Iterate through the NPM package information and determine active/inactive LTS versions with
                        // their corresponding branches. We assume that an LTS tagged version in NPM belongs to the
                        // last-minor branch of a given major (i.e. we assume there are no outdated LTS NPM dist tags).
                        for (npmDistTag in distTags) {
                            if (ltsNpmDistTagRegex.test(npmDistTag)) {
                                version = semver.parse(distTags[npmDistTag]);
                                branchName = version.major + "." + version.minor + ".x";
                                majorReleaseDate = new Date(time[version.major + ".0.0"]);
                                ltsEndDate = computeLtsEndDateOfMajor(majorReleaseDate);
                                ltsBranch = { name: branchName, version: version, npmDistTag: npmDistTag };
                                // Depending on whether the LTS phase is still active, add the branch
                                // to the list of active or inactive LTS branches.
                                if (today <= ltsEndDate) {
                                    active.push(ltsBranch);
                                }
                                else {
                                    inactive.push(ltsBranch);
                                }
                            }
                        }
                        // Sort LTS branches in descending order. i.e. most recent ones first.
                        active.sort(function (a, b) { return semver.rcompare(a.version, b.version); });
                        inactive.sort(function (a, b) { return semver.rcompare(a.version, b.version); });
                        return [2 /*return*/, { active: active, inactive: inactive }];
                }
            });
        });
    }
    exports.fetchLongTermSupportBranchesFromNpm = fetchLongTermSupportBranchesFromNpm;
    /**
     * Computes the date when long-term support ends for a major released at the
     * specified date.
     */
    function computeLtsEndDateOfMajor(majorReleaseDate) {
        return new Date(majorReleaseDate.getFullYear(), majorReleaseDate.getMonth() + majorActiveSupportDuration + majorLongTermSupportDuration, majorReleaseDate.getDate(), majorReleaseDate.getHours(), majorReleaseDate.getMinutes(), majorReleaseDate.getSeconds(), majorReleaseDate.getMilliseconds());
    }
    exports.computeLtsEndDateOfMajor = computeLtsEndDateOfMajor;
    /** Gets the long-term support NPM dist tag for a given major version. */
    function getLtsNpmDistTagOfMajor(major) {
        // LTS versions should be tagged in NPM in the following format: `v{major}-lts`.
        return "v" + major + "-lts";
    }
    exports.getLtsNpmDistTagOfMajor = getLtsNpmDistTagOfMajor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9uZy10ZXJtLXN1cHBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9kZXYtaW5mcmEvcmVsZWFzZS92ZXJzaW9uaW5nL2xvbmctdGVybS1zdXBwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFJakMsMkZBQTBEO0lBb0IxRDs7O09BR0c7SUFDSCxJQUFNLDBCQUEwQixHQUFHLENBQUMsQ0FBQztJQUVyQzs7O09BR0c7SUFDSCxJQUFNLDRCQUE0QixHQUFHLEVBQUUsQ0FBQztJQUV4Qyx5REFBeUQ7SUFDekQsSUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUM7SUFFMUMsaUZBQWlGO0lBQ2pGLFNBQXNCLG1DQUFtQyxDQUFDLE1BQXFCOzs7Ozs0QkFFdkMscUJBQU0seUNBQTBCLENBQUMsTUFBTSxDQUFDLEVBQUE7O3dCQUF4RSxLQUFnQyxTQUF3QyxFQUExRCxRQUFRLGtCQUFBLEVBQUUsSUFBSSxVQUFBO3dCQUM1QixLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3QkFDbkIsTUFBTSxHQUFnQixFQUFFLENBQUM7d0JBQ3pCLFFBQVEsR0FBZ0IsRUFBRSxDQUFDO3dCQUVqQyw4RkFBOEY7d0JBQzlGLDJGQUEyRjt3QkFDM0YsK0ZBQStGO3dCQUMvRixLQUFXLFVBQVUsSUFBSSxRQUFRLEVBQUU7NEJBQ2pDLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dDQUNqQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUUsQ0FBQztnQ0FDOUMsVUFBVSxHQUFNLE9BQU8sQ0FBQyxLQUFLLFNBQUksT0FBTyxDQUFDLEtBQUssT0FBSSxDQUFDO2dDQUNuRCxnQkFBZ0IsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUksT0FBTyxDQUFDLEtBQUssU0FBTSxDQUFDLENBQUMsQ0FBQztnQ0FDMUQsVUFBVSxHQUFHLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0NBQ3hELFNBQVMsR0FBYyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxTQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUMsQ0FBQztnQ0FDckUscUVBQXFFO2dDQUNyRSxrREFBa0Q7Z0NBQ2xELElBQUksS0FBSyxJQUFJLFVBQVUsRUFBRTtvQ0FDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQ0FDeEI7cUNBQU07b0NBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQ0FDMUI7NkJBQ0Y7eUJBQ0Y7d0JBRUQsc0VBQXNFO3dCQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQXJDLENBQXFDLENBQUMsQ0FBQzt3QkFDN0QsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFyQyxDQUFxQyxDQUFDLENBQUM7d0JBRS9ELHNCQUFPLEVBQUMsTUFBTSxRQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUMsRUFBQzs7OztLQUMzQjtJQWhDRCxrRkFnQ0M7SUFFRDs7O09BR0c7SUFDSCxTQUFnQix3QkFBd0IsQ0FBQyxnQkFBc0I7UUFDN0QsT0FBTyxJQUFJLElBQUksQ0FDWCxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsRUFDOUIsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEdBQUcsMEJBQTBCLEdBQUcsNEJBQTRCLEVBQ3ZGLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxFQUFFLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxFQUFFLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxFQUN0RixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFORCw0REFNQztJQUVELHlFQUF5RTtJQUN6RSxTQUFnQix1QkFBdUIsQ0FBQyxLQUFhO1FBQ25ELGdGQUFnRjtRQUNoRixPQUFPLE1BQUksS0FBSyxTQUFNLENBQUM7SUFDekIsQ0FBQztJQUhELDBEQUdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuXG5pbXBvcnQge1JlbGVhc2VDb25maWd9IGZyb20gJy4uL2NvbmZpZy9pbmRleCc7XG5cbmltcG9ydCB7ZmV0Y2hQcm9qZWN0TnBtUGFja2FnZUluZm99IGZyb20gJy4vbnBtLXJlZ2lzdHJ5JztcblxuLyoqIEludGVyZmFjZSBkZXNjcmliaW5nIGRldGVybWluZWQgTFRTIGJyYW5jaGVzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBMdHNCcmFuY2hlcyB7XG4gIC8qKiBMaXN0IG9mIGFjdGl2ZSBMVFMgdmVyc2lvbiBicmFuY2hlcy4gKi9cbiAgYWN0aXZlOiBMdHNCcmFuY2hbXTtcbiAgLyoqIExpc3Qgb2YgaW5hY3RpdmUgTFRTIHZlcnNpb24gYnJhbmNoZXMuICovXG4gIGluYWN0aXZlOiBMdHNCcmFuY2hbXTtcbn1cblxuLyoqIEludGVyZmFjZSBkZXNjcmliaW5nIGFuIExUUyB2ZXJzaW9uIGJyYW5jaC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTHRzQnJhbmNoIHtcbiAgLyoqIE5hbWUgb2YgdGhlIGJyYW5jaC4gKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKiogTW9zdCByZWNlbnQgdmVyc2lvbiBmb3IgdGhlIGdpdmVuIExUUyBicmFuY2guICovXG4gIHZlcnNpb246IHNlbXZlci5TZW1WZXI7XG4gIC8qKiBOUE0gZGlzdCB0YWcgZm9yIHRoZSBMVFMgdmVyc2lvbi4gKi9cbiAgbnBtRGlzdFRhZzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE51bWJlciBvZiBtb250aHMgYSBtYWpvciB2ZXJzaW9uIGluIEFuZ3VsYXIgaXMgYWN0aXZlbHkgc3VwcG9ydGVkLiBTZWU6XG4gKiBodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvcmVsZWFzZXMjc3VwcG9ydC1wb2xpY3ktYW5kLXNjaGVkdWxlLlxuICovXG5jb25zdCBtYWpvckFjdGl2ZVN1cHBvcnREdXJhdGlvbiA9IDY7XG5cbi8qKlxuICogTnVtYmVyIG9mIG1vbnRocyBhIG1ham9yIHZlcnNpb24gaGFzIGFjdGl2ZSBsb25nLXRlcm0gc3VwcG9ydC4gU2VlOlxuICogaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL3JlbGVhc2VzI3N1cHBvcnQtcG9saWN5LWFuZC1zY2hlZHVsZS5cbiAqL1xuY29uc3QgbWFqb3JMb25nVGVybVN1cHBvcnREdXJhdGlvbiA9IDEyO1xuXG4vKiogUmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyBMVFMgTlBNIGRpc3QgdGFncy4gKi9cbmNvbnN0IGx0c05wbURpc3RUYWdSZWdleCA9IC9edihcXGQrKS1sdHMkLztcblxuLyoqIEZpbmRzIGFsbCBsb25nLXRlcm0gc3VwcG9ydCByZWxlYXNlIHRyYWlucyBmcm9tIHRoZSBzcGVjaWZpZWQgTlBNIHBhY2thZ2UuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hMb25nVGVybVN1cHBvcnRCcmFuY2hlc0Zyb21OcG0oY29uZmlnOiBSZWxlYXNlQ29uZmlnKTpcbiAgICBQcm9taXNlPEx0c0JyYW5jaGVzPiB7XG4gIGNvbnN0IHsnZGlzdC10YWdzJzogZGlzdFRhZ3MsIHRpbWV9ID0gYXdhaXQgZmV0Y2hQcm9qZWN0TnBtUGFja2FnZUluZm8oY29uZmlnKTtcbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBhY3RpdmU6IEx0c0JyYW5jaFtdID0gW107XG4gIGNvbnN0IGluYWN0aXZlOiBMdHNCcmFuY2hbXSA9IFtdO1xuXG4gIC8vIEl0ZXJhdGUgdGhyb3VnaCB0aGUgTlBNIHBhY2thZ2UgaW5mb3JtYXRpb24gYW5kIGRldGVybWluZSBhY3RpdmUvaW5hY3RpdmUgTFRTIHZlcnNpb25zIHdpdGhcbiAgLy8gdGhlaXIgY29ycmVzcG9uZGluZyBicmFuY2hlcy4gV2UgYXNzdW1lIHRoYXQgYW4gTFRTIHRhZ2dlZCB2ZXJzaW9uIGluIE5QTSBiZWxvbmdzIHRvIHRoZVxuICAvLyBsYXN0LW1pbm9yIGJyYW5jaCBvZiBhIGdpdmVuIG1ham9yIChpLmUuIHdlIGFzc3VtZSB0aGVyZSBhcmUgbm8gb3V0ZGF0ZWQgTFRTIE5QTSBkaXN0IHRhZ3MpLlxuICBmb3IgKGNvbnN0IG5wbURpc3RUYWcgaW4gZGlzdFRhZ3MpIHtcbiAgICBpZiAobHRzTnBtRGlzdFRhZ1JlZ2V4LnRlc3QobnBtRGlzdFRhZykpIHtcbiAgICAgIGNvbnN0IHZlcnNpb24gPSBzZW12ZXIucGFyc2UoZGlzdFRhZ3NbbnBtRGlzdFRhZ10pITtcbiAgICAgIGNvbnN0IGJyYW5jaE5hbWUgPSBgJHt2ZXJzaW9uLm1ham9yfS4ke3ZlcnNpb24ubWlub3J9LnhgO1xuICAgICAgY29uc3QgbWFqb3JSZWxlYXNlRGF0ZSA9IG5ldyBEYXRlKHRpbWVbYCR7dmVyc2lvbi5tYWpvcn0uMC4wYF0pO1xuICAgICAgY29uc3QgbHRzRW5kRGF0ZSA9IGNvbXB1dGVMdHNFbmREYXRlT2ZNYWpvcihtYWpvclJlbGVhc2VEYXRlKTtcbiAgICAgIGNvbnN0IGx0c0JyYW5jaDogTHRzQnJhbmNoID0ge25hbWU6IGJyYW5jaE5hbWUsIHZlcnNpb24sIG5wbURpc3RUYWd9O1xuICAgICAgLy8gRGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIExUUyBwaGFzZSBpcyBzdGlsbCBhY3RpdmUsIGFkZCB0aGUgYnJhbmNoXG4gICAgICAvLyB0byB0aGUgbGlzdCBvZiBhY3RpdmUgb3IgaW5hY3RpdmUgTFRTIGJyYW5jaGVzLlxuICAgICAgaWYgKHRvZGF5IDw9IGx0c0VuZERhdGUpIHtcbiAgICAgICAgYWN0aXZlLnB1c2gobHRzQnJhbmNoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluYWN0aXZlLnB1c2gobHRzQnJhbmNoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTb3J0IExUUyBicmFuY2hlcyBpbiBkZXNjZW5kaW5nIG9yZGVyLiBpLmUuIG1vc3QgcmVjZW50IG9uZXMgZmlyc3QuXG4gIGFjdGl2ZS5zb3J0KChhLCBiKSA9PiBzZW12ZXIucmNvbXBhcmUoYS52ZXJzaW9uLCBiLnZlcnNpb24pKTtcbiAgaW5hY3RpdmUuc29ydCgoYSwgYikgPT4gc2VtdmVyLnJjb21wYXJlKGEudmVyc2lvbiwgYi52ZXJzaW9uKSk7XG5cbiAgcmV0dXJuIHthY3RpdmUsIGluYWN0aXZlfTtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgZGF0ZSB3aGVuIGxvbmctdGVybSBzdXBwb3J0IGVuZHMgZm9yIGEgbWFqb3IgcmVsZWFzZWQgYXQgdGhlXG4gKiBzcGVjaWZpZWQgZGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVMdHNFbmREYXRlT2ZNYWpvcihtYWpvclJlbGVhc2VEYXRlOiBEYXRlKTogRGF0ZSB7XG4gIHJldHVybiBuZXcgRGF0ZShcbiAgICAgIG1ham9yUmVsZWFzZURhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICAgIG1ham9yUmVsZWFzZURhdGUuZ2V0TW9udGgoKSArIG1ham9yQWN0aXZlU3VwcG9ydER1cmF0aW9uICsgbWFqb3JMb25nVGVybVN1cHBvcnREdXJhdGlvbixcbiAgICAgIG1ham9yUmVsZWFzZURhdGUuZ2V0RGF0ZSgpLCBtYWpvclJlbGVhc2VEYXRlLmdldEhvdXJzKCksIG1ham9yUmVsZWFzZURhdGUuZ2V0TWludXRlcygpLFxuICAgICAgbWFqb3JSZWxlYXNlRGF0ZS5nZXRTZWNvbmRzKCksIG1ham9yUmVsZWFzZURhdGUuZ2V0TWlsbGlzZWNvbmRzKCkpO1xufVxuXG4vKiogR2V0cyB0aGUgbG9uZy10ZXJtIHN1cHBvcnQgTlBNIGRpc3QgdGFnIGZvciBhIGdpdmVuIG1ham9yIHZlcnNpb24uICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0THRzTnBtRGlzdFRhZ09mTWFqb3IobWFqb3I6IG51bWJlcik6IHN0cmluZyB7XG4gIC8vIExUUyB2ZXJzaW9ucyBzaG91bGQgYmUgdGFnZ2VkIGluIE5QTSBpbiB0aGUgZm9sbG93aW5nIGZvcm1hdDogYHZ7bWFqb3J9LWx0c2AuXG4gIHJldHVybiBgdiR7bWFqb3J9LWx0c2A7XG59XG4iXX0=