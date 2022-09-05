const axios = require('axios');
const { type } = require('express/lib/response');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

//  types
const CharactersListType = new GraphQLObjectType({
  name: 'CharactersList',
  description: "data for characters' list",
  fields: () => ({
    count: { type: GraphQLInt },
    next: { type: GraphQLString },
    previous: { type: GraphQLString },
    results: {
      type: new GraphQLList(CharacterType),
    },
  }),
});

const FindCharacterType = new GraphQLObjectType({
  name: 'FindCharacter',
  description: "character's data",
  fields: () => ({
    count: { type: GraphQLInt },
    next: { type: GraphQLString },
    previous: { type: GraphQLString },
    results: {
      type: new GraphQLList(CharacterType),
    },
  }),
});

const CharacterType = new GraphQLObjectType({
  name: 'Character',
  description: "character's data",
  fields: () => ({
    name: { type: GraphQLString },
    height: { type: GraphQLString },
    mass: { type: GraphQLString },
    hair_color: { type: GraphQLString },
    skin_color: { type: GraphQLString },
    eye_color: { type: GraphQLString },
    birth_year: { type: GraphQLString },
    gender: { type: GraphQLString },
    homeworld: {
      type: HomeworldType,
      resolve(parent) {
        return axios
          .get(`${parent.homeworld}`)
          .then((res) => res.data)
          .catch((error) => console.error(error));
      },
    },
    films: {
      type: new GraphQLList(FilmType),
      resolve(parent) {
        return parent.films.map(
          async (film) =>
            await axios
              .get(`${film}`)
              .then((res) => res.data)
              .catch((error) => console.error(error))
        );
      },
    },
    vehicles: {
      type: new GraphQLList(VehiclesType),
      resolve(parent) {
        return parent.vehicles.map(
          async (vehicle) =>
            await axios
              .get(`${vehicle}`)
              .then((res) => res.data)
              .catch((error) => console.error(error))
        );
      },
    },
    starships: {
      type: new GraphQLList(StarshipsType),
      resolve(parent) {
        return parent.starships.map(
          async (starship) =>
            await axios
              .get(`${starship}`)
              .then((res) => res.data)
              .catch((error) => console.error(error))
        );
      },
    },
    created: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});

const HomeworldType = new GraphQLObjectType({
  name: 'Homeworld',
  fields: () => ({
    name: { type: GraphQLString },
  }),
});

const FilmType = new GraphQLObjectType({
  name: 'Films',
  fields: () => ({
    title: { type: GraphQLString },
    episode_id: { type: GraphQLInt },
  }),
});

const VehiclesType = new GraphQLObjectType({
  name: 'Vehicles',
  fields: () => ({
    name: { type: GraphQLString },
    created: { type: GraphQLString },
  }),
});

const StarshipsType = new GraphQLObjectType({
  name: 'Starships',
  fields: () => ({
    name: { type: GraphQLString },
    created: { type: GraphQLString },
  }),
});

// root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'in charactersList page is from 1 to 9',
  fields: {
    charactersList: {
      type: CharactersListType,
      description: 'list of all characters',
      args: {
        page: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (parent, args) => {
        return await axios
          .get(`https://swapi.dev/api/people/?page=${args.page}`)
          .then((res) => res.data)
          .catch((error) => console.error(error));
      },
    },
    characterDetails: {
      type: CharacterType,
      description: 'details od specific character',
      args: {
        url: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (parent, args) => {
        return await axios
          .get(`${args.url}`)
          .then((res) => res.data)
          .catch((error) => console.error(error));
      },
    },
    findCharacter: {
      type: FindCharacterType,
      description: 'searching character by name',
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        page: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (parent, args) => {
        return await axios
          .get(
            `https://swapi.dev/api/people/?search=${args.name}&page=${args.page}`
          )
          .then((res) => res.data)
          .catch((error) => console.error(error));
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
