import { runMkdocsServer } from "./mkdocsServer";
import { run } from "./run";

jest.mock("./run", () => {
  return {
    run: jest.fn()
  };
});

describe("runMkdocsServer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("docker", () => {
    it("should run docker directly by default", async () => {
      await runMkdocsServer({});

      const quotedCwd = `'${process.cwd()}':/content`;
      expect(run).toHaveBeenCalledWith(
        "docker",
        expect.arrayContaining([
          "run",
          quotedCwd,
          "8000:8000",
          "serve",
          "--dev-addr",
          "0.0.0.0:8000",
          "spotify/techdocs"
        ]),
        expect.objectContaining({})
      );
    });

    it("should accept port option", async () => {
      await runMkdocsServer({ port: "5678" });
      expect(run).toHaveBeenCalledWith(
        "docker",
        expect.arrayContaining(["5678:5678", "0.0.0.0:5678"]),
        expect.objectContaining({})
      );
    });

    it("should accept custom docker image", async () => {
      await runMkdocsServer({ dockerImage: "my-org/techdocs" });
      expect(run).toHaveBeenCalledWith(
        "docker",
        expect.arrayContaining(["my-org/techdocs"]),
        expect.objectContaining({})
      );
    });
  });

  describe("mkdocs", () => {
    it("should run mkdocs if specified ", async () => {
      await runMkdocsServer({ useDocker: false });

      expect(run).toHaveBeenCalledWith(
        "mkdocs",
        expect.arrayContaining(["serve", "--dev-addr", "127.0.0.1:8000"]),
        expect.objectContaining({})
      );
    });

    it("should accept port option", async () => {
      await runMkdocsServer({ useDocker: false, port: "5678" });
      expect(run).toHaveBeenCalledWith(
        "mkdocs",
        expect.arrayContaining(["127.0.0.1:5678"]),
        expect.objectContaining({})
      );
    });
  });
});
