import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

import glob from "glob";

const TTSC_CMD = `${__dirname}/../node_modules/ttypescript/bin/tsc`;
const FIXTURES_DIR = `${__dirname}/fixtures`;

child_process.execSync(`${TTSC_CMD}`, { cwd: __dirname });

describe("transform", () => {
  afterAll(() => {
    child_process.execSync(`${TTSC_CMD} --build --clean`, { cwd: __dirname });
  });

  const pathNames = glob.sync(`${FIXTURES_DIR}/cases/*.js`);
  for (const pathName of pathNames) {
    const caseName = path.basename(pathName, ".js");
    const fileName = `${caseName}.js`;

    test(caseName, () => {
      const transformedCode = fs.readFileSync(pathName).toString();
      const expectedCode = fs
        .readFileSync(`${FIXTURES_DIR}/targets/${fileName}`)
        .toString();

      expect(transformedCode).toEqual(expectedCode);
    });
  }
});
