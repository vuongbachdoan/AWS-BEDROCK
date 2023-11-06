// Import the BedrockRuntimeClient and InvokeModelCommand from the AWS SDK
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize the BedrockRuntimeClient
const client = new BedrockRuntimeClient({ region: "us-east-1" });

// Define the AWS Lambda handler
export const handler = async (event, context) => {
    // Construct the input for the InvokeModelCommand
    const input = {
        modelId: "anthropic.claude-v2",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            prompt: "\n\nHuman:" + JSON.parse(event.body).prompt + "\n\nAssistant:", // Get input string from user
            max_tokens_to_sample: 100,
            temperature: 0.1,
            top_p: 0.9,
        })
    };


    // Invoke the model and handle the response
    try {

        const data = await client.send(new InvokeModelCommand(input));
        const jsonString = Buffer.from(data.body).toString('utf8');
        const parsedData = JSON.parse(jsonString);
        const text = parsedData.completion;

        return {
            statusCode: 200,
            body: text // Return the result as the body of the response
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        };
    }
};
