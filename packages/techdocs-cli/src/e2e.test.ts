import { spawn } from 'child_process';

describe('end-to-end', () => {
  it('shows help text', async () => {
    const proc = await executeTechDocsCliCommand(['--help']);

    expect(proc.combinedStdOutErr).toContain('Usage: techdocs-cli [options]');
    expect(proc.exit).toEqual(0);
  });

  it('can generate', async () => {
    jest.setTimeout(10000);
    const proc = await executeTechDocsCliCommand(
      ['generate', '--no-docker', '-v'],
      {
        cwd: '../../',
        killAfter: 8000,
      },
    );

    expect(proc.combinedStdOutErr).toContain('Successfully generated docs');
    expect(proc.exit).toEqual(0);
  });

  it('can serve in mkdocs', async () => {
    jest.setTimeout(10000);
    const proc = await executeTechDocsCliCommand(
      ['serve:mkdocs', '--no-docker', '-v'],
      {
        cwd: '../../',
        killAfter: 8000,
      },
    );

    expect(proc.combinedStdOutErr).toContain('Starting mkdocs server');
    expect(proc.exit).toEqual(0);
  });

  it('can serve in backstage', async () => {
    jest.setTimeout(10000);
    const proc = await executeTechDocsCliCommand(
      ['serve', '--no-docker', '--mkdocs-port=8888', '-v'],
      {
        cwd: '../../',
        killAfter: 8000,
      },
    );

    expect(proc.combinedStdOutErr).toContain('Starting mkdocs server');
    expect(proc.combinedStdOutErr).toContain('Serving docs in Backstage at');
    expect(proc.exit).toEqual(0);
  });
});

type CommandResponse = {
  stdout: string;
  stderr: string;
  combinedStdOutErr: string;
  exit: number;
};

type ExecuteCommandOptions = {
  killAfter?: number;
  cwd?: string;
};

function executeTechDocsCliCommand(
  args: string[],
  opts: ExecuteCommandOptions = {},
): Promise<CommandResponse> {
  return new Promise(resolve => {
    const pathToCli = `${__dirname}/../bin/techdocs-cli`;
    const commandResponse = {
      stdout: '',
      stderr: '',
      combinedStdOutErr: '',
      exit: 0,
    };

    const listen = spawn(pathToCli, args, {
      cwd: opts.cwd,
    });

    const stdOutChunks: any[] = [];
    const stdErrChunks: any[] = [];
    const combinedChunks: any[] = [];

    listen.stdout.on('data', data => {
      stdOutChunks.push(data);
      combinedChunks.push(data);
    });

    listen.stderr.on('data', data => {
      stdErrChunks.push(data);
      combinedChunks.push(data);
    });

    listen.on('exit', code => {
      commandResponse.exit = code as number;
      commandResponse.stdout = Buffer.concat(stdOutChunks).toString('utf8');
      commandResponse.stderr = Buffer.concat(stdErrChunks).toString('utf8');
      commandResponse.combinedStdOutErr =
        Buffer.concat(combinedChunks).toString('utf8');
      resolve(commandResponse);
    });

    if (opts.killAfter) {
      setTimeout(() => {
        listen.kill('SIGTERM');
      }, opts.killAfter);
    }
  });
}
