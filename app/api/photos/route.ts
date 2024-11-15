    // @ts-expect-error do it later
import clientPromise from "../../lib/mongodb";


// const fs = require('fs');

// // Import the JSON file and parse it into a JavaScript object
// const loadJson = () => {
//   try {
//     const data = fs.readFileSync('./app/lib/result.json', 'utf-8'); // Read the JSON file
//     const jsObject = JSON.parse(data); // Parse the JSON data into a JavaScript object

//     console.log('Imported JavaScript object:', jsObject);
//     return jsObject;
//   } catch (error) {
//     console.error('Error reading or parsing the JSON file:', error);
//   }
// };

// Call the function to load and parse the JSON


export async function GET(request: Request) {
    // @ts-expect-error do it later
  const client = await clientPromise;
  const db = client.db("meme");
  console.log(db)
  const imagesCollection = db.collection("images"); // Replace with your collection name

  // const resultObject = loadJson();
  // console.log(resultObject)
  // imagesCollection.insertMany(resultObject)

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  console.log(page, limit);
  const start = (page - 1) * limit;
  // const end = start + limit;
  // Fetch paginated data

  const photos = await imagesCollection
    .find({})
    .skip(start)
    .limit(limit)
    .toArray();


console.log(photos)

  // const photos = imagesList.slice(start, end);

  return Response.json(photos);
}
