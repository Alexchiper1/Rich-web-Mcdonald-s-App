import { MongoClient } from "mongodb";

export async function GET(req) {
  try {
    console.log("Register api");

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const pass = searchParams.get("pass");
    const address = searchParams.get("address");
    const telephone = searchParams.get("telephone");

    // CORRECT CONNECTION STRING
    const uri = "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0";

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("app");
    const users = db.collection("Users");

    // find if email already exists
    const userExist = await users.findOne({ email: email });

    if(userExist){
      console.log("Email already in use");
      return Response.json({
        data: "email_exists"
      });
    }

    await users.insertOne({
          email: email,
          pass: pass,
          address: address,
          telephone: telephone,
          acctype: "customer"
        });

        console.log("User inserted successfully");

        return Response.json({
          data: "inserted"
        });

      } catch (err) {
        console.log("REGISTER API ERROR:", err);

        return Response.json({
          data: "error"
        });
      }
    }