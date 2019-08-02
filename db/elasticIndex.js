const { Client } = require("@elastic/elasticsearch");
const faker = require("faker");

const client = new Client({ node: "http://localhost:9200" });

const getRelevantNames = async term => {
  const { body } = await client.search({
    body: {
      query: {
        fuzzy: {
          name: term
        }
      },
      _source: ["productId", "name"],
      size: 100
    }
  });
  return body.hits;
};

const getOneId = async name => {
  const { body } = await client.search({
    body: {
      query: {
        match: {
          name
        }
      },
      _source: ["productId"],
      size: 1
    }
  });
  return body.hits;
};

const seedElasticDB = async quantity => {
  //   const seedResults = [];
  let category;
  let categoryName;
  let productId = 1;

  const selectCategory = () => {
    const dict = {
      1: "names",
      2: "jobs",
      3: "ipsums",
      4: "hacks",
      5: "colors",
      6: "products",
      7: "buzzes",
      8: "departments"
    };
    category = Math.floor(Math.random() * 8) + 1;
    categoryName = dict[category];
    return dict[category];
  };

  const genName = () => {
    const dict = {
      1: faker.name.firstName(),
      2: faker.name.jobType(),
      3: faker.lorem.word(),
      4: faker.hacker.noun(),
      5: faker.commerce.color(),
      6: faker.commerce.productName(),
      7: faker.company.bsBuzz(),
      8: faker.commerce.department()
    };
    return dict[category];
  };

  const genItems = count => {
    let bulk = "";
    for (let i = 1; i <= count; i++) {
      bulk += `${JSON.stringify({ index: { _id: productId } })}\n`;
      bulk += `${JSON.stringify({
        productId,
        name: genName()
      })}\n`;
      productId += 1;
    }
    return bulk;
  };

  const putItem = async () => {
    const index = selectCategory();
    const bulkInsert = genItems(200);
    const { body } = await client.bulk({ index, body: bulkInsert });
    // seedResults.push(body);
  };

  for (let i = 1; i <= quantity; i++) {
    putItem().catch(e => console.log(e.stack));
    console.log(i, categoryName);
  }
  return "all done!";
};

const fakeString =
  "{{name.firstName}} {{commerce.productName}} {{company.bsBuzz}} {{hacker.ingverb}} {{commerce.color}}";

module.exports = { getRelevantNames, getOneId, seedElasticDB };
