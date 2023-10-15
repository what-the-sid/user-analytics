
# User Analytics Scripts

This Node.js project is hosted on AWS Lambda using the Serverless framework.

## API Documentation
You can find the API documentation [here](https://documenter.getpostman.com/view/25655079/2s9YR6ZDsX)

## Project Structure

The project structure is organized as follows:

-   `src/` directory contains the source code for the project.
-   `scripts/` directory is the output folder for the build process.

## Available NPM Scripts

You can run the following NPM scripts to build, lint, and preview your project:

1.  **Build** - This script builds the project and places the output in the `scripts/` directory.

    bashCopy code

    `npm run build`



## Available Scripts

### 1. GET Analytics

-   **Description:** This API provides analytics data based on query parameters "dateFrom" and "dateTo".

-   **URL:** `/get-analytics`

-   **Response Format:**

```json
{
    "statusACount": 16,
    "statusBCount": 5,
    "uniqueUsers": 7,
    "unknownUsersCount": 5,
    "logId": "b9aafd71-8730-4862-863d-f9012bffca58",
    "data": [
        {
            "runtime": 0.2,
            "statusCode": 200,
            "userId": "dshjsjdhb-bhjsdjhbdsbjh",
            "status": "SUCCESS",
            "timeStamp": "2023-10-14T03:13:11.891Z",
            "name": "hello-world",
            "method": "POST",
            "requestId": "b4469563-dd80-4beb-9f2f-ee85a3d3f4d6"
        }
    ],
    "success": true
}
```




### 2. GET Logs

-   **Description:** This API fetches logs from an S3 file based on the "key" query parameter.

-   **URL:** `/get-logs`

-   **Response Format:**

    ````json
    {
        "requestBody": {
            "userId": "dexexde-dmlkdsx"
        },
        "response": {
            "msg": "hello world",
            "success": true
        },
        "requestHeaders": {
            // Request headers details here
        },
        "success": true
    }
    ````


### 3. Hello World

-   **Description:** This is a POST API that returns a simple message.

-   **URL:** `/hello-world`

-   **Request Payload:**


```json
    {
        "userId": "your-user-id"
    }
```

-   **Response Format:**

```json
{
        "msg": "hello world",
        "success": true
}
```


### 4. Save Log

-   **Description:** This script is triggered by an SQS event. It saves the API logs to S3 and metadata to DynamoDB.

-   **Sample DynamoDB Entry:**

    ```json
    {
        "runtime": 0.2, //runtime of the hello-world API
        "statusCode": 200, //status code returned by hello-world API
        "userId": "dshjsjdhb-bhjsdjhbdsbjh", //userID in payload
        "status": "SUCCESS", //status returned by hello-world API
        "timeStamp": "2023-10-14T03:13:11.891Z", //time of request
        "name": "hello-world", //API Name
        "method": "POST", //API Method
        "requestId": "b4469563-dd80-4beb-9f2f-ee85a3d3f4d6" //Unique request Id
    }
    ```
System Structure:

![System Architecture](https://user-analytics-cdn.s3.ap-south-1.amazonaws.com/user-analytics.jpg)

----------
