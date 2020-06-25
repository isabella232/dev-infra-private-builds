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
        define("@angular/dev-infra-private/utils/git", ["require", "exports", "@angular/dev-infra-private/utils/shelljs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var shelljs_1 = require("@angular/dev-infra-private/utils/shelljs");
    /** Whether the repo has any local changes. */
    function hasLocalChanges() {
        return !!shelljs_1.exec("git status --porcelain").trim();
    }
    exports.hasLocalChanges = hasLocalChanges;
    /** Get the currently checked out branch. */
    function getCurrentBranch() {
        return shelljs_1.exec("git symbolic-ref --short HEAD").trim();
    }
    exports.getCurrentBranch = getCurrentBranch;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3V0aWxzL2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILG9FQUFzQztJQUd0Qyw4Q0FBOEM7SUFDOUMsU0FBZ0IsZUFBZTtRQUM3QixPQUFPLENBQUMsQ0FBQyxjQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRkQsMENBRUM7SUFFRCw0Q0FBNEM7SUFDNUMsU0FBZ0IsZ0JBQWdCO1FBQzlCLE9BQU8sY0FBSSxDQUFDLCtCQUErQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEQsQ0FBQztJQUZELDRDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2V4ZWN9IGZyb20gJy4uL3V0aWxzL3NoZWxsanMnO1xuXG5cbi8qKiBXaGV0aGVyIHRoZSByZXBvIGhhcyBhbnkgbG9jYWwgY2hhbmdlcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNMb2NhbENoYW5nZXMoKSB7XG4gIHJldHVybiAhIWV4ZWMoYGdpdCBzdGF0dXMgLS1wb3JjZWxhaW5gKS50cmltKCk7XG59XG5cbi8qKiBHZXQgdGhlIGN1cnJlbnRseSBjaGVja2VkIG91dCBicmFuY2guICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudEJyYW5jaCgpIHtcbiAgcmV0dXJuIGV4ZWMoYGdpdCBzeW1ib2xpYy1yZWYgLS1zaG9ydCBIRUFEYCkudHJpbSgpO1xufVxuIl19