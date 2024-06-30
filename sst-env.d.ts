/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    AddRegistration: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
    GetRegistrations: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
    PitchingSessions: {
      type: "sst.aws.Remix"
      url: string
    }
    PitchingSessionsBucket: {
      name: string
      type: "sst.aws.Bucket"
    }
    SlackWebhookUrl: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}