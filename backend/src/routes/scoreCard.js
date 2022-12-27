import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();
const saveScoreCard = async (name, subject, score) => {
    const existing = await ScoreCard.findOne({ name: name, subject: subject });
    if (existing) {
        await ScoreCard.updateOne({ _id: existing._id }, { score: score });
        const msg = `Updating (${name}, ${subject}, ${score})`
        return { msg: msg, crd: existing }
    }
    else {
        const newScoreCard = new ScoreCard({ name, subject, score });
        console.log("Created ScoreCard", newScoreCard);
        const msg = `Adding (${name}, ${subject}, ${score})`
        newScoreCard.save();
        return { msg: msg, crd: existing }
    }
};
const deleteDB = async () => {
    await ScoreCard.deleteMany({});
};

router.delete("/cards", async (req, res) => {
    await deleteDB();
    const message = "Database cleared"
    res.json({ message });
})

router.post("/card", async (req, res) => {
    const { msg, crd } = await saveScoreCard(req.body.name, req.body.subject, req.body.score);
    res.json({ message: msg, card: crd })
});

router.get("/cards", async (req, res) => {
    if (req.query.type === 'name') {
        const existing = await ScoreCard.find({ name: req.query.queryString });
        const messages = await existing.map(message =>
            `Found card with name:  (${message.name}, ${message.subject}, ${message.score})`
        )
        if (existing.length === 0) {
            res.json({ messages: false, message: `Name ${req.query.name} not found!` })
        }
        else {
            res.json({ messages, message: `` })
        }

    }
    else {
        const existing = await ScoreCard.find({ subject: req.query.queryString });
        const messages = await existing.map(message =>
            `Found card with name:  (${message.name}, ${message.subject}, ${message.score})`
        )
        if (existing.length === 0) {
            res.json({ message: `Subject ${req.query.subject} not found!` })
        }
        else {
            res.json({ messages, message: `` })
        }

    }

});
export default router;
