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
    // bucket for the pitching decks
    const bucket = new sst.aws.Bucket("PitchingSessionsBucket", {
      public: true
    });

    new sst.aws.Remix("PitchingSessions", {
      link: [
        bucket,
      ],
    });
  },
});
