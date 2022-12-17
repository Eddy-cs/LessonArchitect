import { getData } from "./firebase-config";

export default async function getClientData(req, res) {
  if (req.method === "POST") {
    const allDocuments = await getData();
    for (let i = 0; i < allDocuments.length; i++) {
      if (allDocuments[i].uid === req.body.uid) {
        res.status(200).json(allDocuments[i]);
      }
    }
  }
}
