export const getUserQuery = `
    query getUser($email : String!){
        user(by : {email : $email}){
            id,
            name,
            avatarUrl,
            description,
            githubUrl,
            linkedinUrl
        }
    }
`

export const createUserMutation = `
   mutation createUser($input : UserCreateInput!){
    userCreate(input : $input){
        user {
            name,
            email,
            avatarUrl,
            description,
            linkedinUrl,
            githubUrl,
            id
        }
    }
   }
`
