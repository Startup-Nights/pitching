# voting

```
# local development
# IMPORTANT: use different stage than with 'sst deploy'
sst dev --stage local

# update and deploy changes
sst deploy

# backup the s3 bucket
aws s3 cp s3://<name-of-the-bucket/<optional-folder> . --recursive
```

## Resources

- [sst ion](https://ion.sst.dev/docs/start/aws/remix/)
    - [aws bucket tutorial](https://ion.sst.dev/docs/start/aws/remix/)
    - [drizzle tutorial](https://ion.sst.dev/docs/start/aws/drizzle/)
