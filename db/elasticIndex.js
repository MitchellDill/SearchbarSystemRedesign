const { Client } = require("@elastic/elasticsearch");
const faker = require("faker");

const client = new Client({ node: "http://localhost:9200" });

const getRelevantNames = async term => {
  const result = await client.search({
    index: "items",
    body: {
      query: {
        match: {
          name: term
        }
      },
      size: 30
    }
  });
  return result;
};

const seedElasticDB = async quantity => {
  const seedResults = [];
  const putItem = async productId => {
    const { body } = await client.index({
      index: "items",
      body: {
        productId,
        name: faker.fake("{{name.firstName}} {{company.bsBuzz}}"),
        relevance: 0
      }
    });
    seedResults.push(body);
  };

  for (let i = 1; i <= quantity; i++) {
    await putItem(i).catch(e => console.log(e.stack));
  }
  return seedResults;
};

module.exports = { getRelevantNames, seedElasticDB };
