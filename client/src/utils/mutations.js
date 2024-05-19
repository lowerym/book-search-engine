import gql from 'graphql-tag';

// `LOGIN_USER` will execute the `loginUser` mutation set up using Apollo Server.
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
  `;

  // `ADD_USER` will execute the `addUser` mutation.
  export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
      addUser(username: $username, email: $email, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
    `;

    // `REMOVE_BOOK` will execute the `removeBook` mutation.
    export const REMOVE_BOOK = gql`
      mutation removeBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
          _id
          username
          email
          bookCount
          savedBooks {
            bookId
            authors
            image
            link
            title
            description
          }
        }
      }
      `;
