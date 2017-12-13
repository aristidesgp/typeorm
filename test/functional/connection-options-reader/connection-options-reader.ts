import {expect} from "chai";
import {ConnectionOptions} from "../../../src/connection/ConnectionOptions";
import {ConnectionOptionsReader} from "../../../src/connection/ConnectionOptionsReader";

describe("ConnectionOptionsReader", () => {
  it("properly loads config with entities specified", async () => {
    type EntititesList = Function[] | string[];
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/class-entities" });
    const options: ConnectionOptions = await connectionOptionsReader.get("test-conn");
    expect(options.entities).to.be.an.instanceOf(Array);
    const entities: EntititesList = options.entities as EntititesList;
    expect(entities.length).to.equal(1);
  });
});