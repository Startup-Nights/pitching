/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    PitchingSessions: {
      type: "sst.aws.Remix"
      url: string
    }
    PitchingSessionsBucket: {
      name: string
      type: "sst.aws.Bucket"
    }
    PitchingSignups: {
      name: string
      type: "sst.aws.Dynamo"
    }
  }
}
export {}