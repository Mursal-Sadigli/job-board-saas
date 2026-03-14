import { Inngest } from "inngest";

// Namizədlik müraciəti, email bildirişləri və s. üçün Inngest müştərisi
export const inngest = new Inngest({ id: "job-board-app" });

// Background functions examples
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Salam, ${event.data.name}!` };
  }
);
