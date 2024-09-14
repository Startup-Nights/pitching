/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "PitchingSessions",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("PitchingSessionsBucket", {
      public: true,
    });
    const slackWebhookUrl = new sst.Secret("SlackWebhookUrl");
    const get_registrations = new sst.aws.Function("GetRegistrations", {
      url: true,
      link: [bucket],
      handler: "src/get_registrations.handler",
    });
    const add_registration = new sst.aws.Function("AddRegistration", {
      url: true,
      link: [bucket, slackWebhookUrl],
      handler: "src/add_registration.handler",
    });
    new sst.aws.Remix("PitchingSessions", {
      link: [bucket, get_registrations, add_registration],
    });
  },
});
