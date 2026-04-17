export async function queueNotification(input: {
  userId?: string;
  type: "TIP" | "LEAD" | "STATUS" | "SYSTEM";
  title: string;
  body: string;
  href?: string;
}) {
  return {
    queued: true,
    emailStubbed: true,
    notification: input,
  };
}
