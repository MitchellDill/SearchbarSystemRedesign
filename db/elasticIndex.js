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
  //   const seedResults = [];
  let productId = 1;

  const putItem = async () => {
    const bulkInsert = genItems(200);
    const { body } = await client.bulk({ index: "items", body: bulkInsert });
    // seedResults.push(body);
  };

  const genItems = count => {
    let bulk = "";
    for (let i = 1; i <= count; i++) {
      bulk += `${JSON.stringify({ index: { _id: productId } })}\n`;
      bulk += `${JSON.stringify({
        productId,
        name: faker.fake("{{name.firstName}}")
      })}\n`;
      productId += 1;
    }
    return bulk;
  };

  for (let i = 1; i <= quantity; i++) {
    putItem().catch(e => console.log(e.stack));
    console.log(i);
  }
  return "all done!";
};

const fakeString =
  "{{name.firstName}} {{commerce.productName}} {{company.bsBuzz}} {{hacker.ingverb}} {{commerce.color}}";

module.exports = { getRelevantNames, seedElasticDB };
