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
      public: true
    });

    const table = new sst.aws.Dynamo("PitchingSignups", {
      fields: {
        startup: "string",
        website: "string",
        email: "string",
        firstname: "string",
        lastname: "string",
        pitchdeck: "string",
      },
      primaryIndex: { hashKey: "startup", rangeKey: "email" },
      localIndexes: {
        WebsiteIndex: { rangeKey: "website" },
        FirstnameIndex: { rangeKey: "firstname" },
        LastnameIndex: { rangeKey: "lastname" },
        PitchIndex: { rangeKey: "pitchdeck" },
      },
    });

    new sst.aws.Remix("PitchingSessions", {
      link: [
        bucket,
      ],
    });
  },
});
