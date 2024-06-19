/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    MyApi: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
    MyPostgres: {
      clusterArn: string
      database: string
      secretArn: string
      type: "sst.aws.Postgres"
    }
    PitchingSessions: {
      type: "sst.aws.Remix"
      url: string
    }
    PitchingSessionsBucket: {
      name: string
      type: "sst.aws.Bucket"
    }
  }
}
export {}