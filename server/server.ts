import express from "express";

const app = express();
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Die Rezepte liegen in der Collection „rezepte“ der MongoDB-Datenbank „kochrezepte“.
// Ohne Umgebungsvariable MONGODB_URL wird eine lokal installierte MongoDB verwendet.
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";
const client = new MongoClient(MONGODB_URL, { serverSelectionTimeoutMS: 5000 });
const rezepte = client.db("kochrezepte").collection("rezepte");

const beispielrezepte = [
    { name: "Omas Apfelkuchen", autor: "Oma", dauerMinuten: 75 },
    { name: "Papas Gulasch", autor: "Papa", dauerMinuten: 90 },
    { name: "Kartoffelsuppe", autor: "Mama", dauerMinuten: 40 },
    { name: "Pfannkuchen", autor: "Lena", dauerMinuten: 20 },
    { name: "Gemüse-Lasagne", autor: "Opa", dauerMinuten: 60 },
];

// Legt die Beispielrezepte einmalig an, solange die DB-Collection noch leer ist.
async function beispielrezepteAnlegen() {
    if ((await rezepte.countDocuments()) === 0) {
        await rezepte.insertMany(beispielrezepte);
        console.log("Beispielrezepte in MongoDB angelegt");
    }
}

beispielrezepteAnlegen().catch(() => {
    console.error(`MongoDB ist unter ${MONGODB_URL} nicht erreichbar. Läuft der MongoDB-Dienst?`);
});

app.get("/rezepte", async (req, res) => {
    res.json(await rezepte.find().toArray());
});

app.get("/rezepte/:id", async (req, res) => {
    const rezept = ObjectId.isValid(req.params.id)
        ? await rezepte.findOne({ _id: new ObjectId(req.params.id) })
        : null;
    if (!rezept) {
        res.status(404).json({ error: "Rezept nicht gefunden" });
        return;
    }
    res.json(rezept);
});

app.post("/rezepte", async (req, res) => {
    if (!req.body || typeof req.body.name !== "string" || !req.body.name.trim()) {
        res.status(400).json({ error: "name darf nicht leer sein" });
        return;
    }
    if (typeof req.body.autor !== "string" || !req.body.autor.trim()) {
        res.status(400).json({ error: "autor darf nicht leer sein" });
        return;
    }
    if (
        typeof req.body.dauerMinuten !== "number" ||
        !Number.isFinite(req.body.dauerMinuten) ||
        req.body.dauerMinuten <= 0
    ) {
        res.status(400).json({ error: "dauerMinuten muss eine Zahl größer als 0 sein" });
        return;
    }
    const rezept = {
        name: req.body.name.trim(),
        autor: req.body.autor.trim(),
        dauerMinuten: req.body.dauerMinuten,
    };
    const ergebnis = await rezepte.insertOne(rezept);
    res.status(201).json({ ...rezept, _id: ergebnis.insertedId });
});

// Fehler aus den Routen, etwa bei nicht erreichbarer Datenbank, als JSON beantworten.
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.message);
    res.status(500).json({ error: "Die Datenbank ist gerade nicht erreichbar." });
});

app.listen(3001, () => {
    console.log("Server läuft unter http://localhost:3001");
});
