"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = exports.inngest = void 0;
const inngest_1 = require("inngest");
// Namizədlik müraciəti, email bildirişləri və s. üçün Inngest müştərisi
exports.inngest = new inngest_1.Inngest({ id: "job-board-app" });
// Background functions examples
exports.helloWorld = exports.inngest.createFunction({ id: "hello-world" }, { event: "test/hello.world" }, async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Salam, ${event.data.name}!` };
});
