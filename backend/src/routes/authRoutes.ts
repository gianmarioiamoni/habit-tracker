import express from "express";
import { signup, login } from "../controllers/authController";

const router = express.Router();

// router.post("/signup", signup);
// router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
//   signup(req, res, next)
//     .then(() => {
//         // Handle successful response
//         res.json({ message: "User created successfully" });
//     })
//     .catch((error) => {
//         // Handle error response
//         res.status(500).json({
//             message: "Error creating user",
//             error: error,
//         });
//     });
// });

router.post("/signup", signup);
router.post("/login", login);

export default router;
