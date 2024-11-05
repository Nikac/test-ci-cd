export const typeDefs = `#graphql
    type Record {
        _id: ID!
        name: String!
        position: String!
        level: String!
    }

    type Query {
        record(id: ID!): Record
        records: [Record!]
    }

    type Mutation {
        createRecord(record: NewRecordInput!): Record!
        updateRecord(record: UpdateRecordInput!, id: ID!): Record!
        deleteRecord(id: ID!): Boolean!
    }

    input NewRecordInput {
        name: String!
        position: String!
        level: String!
    }
    input UpdateRecordInput {
        name: String
        position: String
        level: String
    }
`;
