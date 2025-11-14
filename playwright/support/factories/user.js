
import { faker } from "@faker-js/faker";

 export const createUser = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: faker.internet.password(),
    };
}