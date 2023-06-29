import { createUserMutation, getUserQuery } from "@/graphQl";
import { GraphQLClient } from "graphql-request";


const isProdcution = process.env.NODE_ENV === 'production';
const apiUrl = isProdcution ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql'
const apiKey = isProdcution ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmeIn'
const serverUrl = isProdcution ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'



const client = new GraphQLClient(apiUrl)
//console.log('CLIENT' , client)

const makeGraphQlRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (err) {
    throw err;
  }
};

export const getUser = (email:string) => {
    client.setHeader('x-api-key',apiKey)
  //  console.log('INSIDE GET USER',client)
    return makeGraphQlRequest(getUserQuery , {email})
}


export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);

  const variables = {
    input: {
      name: name,
      email: email,
      avatarUrl: avatarUrl
    },
  }

//console.log("VARIABLES",variables)

return makeGraphQlRequest(createUserMutation, variables);

};