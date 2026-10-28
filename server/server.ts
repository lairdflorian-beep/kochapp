import express from "express";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const rezepte = [
    { id: 1, name: "Omas Apfelkuchen", autor: "Oma", dauerMinuten: 75 },
    { id: 2, name: "Papas Gulasch", autor: "Papa", dauerMinuten: 90 },
    { id: 3, name: "Kartoffelsuppe", autor: "Mama", dauerMinuten: 40 },
    { id: 4, name: "Pfannkuchen", autor: "Lena", dauerMinuten: 20 },
    { id: 5, name: "Gemüse-Lasagne", autor: "Opa", dauerMinuten: 60 },
];

app.get("/rezepte", (req, res) => {
    res.json(rezepte);
});

app.get("/rezepte/:id", (req, res) => {
    const rezept = rezepte.find((r) => r.id === Number(req.params.id));
    if (!rezept) {
        res.status(404).json({ error: "Rezept nicht gefunden" });
        return;
    }
    res.json(rezept);
});

let naechsteId = rezepte.length + 1;

app.post("/rezepte", (req, res) => {
    if (!req.body || typeof req.body.name !== "string" || !req.body.name.trim()) {
        res.status(400).json({ error: "name muss ein nicht leerer Text sein" });
        return;
    }
    if (typeof req.body.autor !== "string" || !req.body.autor.trim()) {
        res.status(400).json({ error: "autor muss ein nicht leerer Text sein" });
        return;
    }
    if (
        typeof req.body.dauerMinuten !== "number" ||
        !Number.isFinite(req.body.dauerMinuten) ||
        req.body.dauerMinuten <= 0
    ) {
        res.status(400).json({ error: "dauerMinuten muss eine endliche Zahl größer als 0 sein" });
        return;
    }
    const rezept = {
        id: naechsteId,
        name: req.body.name.trim(),
        autor: req.body.autor.trim(),
        dauerMinuten: req.body.dauerMinuten,
    };
    naechsteId = naechsteId + 1;
    rezepte.push(rezept);
    res.status(201).json(rezept);
});

app.listen(3000, () => {
    console.log("Server läuft unter http://localhost:3000");
});
