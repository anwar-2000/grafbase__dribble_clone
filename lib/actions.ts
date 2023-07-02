import { ProjectForm } from "@/common.types";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, updateProjectMutation } from "@/graphQl";
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

export const fetchToken = async () =>{
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`)
    return response.json()
  } catch (error) {
      throw error;
  }
}

export const uplaodImage = async (imagePath : string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`,{
        method : 'POST',
        body : JSON.stringify({path : imagePath})
    })

    return response.json()
} catch (error) {
  throw error
}
}

export const createProject = async (form : ProjectForm  , creatorId : string , token : string) =>{
      const imageUrl = await uplaodImage(form.image);
      //console.log(imageUrl ,creatorId)
      if(imageUrl.url){
        client.setHeader("Authorization", `Bearer ${token}`);
        const variables = {
            input : {
              ...form,
              image : imageUrl.url,
              createdBy : {
                link:creatorId
              }
            }
        }
        return makeGraphQlRequest(createProjectMutation,variables)
      }
}

export const fetchProjects = async (category?:string , endcursor?:string) => {
  client.setHeader("x-api-key", apiKey);

  return makeGraphQlRequest(projectsQuery , {category , endcursor})
}

export const fetchProjectDetails = async (id : string) => {
  client.setHeader("x-api-key", apiKey);

  return makeGraphQlRequest(getProjectByIdQuery , {id})
}

export const getUserProjects = (id: string, last?: number) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQlRequest(getProjectsOfUserQuery, { id, last });
};


export const deleteProject = (id: string, token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQlRequest(deleteProjectMutation, { id });
};

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = { ...form };

  const isUploadingNewImage = isBase64DataURL(form.image);

  if (isUploadingNewImage) {
    const imageUrl = await uplaodImage(form.image);

    if (imageUrl.url) {
      updatedForm = { ...updatedForm, image: imageUrl.url };
    }
  }

  client.setHeader("Authorization", `Bearer ${token}`);

  const variables = {
    id: projectId,
    input: updatedForm,
  };

  return makeGraphQlRequest(updateProjectMutation, variables);
};