import { Session } from "inspector";
import { Grapper } from "./src/grapper";

const session: Session = new Session();

const grapper = new Grapper(session);
const str = grapper.scan({
    a: 1,
    b: 2,
    and: {
        x: 2,
        y: 1,
        or: {
            m: 3
        },
        and: {
            k: "ccc"
        }
    },
    or: {
        XXX: 'xxxx'
    },
    O: 'p'
});
console.log(str);