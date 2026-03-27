import { gql } from "@apollo/client";

export const GET_DEPARTMENTS = gql`
  query {
    departments {
      id
      name
    }
  }
`;

