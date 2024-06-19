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
    const vpc = new sst.aws.Vpc("MyVpc");
    const rds = new sst.aws.Postgres("MyPostgres", { vpc });

    // post function to save the form data into the database
    const api = new sst.aws.Function("MyApi", {
      url: true,
      link: [rds],
      handler: "src/api.handler",
    });

    // bucket for the pitching decks
    const bucket = new sst.aws.Bucket("PitchingSessionsBucket", {
      public: true
    });

    new sst.aws.Remix("PitchingSessions", {
      link: [
        bucket,
        rds,
      ],
    });

    return {
      api: api.url,
    }
  },
});
