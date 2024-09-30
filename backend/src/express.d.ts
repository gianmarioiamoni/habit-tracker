import { IUser } from "./models/Users";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the 'user' property to the 'Request' interface, which is of type 'user'
    }
  }
}
