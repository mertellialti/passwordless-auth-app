import { Base } from "../base/base";

export class Account extends Base {
    username: string | undefined
    currentChallenge: string | undefined;
}